import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, ensureNotBlocked, err, ok, getPagination, paginatedResponse } from "../lib";

const debates = new Hono<{ Bindings: { DB: D1Database } }>();

const FORFEIT_HOURS = 24;

debates.get("/poll/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const row = await c.env.DB.prepare("SELECT status, (SELECT COUNT(*) FROM debate_messages WHERE debate_id = d.id) as message_count, closure_requested_by FROM debates d WHERE d.id = ?").bind(id).first<any>();
  if (!row) return err("یافت نشد", 404);
  return ok({
    messageCount: row.message_count || 0,
    closed: row.status === "closed",
    closureRequestedBy: row.closure_requested_by,
  });
});

async function runForfeitCheck(db: D1Database) {
  const cutoff = new Date(Date.now() - FORFEIT_HOURS * 60 * 60 * 1000).toISOString();
  await db.prepare(`
    UPDATE debates SET status = 'closed', closed_reason = 'forfeit', updated_at = ?
    WHERE id IN (
      SELECT d.id FROM debates d
      LEFT JOIN debate_messages m ON m.debate_id = d.id
      WHERE d.status = 'in_progress'
      GROUP BY d.id
      HAVING COALESCE(MAX(m.created_at), d.created_at) < ?
    )
  `).bind(new Date().toISOString(), cutoff).run();
}

debates.get("/", async (c) => {
  await runForfeitCheck(c.env.DB);

  const { status, tag } = c.req.query();
  const pg = getPagination(c.req.query());

  const params: any[] = [];
  let fromJoin = `FROM debates d`;
  const where: string[] = ["d.moderation_state != 'removed'"];

  if (tag) {
    fromJoin += ` JOIN statements st ON st.id = d.statement_id JOIN statement_tags stt ON stt.statement_id = st.id JOIN tags t ON t.id = stt.tag_id`;
    where.push("t.slug = ?");
    params.push(tag);
  }
  if (status) {
    where.push("d.status = ?");
    params.push(status);
  }

  const whereClause = where.join(" AND ");
  const dataSql = `SELECT d.*, 
    (SELECT COUNT(*) FROM votes WHERE voteable_type = 'debate' AND voteable_id = d.id) as vote_count,
    (SELECT COUNT(*) FROM debate_messages WHERE debate_id = d.id) as message_count
    ${fromJoin} WHERE ${whereClause}
    GROUP BY d.id ORDER BY vote_count DESC LIMIT ? OFFSET ?`;
  params.push(pg.limit, pg.offset);

  const countParams = params.slice(0, -2);
  const countSql = `SELECT COUNT(DISTINCT d.id) as total ${fromJoin} WHERE ${whereClause}`;

  const [{ total }] = (await c.env.DB.prepare(countSql).bind(...countParams).all<{ total: number }>()).results || [{ total: 0 }];
  const { results } = await c.env.DB.prepare(dataSql).bind(...params).all<any>();
  return paginatedResponse(results || [], pg.page, pg.limit, total);
});

