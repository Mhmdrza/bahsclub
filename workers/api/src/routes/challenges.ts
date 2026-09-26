import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, ensureNotBlocked, err, ok, getPagination, paginatedResponse, upsertNotification } from "../lib";

const challenges = new Hono<{ Bindings: { DB: D1Database } }>();

challenges.get("/", async (c) => {
  const { tag, username } = c.req.query();
  const pg = getPagination(c.req.query());

  const params: any[] = [];
  const fromJoin = ["FROM challenges s"];
  const where: string[] = ["s.moderation_state != 'removed'"];

  if (tag) {
    fromJoin.push("JOIN challenge_tags st ON s.id = st.challenge_id JOIN tags t ON st.tag_id = t.id");
    where.push("t.slug = ?");
    params.push(tag);
  }
  if (username) {
    fromJoin.push("JOIN users u ON s.user_id = u.id");
    where.push("u.username = ?");
    params.push(username);
  }

  const whereClause = where.join(" AND ");
  const fromClause = fromJoin.join(" ");

  const dataSql = `SELECT s.*, 
    (SELECT COUNT(*) FROM votes WHERE voteable_type = 'challenge' AND voteable_id = s.id) as vote_count,
    (SELECT COUNT(*) FROM challenge_responses WHERE challenge_id = s.id) as response_count,
    (SELECT COUNT(*) FROM debates d WHERE d.challenge_id = s.id AND d.status = 'in_progress') as active_debate_count
    ${fromClause} WHERE ${whereClause}
    GROUP BY s.id ORDER BY vote_count DESC LIMIT ? OFFSET ?`;
  params.push(pg.limit, pg.offset);

  const countParams = params.slice(0, -2);
  const countSql = `SELECT COUNT(DISTINCT s.id) as total ${fromClause} WHERE ${whereClause}`;

  const [{ total }] = (await c.env.DB.prepare(countSql).bind(...countParams).all<{ total: number }>()).results || [{ total: 0 }];
  const { results } = await c.env.DB.prepare(dataSql).bind(...params).all<any>();

  const items = [];
  for (const s of (results || [])) {
    const { results: tagRows } = await c.env.DB.prepare(
      "SELECT t.id, t.name, t.slug FROM tags t JOIN challenge_tags st ON t.id = st.tag_id WHERE st.challenge_id = ?"
    ).bind(s.id).all<any>();
    items.push({ ...s, tags: tagRows || [] });
  }

  return paginatedResponse(items, pg.page, pg.limit, total);
});

challenges.post("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { title, content, tags: tagNames } = await c.req.json<{ title: string; content: string; tags: string[] }>();
  if (!title || title.length < 5) return err("عنوان حداقل ۵ حرف");
  if (!content || content.length < 50) return err("چالش حداقل ۵۰ حرف");
  if (!tagNames || tagNames.length === 0 || tagNames.length > 5) return err("حداقل ۱ و حداکثر ۵ برچسب");

  const tagIds: number[] = [];
  for (const name of tagNames) {
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9_\u0600-\u06FF\s-]/g, "").replace(/\s+/g, "-");
    if (!slug) continue;
    let tag = await c.env.DB.prepare("SELECT id FROM tags WHERE slug = ?").bind(slug).first<any>();
    if (!tag) {
      const r = await c.env.DB.prepare("INSERT INTO tags (name, slug, created_by) VALUES (?, ?, ?) RETURNING id").bind(name.trim(), slug, user!.id).run();
      tag = { id: r.results![0].id };
    }
    if (!tagIds.includes(tag.id)) tagIds.push(tag.id);
  }

  const now = new Date().toISOString();
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO challenges (user_id, username, title, content, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  ).bind(user!.id, user!.username, title, content, now).run();
  const challengeId = inserted![0].id as number;

  try {
    const batch = tagIds.map(tid =>
      c.env.DB.prepare("INSERT INTO challenge_tags (challenge_id, tag_id) VALUES (?, ?)").bind(challengeId, tid)
    );
    if (batch.length) await c.env.DB.batch(batch);
  } catch {
    await c.env.DB.prepare("DELETE FROM challenges WHERE id = ?").bind(challengeId).run();
    return err("خطا در ثبت برچسب‌ها");
  }

  return ok({ id: challengeId });
});

challenges.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const stmt = await c.env.DB.prepare("SELECT * FROM challenges WHERE id = ?").bind(id).first<any>();
  if (!stmt || stmt.moderation_state === "removed") return err("چالش یافت نشد", 404);

  const creator = await c.env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(stmt.user_id).first<any>();

  const { results: tags } = await c.env.DB.prepare(
    "SELECT t.id, t.name, t.slug FROM tags t JOIN challenge_tags st ON t.id = st.tag_id WHERE st.challenge_id = ?"
  ).bind(id).all<any>();

  const { results: responses } = await c.env.DB.prepare(
    "SELECT cs.*, u.username, d.id as debate_id, d.status as debate_status FROM challenge_responses cs JOIN users u ON cs.user_id = u.id LEFT JOIN debates d ON d.counter_response_id = cs.id WHERE cs.challenge_id = ? ORDER BY cs.created_at"
  ).bind(id).all<any>();

  const { results: debates } = await c.env.DB.prepare(
    "SELECT d.id, d.title, d.status, d.opponent_id, u.username as opponent_username FROM debates d LEFT JOIN users u ON d.opponent_id = u.id WHERE d.challenge_id = ?"
  ).bind(id).all<any>();

  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const userVotes = new Set<string>();

  if (user) {
    const myVotes = await c.env.DB.prepare("SELECT voteable_type, voteable_id FROM votes WHERE user_id = ?").bind(user.id).all<any>();
    for (const v of (myVotes.results || [])) userVotes.add(`${v.voteable_type}:${v.voteable_id}`);
  }

  const [stmtVc] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM votes WHERE voteable_type = 'challenge' AND voteable_id = ?").bind(id).all<any>()).results || [{ cnt: 0 }];

  const responseVoteMap: Record<number, number> = {};
  if (responses?.length) {
    const cvRows = await c.env.DB.prepare(
      `SELECT voteable_id, COUNT(*) as cnt FROM votes WHERE voteable_type = 'challenge_response' AND voteable_id IN (${responses.map(() => '?').join(',')}) GROUP BY voteable_id`
    ).bind(...responses.map((c: any) => c.id)).all<any>();
    for (const v of (cvRows.results || [])) responseVoteMap[v.voteable_id] = v.cnt;
  }

  return ok({
    challenge: stmt,
    creator,
    tags: tags || [],
    responses: (responses || []).map((c: any) => ({
      ...c,
      voteCount: responseVoteMap[c.id] || 0,
      userVoted: userVotes.has(`challenge_response:${c.id}`),
    })),
    debates: debates || [],
    challengeVoteCount: (stmtVc as any).cnt,
    challengeVoted: userVotes.has(`challenge:${id}`),
    user,
  });
});

