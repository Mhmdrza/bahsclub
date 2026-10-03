import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, ensureNotBlocked, err, ok, getPagination, paginatedResponse, upsertNotification } from "../lib";

const ideas = new Hono<{ Bindings: { DB: D1Database } }>();

const IDEA_COLUMNS = "i.*, " +
  "(SELECT COUNT(*) FROM votes WHERE voteable_type = 'idea' AND voteable_id = i.id) as vote_count, " +
  "(SELECT COUNT(*) FROM idea_responses WHERE idea_id = i.id) as response_count, " +
  "(SELECT COUNT(*) FROM idea_responses WHERE idea_id = i.id AND kind = 'challenge') as challenge_count, " +
  "(SELECT COUNT(*) FROM debates d WHERE d.idea_id = i.id AND d.status = 'in_progress') as active_debate_count";

async function attachTags(db: D1Database, rows: any[]) {
  const items = [];
  for (const s of rows || []) {
    const { results: tagRows } = await db.prepare(
      "SELECT t.id, t.name, t.slug FROM tags t JOIN idea_tags it ON t.id = it.tag_id WHERE it.idea_id = ?"
    ).bind(s.id).all<any>();
    items.push({ ...s, tags: tagRows || [] });
  }
  return items;
}

function slugifyTag(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_\u0600-\u06FF\s-]/g, "").replace(/\s+/g, "-");
}

async function resolveTagIds(db: D1Database, userId: number, tagNames: string[]): Promise<number[]> {
  const tagIds: number[] = [];
  for (const name of tagNames) {
    const slug = slugifyTag(name);
    if (!slug) continue;
    let tag = await db.prepare("SELECT id FROM tags WHERE slug = ?").bind(slug).first<any>();
    if (!tag) {
      const r = await db.prepare("INSERT INTO tags (name, slug, created_by) VALUES (?, ?, ?) RETURNING id")
        .bind(name.trim(), slug, userId).run();
      tag = { id: r.results![0].id };
    }
    if (!tagIds.includes(tag.id)) tagIds.push(tag.id);
  }
  return tagIds;
}

