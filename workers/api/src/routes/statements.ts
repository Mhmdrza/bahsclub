import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, ensureNotBlocked, err, ok, getPagination, paginatedResponse, upsertNotification } from "../lib";

const statements = new Hono<{ Bindings: { DB: D1Database } }>();

statements.get("/", async (c) => {
  const { tag, username } = c.req.query();
  const pg = getPagination(c.req.query());

  const params: any[] = [];
  const fromJoin = ["FROM statements s"];
  const where: string[] = ["s.moderation_state != 'removed'"];

  if (tag) {
    fromJoin.push("JOIN statement_tags st ON s.id = st.statement_id JOIN tags t ON st.tag_id = t.id");
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
    (SELECT COUNT(*) FROM votes WHERE voteable_type = 'statement' AND voteable_id = s.id) as vote_count,
    (SELECT COUNT(*) FROM counter_statements WHERE statement_id = s.id) as counter_count,
    (SELECT COUNT(*) FROM debates d WHERE d.statement_id = s.id AND d.status = 'in_progress') as active_debate_count
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
      "SELECT t.id, t.name, t.slug FROM tags t JOIN statement_tags st ON t.id = st.tag_id WHERE st.statement_id = ?"
    ).bind(s.id).all<any>();
    items.push({ ...s, tags: tagRows || [] });
  }

  return paginatedResponse(items, pg.page, pg.limit, total);
});

statements.post("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { title, content, tags: tagNames } = await c.req.json<{ title: string; content: string; tags: string[] }>();
  if (!title || title.length < 5) return err("عنوان حداقل ۵ حرف");
  if (!content || content.length < 50) return err("بیانیه حداقل ۵۰ حرف");
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
    tagIds.push(tag.id);
  }

  const now = new Date().toISOString();
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO statements (user_id, username, title, content, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  ).bind(user!.id, user!.username, title, content, now).run();
  const statementId = inserted![0].id as number;

  try {
    const batch = tagIds.map(tid =>
      c.env.DB.prepare("INSERT INTO statement_tags (statement_id, tag_id) VALUES (?, ?)").bind(statementId, tid)
    );
    if (batch.length) await c.env.DB.batch(batch);
  } catch {
    await c.env.DB.prepare("DELETE FROM statements WHERE id = ?").bind(statementId).run();
    return err("خطا در ثبت برچسب‌ها");
  }

  return ok({ id: statementId });
});

statements.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const stmt = await c.env.DB.prepare("SELECT * FROM statements WHERE id = ?").bind(id).first<any>();
  if (!stmt || stmt.moderation_state === "removed") return err("بیانیه یافت نشد", 404);

  const creator = await c.env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(stmt.user_id).first<any>();

  const { results: tags } = await c.env.DB.prepare(
    "SELECT t.id, t.name, t.slug FROM tags t JOIN statement_tags st ON t.id = st.tag_id WHERE st.statement_id = ?"
  ).bind(id).all<any>();

  const { results: counters } = await c.env.DB.prepare(
    "SELECT cs.*, u.username FROM counter_statements cs JOIN users u ON cs.user_id = u.id WHERE cs.statement_id = ? ORDER BY cs.created_at"
  ).bind(id).all<any>();

  const { results: debates } = await c.env.DB.prepare(
    "SELECT d.id, d.title, d.status, d.opponent_id, u.username as opponent_username FROM debates d LEFT JOIN users u ON d.opponent_id = u.id WHERE d.statement_id = ?"
  ).bind(id).all<any>();

  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const userVotes = new Set<string>();

  if (user) {
    const myVotes = await c.env.DB.prepare("SELECT voteable_type, voteable_id FROM votes WHERE user_id = ?").bind(user.id).all<any>();
    for (const v of (myVotes.results || [])) userVotes.add(`${v.voteable_type}:${v.voteable_id}`);
  }

  const [stmtVc] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM votes WHERE voteable_type = 'statement' AND voteable_id = ?").bind(id).all<any>()).results || [{ cnt: 0 }];

  const counterVoteMap: Record<number, number> = {};
  if (counters?.length) {
    const cvRows = await c.env.DB.prepare(
      `SELECT voteable_id, COUNT(*) as cnt FROM votes WHERE voteable_type = 'counter_statement' AND voteable_id IN (${counters.map(() => '?').join(',')}) GROUP BY voteable_id`
    ).bind(...counters.map((c: any) => c.id)).all<any>();
    for (const v of (cvRows.results || [])) counterVoteMap[v.voteable_id] = v.cnt;
  }

  return ok({
    statement: stmt,
    creator,
    tags: tags || [],
    counters: (counters || []).map((c: any) => ({
      ...c,
      voteCount: counterVoteMap[c.id] || 0,
      userVoted: userVotes.has(`counter_statement:${c.id}`),
    })),
    debates: debates || [],
    statementVoteCount: (stmtVc as any).cnt,
    statementVoted: userVotes.has(`statement:${id}`),
    user,
  });
});