challenges.post("/:id/responses", async (c) => {
  const challengeId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { content } = await c.req.json<{ content: string }>();
  if (!content || content.length < 50) return err("نقد حداقل ۵۰ حرف");

  const stmt = await c.env.DB.prepare("SELECT * FROM challenges WHERE id = ?").bind(challengeId).first<any>();
  if (!stmt || stmt.moderation_state === "removed") return err("چالش یافت نشد", 404);
  if (stmt.user_id === user!.id) return err("نمی‌توانید به چالش خودتان پاسخ دهید");

  await c.env.DB.prepare("INSERT INTO challenge_responses (challenge_id, user_id, content) VALUES (?, ?, ?)")
    .bind(challengeId, user!.id, content).run();

  await upsertNotification(c.env.DB, stmt.user_id, "new_response", "challenge", challengeId,
    `${user!.username} نقدی برای چالش «${stmt.title}» ثبت کرد`);

  return ok({ success: true });
});

challenges.post("/:id/responses/:rid/debate", async (c) => {
  const challengeId = parseInt(c.req.param("id"));
  const responseId = parseInt(c.req.param("rid"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const stmt = await c.env.DB.prepare("SELECT * FROM challenges WHERE id = ?").bind(challengeId).first<any>();
  if (!stmt) return err("چالش یافت نشد", 404);
  if (stmt.user_id !== user!.id) return err("فقط ایجادکننده چالش می‌تواند مباحثه را شروع کند");

  const response = await c.env.DB.prepare("SELECT * FROM challenge_responses WHERE id = ? AND challenge_id = ?").bind(responseId, challengeId).first<any>();
  if (!response) return err("نقد یافت نشد", 404);
  if (response.status !== "pending") return err("این نقد قبلاً استفاده شده");

  const now = new Date().toISOString();
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO debates (challenge_id, counter_response_id, creator_id, creator_username, opponent_id, title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?) RETURNING id"
  ).bind(challengeId, responseId, user!.id, user!.username, response.user_id, stmt.title, now, now).run();
  const debateId = inserted![0].id as number;

  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE challenge_responses SET status = 'debating' WHERE id = ?").bind(responseId),
    c.env.DB.prepare("INSERT INTO debate_tags (debate_id, tag_id) SELECT ?, tag_id FROM challenge_tags WHERE challenge_id = ?").bind(debateId, challengeId),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, stmt.user_id, stmt.content, now),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, response.user_id, response.content, now),
  ]);

  await upsertNotification(c.env.DB, response.user_id, "debate_started", "debate", debateId,
    `${user!.username} مباحثه‌ای با نقد شما بر «${stmt.title}» شروع کرد`);

  return ok({ id: debateId });
});

// Any logged-in user can accept a challenge directly: creates the response +
// the debate in one step (challenge author becomes creator, challenger opponent).
challenges.post("/:id/debate", async (c) => {
  const challengeId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { content } = await c.req.json<{ content: string }>();
  if (!content || content.length < 50) return err("موضع شما حداقل ۵۰ حرف");

  const stmt = await c.env.DB.prepare("SELECT * FROM challenges WHERE id = ?").bind(challengeId).first<any>();
  if (!stmt || stmt.moderation_state === "removed") return err("چالش یافت نشد", 404);
  if (stmt.user_id === user!.id) return err("نمی‌توانید با چالش خودتان مباحثه کنید");

  const now = new Date().toISOString();
  const { results: insertedResponse } = await c.env.DB.prepare(
    "INSERT INTO challenge_responses (challenge_id, user_id, content, status, created_at) VALUES (?, ?, ?, 'debating', ?) RETURNING id"
  ).bind(challengeId, user!.id, content, now).run();
  const responseId = insertedResponse![0].id as number;

  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO debates (challenge_id, counter_response_id, creator_id, creator_username, opponent_id, title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?) RETURNING id"
  ).bind(challengeId, responseId, stmt.user_id, stmt.username, user!.id, stmt.title, now, now).run();
  const debateId = inserted![0].id as number;

  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO debate_tags (debate_id, tag_id) SELECT ?, tag_id FROM challenge_tags WHERE challenge_id = ?").bind(debateId, challengeId),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, stmt.user_id, stmt.content, now),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, user!.id, content, now),
  ]);

  await upsertNotification(c.env.DB, stmt.user_id, "debate_started", "debate", debateId,
    `${user!.username} مباحثه‌ای برای چالش «${stmt.title}» شروع کرد`);

  return ok({ id: debateId });
});

export { challenges };