// GET /api/ideas — list. feed=home blends followed authors + discovery.
ideas.get("/", async (c) => {
  const { tag, username, feed } = c.req.query();
  const pg = getPagination(c.req.query());

  const params: any[] = [];
  const fromJoin = ["FROM ideas i"];
  const where: string[] = ["i.moderation_state != 'removed'"];
  let followingIds: number[] = [];

  if (tag) {
    fromJoin.push("JOIN idea_tags it ON i.id = it.idea_id JOIN tags t ON it.tag_id = t.id");
    where.push("t.slug = ?");
    params.push(tag);
  }
  if (username) {
    where.push("i.username = ?");
    params.push(username);
  }

  const whereClause = where.join(" AND ");
  const fromClause = fromJoin.join(" ");

  if (feed === "home" || feed === "following") {
    const token = getAuthToken(c);
    const user = await getCurrentUser(c.env.DB, token);
    if (user) {
      const { results: follows } = await c.env.DB.prepare("SELECT followee_id FROM follows WHERE follower_id = ?")
        .bind(user.id).all<any>();
      followingIds = (follows || []).map((f: any) => f.followee_id);
    }

    if (followingIds.length) {
      const placeholders = followingIds.map(() => "?").join(",");
      const followParams = [...params, ...followingIds];
      const { results } = await c.env.DB.prepare(
        `SELECT ${IDEA_COLUMNS} ${fromClause} WHERE ${whereClause} AND i.user_id IN (${placeholders})
         ORDER BY i.created_at DESC LIMIT ? OFFSET ?`
      ).bind(...followParams, pg.limit, pg.offset).all<any>();
      const items = await attachTags(c.env.DB, results || []);

      // Blend: top discovery ideas the user does not already follow, to avoid an empty feed.
      if (items.length < pg.limit) {
        const excludeIds = items.map((x: any) => x.id);
        const notIn = excludeIds.length ? `AND i.id NOT IN (${excludeIds.map(() => "?").join(",")})` : "";
        const { results: discover } = await c.env.DB.prepare(
          `SELECT ${IDEA_COLUMNS} ${fromClause} WHERE ${whereClause} AND i.user_id NOT IN (${followingIds.map(() => "?").join(",")}) ${notIn}
           ORDER BY vote_count DESC LIMIT ?`
        ).bind(...params, ...followingIds, ...excludeIds, pg.limit - items.length).all<any>();
        items.push(...await attachTags(c.env.DB, discover || []));
      }
      return ok({ items, pagination: { page: pg.page, limit: pg.limit, total: items.length, hasMore: false }, feed: "home" });
    }
    // Not following anyone yet — fall through to discovery.
  }

  params.push(pg.limit, pg.offset);
  const countParams = params.slice(0, -2);
  const [{ total }] = (await c.env.DB.prepare(`SELECT COUNT(DISTINCT i.id) as total ${fromClause} WHERE ${whereClause}`)
    .bind(...countParams).all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(
    `SELECT ${IDEA_COLUMNS} ${fromClause} WHERE ${whereClause} GROUP BY i.id ORDER BY vote_count DESC, i.id DESC LIMIT ? OFFSET ?`
  ).bind(...params).all<any>();

  const items = await attachTags(c.env.DB, results || []);
  return paginatedResponse(items, pg.page, pg.limit, total);
});

// POST /api/ideas — publish an idea (title, reasoning, confidence, tags required).
ideas.post("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;
  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const body = await c.req.json<{
    title: string; reasoning: string; confidence: number;
    sources?: string; falsifier?: string; tags?: string[]; openToResponse?: boolean;
  }>();

  if (!body.title || body.title.trim().length < 5) return err("عنوان حداقل ۵ حرف");
  if (!body.reasoning || body.reasoning.trim().length < 50) return err("استدلال حداقل ۵۰ حرف");
  const confidence = Number.isFinite(body.confidence) ? Math.round(body.confidence) : NaN;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) return err("درصد اطمینان باید بین ۰ تا ۱۰۰ باشد");
  const tagNames = (body.tags || []).filter(Boolean);
  if (tagNames.length === 0 || tagNames.length > 5) return err("حداقل ۱ و حداکثر ۵ برچسب");

  const sources = (body.sources || "").slice(0, 2000);
  const falsifier = (body.falsifier || "").slice(0, 2000);
  const openToResponse = body.openToResponse === false ? 0 : 1;
  const now = new Date().toISOString();

  const { results: inserted } = await c.env.DB.prepare(
    `INSERT INTO ideas (user_id, username, title, reasoning, confidence, sources, falsifier, open_to_response, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(user!.id, user!.username, body.title.trim(), body.reasoning.trim(), confidence, sources, falsifier, openToResponse, now, now).run();
  const ideaId = inserted![0].id as number;

  try {
    const tagIds = await resolveTagIds(c.env.DB, user!.id, tagNames);
    const batch = [
      c.env.DB.prepare(
        `INSERT INTO idea_versions (idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
         VALUES (?, 1, ?, ?, ?, ?, ?, ?)`
      ).bind(ideaId, body.title.trim(), body.reasoning.trim(), confidence, sources, falsifier, now),
      ...tagIds.map(tid => c.env.DB.prepare("INSERT INTO idea_tags (idea_id, tag_id) VALUES (?, ?)").bind(ideaId, tid)),
    ];
    await c.env.DB.batch(batch);
  } catch {
    await c.env.DB.prepare("DELETE FROM ideas WHERE id = ?").bind(ideaId).run();
    return err("خطا در ثبت برچسب‌ها");
  }

  return ok({ id: ideaId });
});

// GET /api/ideas/:id
ideas.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const idea = await c.env.DB.prepare("SELECT * FROM ideas WHERE id = ?").bind(id).first<any>();
  if (!idea || idea.moderation_state === "removed") return err("اندیشه یافت نشد", 404);

  const creator = await c.env.DB.prepare(
    "SELECT id, username, bio, reputation, role FROM users WHERE id = ?"
  ).bind(idea.user_id).first<any>();

  const { results: tags } = await c.env.DB.prepare(
    "SELECT t.id, t.name, t.slug FROM tags t JOIN idea_tags it ON t.id = it.tag_id WHERE it.idea_id = ?"
  ).bind(id).all<any>();

  const { results: versions } = await c.env.DB.prepare(
    "SELECT * FROM idea_versions WHERE idea_id = ? ORDER BY version"
  ).bind(id).all<any>();

  const { results: responses } = await c.env.DB.prepare(
    `SELECT r.*, u.username, d.id as debate_id, d.status as debate_status
     FROM idea_responses r JOIN users u ON r.user_id = u.id
     LEFT JOIN debates d ON d.response_id = r.id
     WHERE r.idea_id = ? ORDER BY r.created_at`
  ).bind(id).all<any>();

  const { results: debates } = await c.env.DB.prepare(
    "SELECT d.id, d.title, d.status, d.opponent_id, u.username as opponent_username FROM debates d LEFT JOIN users u ON d.opponent_id = u.id WHERE d.idea_id = ?"
  ).bind(id).all<any>();

  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const userVotes = new Set<string>();
  let isFollowingAuthor = false;
  let authorFollowerCount = 0;

  if (user) {
    const myVotes = await c.env.DB.prepare("SELECT voteable_type, voteable_id FROM votes WHERE user_id = ?").bind(user.id).all<any>();
    for (const v of (myVotes.results || [])) userVotes.add(`${v.voteable_type}:${v.voteable_id}`);
    const f = await c.env.DB.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?").bind(user.id, idea.user_id).first();
    isFollowingAuthor = !!f;
  }
  const [fc] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM follows WHERE followee_id = ?").bind(idea.user_id).all<any>()).results || [{ cnt: 0 }];
  authorFollowerCount = (fc as any).cnt;

  const [ivc] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM votes WHERE voteable_type = 'idea' AND voteable_id = ?").bind(id).all<any>()).results || [{ cnt: 0 }];

  const responseVoteMap: Record<number, number> = {};
  if (responses?.length) {
    const { results: cvRows } = await c.env.DB.prepare(
      `SELECT voteable_id, COUNT(*) as cnt FROM votes WHERE voteable_type = 'idea_response' AND voteable_id IN (${responses.map(() => "?").join(",")}) GROUP BY voteable_id`
    ).bind(...responses.map((r: any) => r.id)).all<any>();
    for (const v of (cvRows || [])) responseVoteMap[v.voteable_id] = v.cnt;
  }

  return ok({
    idea,
    creator,
    tags: tags || [],
    versions: versions || [],
    responses: (responses || []).map((r: any) => ({
      ...r,
      voteCount: responseVoteMap[r.id] || 0,
      userVoted: userVotes.has(`idea_response:${r.id}`),
    })),
    debates: debates || [],
    voteCount: (ivc as any).cnt,
    voted: userVotes.has(`idea:${id}`),
    isFollowingAuthor,
    authorFollowerCount,
    user,
  });
});

// PATCH /api/ideas/:id — author edits; appends a version.
ideas.patch("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;
  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const idea = await c.env.DB.prepare("SELECT * FROM ideas WHERE id = ?").bind(id).first<any>();
  if (!idea || idea.moderation_state === "removed") return err("اندیشه یافت نشد", 404);
  if (idea.user_id !== user!.id) return err("فقط نویسنده می‌تواند ویرایش کند", 403);

  const body = await c.req.json<{
    title?: string; reasoning?: string; confidence?: number;
    sources?: string; falsifier?: string; tags?: string[]; openToResponse?: boolean;
  }>();

  const title = body.title !== undefined ? body.title.trim() : idea.title;
  const reasoning = body.reasoning !== undefined ? body.reasoning.trim() : idea.reasoning;
  const confidence = body.confidence !== undefined ? Math.round(body.confidence) : idea.confidence;
  const sources = body.sources !== undefined ? body.sources.slice(0, 2000) : idea.sources;
  const falsifier = body.falsifier !== undefined ? body.falsifier.slice(0, 2000) : idea.falsifier;
  const openToResponse = body.openToResponse !== undefined ? (body.openToResponse ? 1 : 0) : idea.open_to_response;

  if (title.length < 5) return err("عنوان حداقل ۵ حرف");
  if (reasoning.length < 50) return err("استدلال حداقل ۵۰ حرف");
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) return err("درصد اطمینان باید بین ۰ تا ۱۰۰ باشد");

  const now = new Date().toISOString();
  const [cur] = (await c.env.DB.prepare("SELECT MAX(version) as v FROM idea_versions WHERE idea_id = ?").bind(id).all<any>()).results || [{ v: 0 }];
  const nextVersion = ((cur as any).v || 0) + 1;

  const ops: D1PreparedStatement[] = [
    c.env.DB.prepare(
      "UPDATE ideas SET title = ?, reasoning = ?, confidence = ?, sources = ?, falsifier = ?, open_to_response = ?, updated_at = ? WHERE id = ?"
    ).bind(title, reasoning, confidence, sources, falsifier, openToResponse, now, id),
    c.env.DB.prepare(
      `INSERT INTO idea_versions (idea_id, version, title, reasoning, confidence, sources, falsifier, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, nextVersion, title, reasoning, confidence, sources, falsifier, now),
  ];

  if (body.tags !== undefined) {
    const tagNames = (body.tags || []).filter(Boolean).slice(0, 5);
    const tagIds = await resolveTagIds(c.env.DB, user!.id, tagNames);
    ops.push(c.env.DB.prepare("DELETE FROM idea_tags WHERE idea_id = ?").bind(id));
    for (const tid of tagIds) ops.push(c.env.DB.prepare("INSERT INTO idea_tags (idea_id, tag_id) VALUES (?, ?)").bind(id, tid));
  }

  await c.env.DB.batch(ops);
  return ok({ ok: true, version: nextVersion });
});