debates.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(id).first<any>();
  if (!debate || debate.moderation_state === "removed") return err("بحث یافت نشد", 404);

  if (debate.status === "in_progress") {
    const lastMsg = await c.env.DB.prepare("SELECT created_at FROM debate_messages WHERE debate_id = ? ORDER BY id DESC LIMIT 1").bind(id).first<any>();
    const lastActive = lastMsg?.created_at || debate.created_at;
    if (new Date(lastActive) < new Date(Date.now() - FORFEIT_HOURS * 60 * 60 * 1000)) {
      await c.env.DB.prepare("UPDATE debates SET status = 'closed', closed_reason = 'forfeit', updated_at = ? WHERE id = ?")
        .bind(new Date().toISOString(), id).run();
      debate.status = "closed";
      debate.closed_reason = "forfeit";
    }
  }

  const stmt = await c.env.DB.prepare("SELECT content, user_id, username FROM statements WHERE id = ?").bind(debate.statement_id).first<any>();
  const counter = await c.env.DB.prepare("SELECT cs.content, cs.user_id, u.username FROM counter_statements cs JOIN users u ON cs.user_id = u.id WHERE cs.id = ?").bind(debate.counter_statement_id).first<any>();

  const creator = await c.env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(debate.creator_id).first<any>();
  const opponent = debate.opponent_id ? await c.env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(debate.opponent_id).first<any>() : null;

  const tagRows = await c.env.DB.prepare(
    "SELECT t.id, t.name, t.slug FROM tags t JOIN debate_tags dt ON t.id = dt.tag_id WHERE dt.debate_id = ?"
  ).bind(id).all<any>();

  const msgRows = await c.env.DB.prepare(
    "SELECT m.*, u.username FROM debate_messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.debate_id = ? ORDER BY m.id"
  ).bind(id).all<any>();

  const msgVoteCounts = msgRows.results?.length ? await c.env.DB.prepare(
    `SELECT voteable_id, COUNT(*) as cnt FROM votes WHERE voteable_type = 'message' AND voteable_id IN (${msgRows.results.map(() => '?').join(',')}) GROUP BY voteable_id`
  ).bind(...msgRows.results.map((m: any) => m.id)).all<any>() : { results: [] };

  const mvMap: Record<number, number> = {};
  for (const v of (msgVoteCounts.results || [])) mvMap[v.voteable_id] = v.cnt;

  const [vc] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM votes WHERE voteable_type = 'debate' AND voteable_id = ?").bind(id).all<any>()).results || [{ cnt: 0 }];

  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const userVotes = new Set<string>();
  if (user) {
    const myVotes = await c.env.DB.prepare("SELECT voteable_type, voteable_id FROM votes WHERE user_id = ?").bind(user.id).all<any>();
    for (const v of (myVotes.results || [])) userVotes.add(`${v.voteable_type}:${v.voteable_id}`);
  }

  return ok({
    debate,
    openingStatement: stmt ? { content: stmt.content, username: stmt.username, userId: stmt.user_id } : null,
    openingCounter: counter ? { content: counter.content, username: counter.username, userId: counter.user_id } : null,
    creator,
    opponent,
    tags: tagRows.results || [],
    messages: (msgRows.results || []).map(m => ({
      ...m,
      voteCount: mvMap[m.id] || 0,
      userVoted: userVotes.has(`message:${m.id}`),
    })),
    debateVoteCount: (vc as any).cnt,
    debateVoted: userVotes.has(`debate:${id}`),
    user,
  });
});

debates.post("/:id/message", async (c) => {
  const debateId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { content } = await c.req.json<{ content: string }>();
  if (!content || content.length < 10) return err("پیام حداقل ۱۰ حرف");

  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<any>();
  if (!debate || debate.status !== "in_progress") return err("بحث فعال نیست");
  if (debate.creator_id !== user!.id && debate.opponent_id !== user!.id) return err("شما در این بحث نیستید");

  const now = new Date().toISOString();
  await c.env.DB.prepare("INSERT INTO debate_messages (debate_id, user_id, content) VALUES (?, ?, ?)")
    .bind(debateId, user!.id, content).run();

  let closureWiped = false;
  if (debate.closure_requested_by && debate.closure_requested_by !== user!.id) {
    await c.env.DB.prepare("UPDATE debates SET closure_requested_by = NULL, updated_at = ? WHERE id = ?")
      .bind(now, debateId).run();
    closureWiped = true;
  } else {
    await c.env.DB.prepare("UPDATE debates SET updated_at = ? WHERE id = ?")
      .bind(now, debateId).run();
  }

  return ok({ success: true, closureWiped });
});

debates.post("/:id/closure", async (c) => {
  const debateId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<any>();
  if (!debate || debate.status !== "in_progress") return err("بحث فعال نیست");
  if (debate.creator_id !== user!.id && debate.opponent_id !== user!.id) return err("شما در این بحث نیستید");

  const now = new Date().toISOString();

  if (debate.closure_requested_by) {
    if (debate.closure_requested_by === user!.id) return err("قبلاً درخواست داده‌اید");
    await c.env.DB.prepare("UPDATE debates SET status = 'closed', closed_reason = 'mutual', closed_at = ?, closure_requested_by = NULL, updated_at = ? WHERE id = ?")
      .bind(now, now, debateId).run();
    return ok({ status: "closed" });
  }

  const result = await c.env.DB.prepare("UPDATE debates SET closure_requested_by = ?, updated_at = ? WHERE id = ? AND closure_requested_by IS NULL")
    .bind(user!.id, now, debateId).run();

  if (!result.meta?.changes) {
    const current = await c.env.DB.prepare("SELECT closure_requested_by FROM debates WHERE id = ?").bind(debateId).first<any>();
    if (current?.closure_requested_by === user!.id) return err("قبلاً درخواست داده‌اید");

    await c.env.DB.prepare("UPDATE debates SET status = 'closed', closed_reason = 'mutual', closed_at = ?, closure_requested_by = NULL, updated_at = ? WHERE id = ?")
      .bind(now, now, debateId).run();
    return ok({ status: "closed" });
  }

  return ok({ status: "requested" });
});

export { debates };