statements.post("/:id/counters", async (c) => {
  const statementId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { content } = await c.req.json<{ content: string }>();
  if (!content || content.length < 50) return err("پاسخ حداقل ۵۰ حرف");

  const stmt = await c.env.DB.prepare("SELECT * FROM statements WHERE id = ?").bind(statementId).first<any>();
  if (!stmt || stmt.moderation_state === "removed") return err("بیانیه یافت نشد", 404);
  if (stmt.user_id === user!.id) return err("نمی‌توانید بیانیه خود را پاسخ دهید");

  await c.env.DB.prepare("INSERT INTO counter_statements (statement_id, user_id, content) VALUES (?, ?, ?)")
    .bind(statementId, user!.id, content).run();

  await upsertNotification(c.env.DB, stmt.user_id, "new_counter", "statement", statementId,
    `${user!.username} پاسخی برای بیانیه «${stmt.title}» ثبت کرد`);

  return ok({ success: true });
});

statements.post("/:id/counters/:cid/accept", async (c) => {
  const statementId = parseInt(c.req.param("id"));
  const counterId = parseInt(c.req.param("cid"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const stmt = await c.env.DB.prepare("SELECT * FROM statements WHERE id = ?").bind(statementId).first<any>();
  if (!stmt) return err("بیانیه یافت نشد", 404);
  if (stmt.user_id !== user!.id) return err("فقط ایجادکننده بیانیه می‌تواند بپذیرد");

  const counter = await c.env.DB.prepare("SELECT * FROM counter_statements WHERE id = ? AND statement_id = ?").bind(counterId, statementId).first<any>();
  if (!counter) return err("پاسخ یافت نشد", 404);
  if (counter.status !== "pending") return err("این پاسخ قبلاً استفاده شده");

  const now = new Date().toISOString();
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO debates (statement_id, counter_statement_id, creator_id, creator_username, opponent_id, title, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?) RETURNING id"
  ).bind(statementId, counterId, user!.id, user!.username, counter.user_id, stmt.title, now, now).run();
  const debateId = inserted![0].id as number;

  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE counter_statements SET status = 'accepted' WHERE id = ?").bind(counterId),
    c.env.DB.prepare("INSERT INTO debate_tags (debate_id, tag_id) SELECT ?, tag_id FROM statement_tags WHERE statement_id = ?").bind(debateId, statementId),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, stmt.user_id, stmt.content, now),
    c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content, created_at) VALUES (?, ?, ?, ?)").bind(debateId, counter.user_id, counter.content, now),
  ]);

  await upsertNotification(c.env.DB, counter.user_id, "counter_accepted", "debate", debateId,
    `${user!.username} پاسخ شما به «${stmt.title}» را پذیرفت و بحث آغاز شد`);

  return ok({ id: debateId });
});

export { statements };