// POST /api/ideas/:id/responses — reply or structured challenge.
ideas.post("/:id/responses", async (c) => {
  const ideaId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;
  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { content, kind } = await c.req.json<{ content: string; kind?: string }>();
  const responseKind = kind === "challenge" ? "challenge" : "reply";
  const minLen = responseKind === "challenge" ? 50 : 30;
  if (!content || content.trim().length < minLen) {
    return err(responseKind === "challenge" ? "چالش ساختاریافته حداقل ۵۰ حرف" : "پاسخ حداقل ۳۰ حرف");
  }

  const idea = await c.env.DB.prepare("SELECT * FROM ideas WHERE id = ?").bind(ideaId).first<any>();
  if (!idea || idea.moderation_state === "removed") return err("اندیشه یافت نشد", 404);
  if (idea.user_id === user!.id) return err("نمی‌توانید به اندیشهٔ خودتان پاسخ دهید");
  if (!idea.open_to_response) return err("این اندیشه فعلاً برای پاسخ باز نیست");

  await c.env.DB.prepare("INSERT INTO idea_responses (idea_id, user_id, kind, content) VALUES (?, ?, ?, ?)")
    .bind(ideaId, user!.id, responseKind, content.trim()).run();

  await upsertNotification(c.env.DB, idea.user_id, "new_response", "idea", ideaId,
    responseKind === "challenge"
      ? `${user!.username} چالشی برای اندیشهٔ «${idea.title}» ثبت کرد`
      : `${user!.username} به اندیشهٔ «${idea.title}» پاسخ داد`);

  return ok({ success: true });
});

// POST /api/ideas/:id/responses/:rid/debate — idea author accepts a structured challenge.
ideas.post("/:id/responses/:rid/debate", async (c) => {
  const ideaId = parseInt(c.req.param("id"));
  const responseId = parseInt(c.req.param("rid"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;
  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const idea = await c.env.DB.prepare("SELECT * FROM ideas WHERE id = ?").bind(ideaId).first<any>();
  if (!idea) return err("اندیشه یافت نشد", 404);
  if (idea.user_id !== user!.id) return err("فقط نویسندهٔ اندیشه می‌تواند مباحثه را آغاز کند");

  const response = await c.env.DB.prepare("SELECT * FROM idea_responses WHERE id = ? AND idea_id = ?").bind(responseId, ideaId).first<any>();
  if (!response) return err("پاسخ یافت نشد", 404);
  if (response.status !== "pending") return err("این پاسخ قبلاً استفاده شده");
  if (response.user_id === user!.id) return err("نمی‌توانید با پاسخ خودتان مباحثه کنید");

  const now = new Date().toISOString();
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO debates (idea_id, response_id, creator_id, creator_username, opponent_id, title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?) RETURNING id"
  ).bind(ideaId, responseId, user!.id, user!.username, response.user_id, idea.title, now, now).run();
  const debateId = inserted![0].id as number;

  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE idea_responses SET status = 'debating' WHERE id = ?").bind(responseId),
    c.env.DB.prepare("INSERT INTO debate_tags (debate_id, tag_id) SELECT ?, tag_id FROM idea_tags WHERE idea_id = ?").bind(debateId, ideaId),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, idea.user_id, idea.reasoning, now),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, response.user_id, response.content, now),
  ]);

  await upsertNotification(c.env.DB, response.user_id, "debate_started", "debate", debateId,
    `${user!.username} مباحثه‌ای از چالش شما بر «${idea.title}» آغاز کرد`);

  return ok({ id: debateId });
});

// POST /api/ideas/:id/debate — anyone can raise a challenge directly (creates response + debate).
ideas.post("/:id/debate", async (c) => {
  const ideaId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;
  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { content } = await c.req.json<{ content: string }>();
  if (!content || content.trim().length < 50) return err("متن چالش حداقل ۵۰ حرف");

  const idea = await c.env.DB.prepare("SELECT * FROM ideas WHERE id = ?").bind(ideaId).first<any>();
  if (!idea || idea.moderation_state === "removed") return err("اندیشه یافت نشد", 404);
  if (idea.user_id === user!.id) return err("نمی‌توانید با اندیشهٔ خودتان مباحثه کنید");
  if (!idea.open_to_response) return err("این اندیشه فعلاً برای پاسخ باز نیست");

  const now = new Date().toISOString();
  const { results: insertedResponse } = await c.env.DB.prepare(
    "INSERT INTO idea_responses (idea_id, user_id, kind, content, status, created_at) VALUES (?, ?, 'challenge', ?, 'debating', ?) RETURNING id"
  ).bind(ideaId, user!.id, content.trim(), now).run();
  const responseId = insertedResponse![0].id as number;

  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO debates (idea_id, response_id, creator_id, creator_username, opponent_id, title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?) RETURNING id"
  ).bind(ideaId, responseId, idea.user_id, idea.username, user!.id, idea.title, now, now).run();
  const debateId = inserted![0].id as number;

  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO debate_tags (debate_id, tag_id) SELECT ?, tag_id FROM idea_tags WHERE idea_id = ?").bind(debateId, ideaId),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, idea.user_id, idea.reasoning, now),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, user!.id, content.trim(), now),
  ]);

  await upsertNotification(c.env.DB, idea.user_id, "debate_started", "debate", debateId,
    `${user!.username} چالشی برای اندیشهٔ «${idea.title}» آغاز کرد`);

  return ok({ id: debateId });
});

export { ideas };
