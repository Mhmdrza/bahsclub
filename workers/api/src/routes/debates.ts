import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, err, ok } from "../lib";

const debates = new Hono<{ Bindings: { DB: D1Database } }>();

debates.get("/", async (c) => {
  const { status, tag } = c.req.query();

  let sql = `SELECT d.*, 
    (SELECT COUNT(*) FROM votes WHERE voteable_type = 'debate' AND voteable_id = d.id) as vote_count
    FROM debates d`;
  const params: any[] = [];
  const conditions: string[] = [];

  if (tag) {
    sql += ` JOIN debate_tags dt ON d.id = dt.debate_id JOIN tags t ON dt.tag_id = t.id`;
    conditions.push(`t.slug = ?`);
    params.push(tag);
  }
  if (status) {
    conditions.push(`d.status = ?`);
    params.push(status);
  }

  if (conditions.length) sql += ` WHERE ` + conditions.join(" AND ");
  sql += ` ORDER BY vote_count DESC`;

  const { results } = await c.env.DB.prepare(sql).bind(...params).all<any>();
  return ok({ debates: results || [] });
});

debates.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(id).first<any>();
  if (!debate) return err("بحث یافت نشد", 404);

  // Lazy forfeit check
  if (debate.status === "in_progress") {
    const lastTurn = await c.env.DB.prepare("SELECT created_at FROM turns WHERE debate_id = ? ORDER BY turn_number DESC LIMIT 1").bind(id).first<any>();
    const lastActive = lastTurn?.created_at || debate.created_at;
    if (new Date(lastActive) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      await c.env.DB.prepare("UPDATE debates SET status = 'closed', closed_reason = 'forfeit', updated_at = ? WHERE id = ?")
        .bind(new Date().toISOString(), id).run();
      debate.status = "closed";
      debate.closed_reason = "forfeit";
    }
  }

  const creator = await c.env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(debate.creator_id).first<any>();
  const opponent = debate.opponent_id ? await c.env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(debate.opponent_id).first<any>() : null;

  const tagRows = await c.env.DB.prepare(
    "SELECT t.id, t.name, t.slug FROM tags t JOIN debate_tags dt ON t.id = dt.tag_id WHERE dt.debate_id = ?"
  ).bind(id).all<any>();

  const turnRows = await c.env.DB.prepare(
    "SELECT t.*, u.username FROM turns t LEFT JOIN users u ON t.user_id = u.id WHERE t.debate_id = ? ORDER BY t.turn_number"
  ).bind(id).all<any>();

  const pending = await c.env.DB.prepare(
    "SELECT c.*, u.username FROM challengers c JOIN users u ON c.user_id = u.id WHERE c.debate_id = ? AND c.status = 'pending'"
  ).bind(id).all<any>();

  const turnVoteCounts = turnRows?.length ? await c.env.DB.prepare(
    `SELECT voteable_id, COUNT(*) as cnt FROM votes WHERE voteable_type = 'turn' AND voteable_id IN (${turnRows.map(() => '?').join(',')}) GROUP BY voteable_id`
  ).bind(...turnRows.map(t => t.id)).all<any>() : { results: [] };

  const tvMap: Record<number, number> = {};
  for (const v of (turnVoteCounts.results || [])) tvMap[v.voteable_id] = v.cnt;

  const [vc] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM votes WHERE voteable_type = 'debate' AND voteable_id = ?").bind(id).all<any>()).results || [{ cnt: 0 }];

  // User's votes
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const userVotes = new Set<string>();
  if (user) {
    const myVotes = await c.env.DB.prepare("SELECT voteable_type, voteable_id FROM votes WHERE user_id = ?").bind(user.id).all<any>();
    for (const v of (myVotes.results || [])) userVotes.add(`${v.voteable_type}:${v.voteable_id}`);
  }

  return ok({
    debate,
    creator,
    opponent,
    tags: tagRows.results || [],
    turns: (turnRows.results || []).map(t => ({
      ...t,
      voteCount: tvMap[t.id] || 0,
      userVoted: userVotes.has(`turn:${t.id}`),
    })),
    pendingChallengers: pending.results || [],
    debateVoteCount: (vc as any).cnt,
    debateVoted: userVotes.has(`debate:${id}`),
    user,
  });
});

debates.post("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { title, initialStatement, tags: tagNames } = await c.req.json<{ title: string; initialStatement: string; tags: string[] }>();
  if (!title || title.length < 5) return err("عنوان حداقل ۵ حرف");
  if (!initialStatement || initialStatement.length < 50) return err("بیانیه اولیه حداقل ۵۰ حرف");
  if (!tagNames || tagNames.length === 0 || tagNames.length > 5) return err("حداقل ۱ و حداکثر ۵ برچسب");

  // Upsert tags
  const tagIds: number[] = [];
  for (const name of tagNames) {
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9_\u0600-\u06FF\s-]/g, "").replace(/\s+/g, "-");
    if (!slug) continue;
    let tag = await c.env.DB.prepare("SELECT id FROM tags WHERE slug = ?").bind(slug).first<any>();
    if (!tag) {
      if (!user?.isTrusted) return err("فقط کاربران معتمد می‌توانند برچسب جدید بسازند");
      const r = await c.env.DB.prepare("INSERT INTO tags (name, slug, created_by) VALUES (?, ?, ?) RETURNING id").bind(name.trim(), slug, user.id).run();
      tag = { id: r.results![0].id };
    }
    tagIds.push(tag.id);
  }

  const now = new Date().toISOString();
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO debates (creator_id, creator_username, title, initial_statement, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id"
  ).bind(user!.id, user!.username, title, initialStatement, now, now).run();
  const debateId = inserted![0].id as number;

  await c.env.DB.prepare(
    `INSERT INTO debate_tags (debate_id, tag_id) VALUES ${tagIds.map(() => '(?, ?)').join(', ')}`
  ).bind(...tagIds.flatMap(tid => [debateId, tid])).run();

  return ok({ id: debateId });
});

debates.post("/:id/challenge", async (c) => {
  const debateId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { positionStatement } = await c.req.json<{ positionStatement: string }>();
  if (!positionStatement || positionStatement.length < 50) return err("موضع‌گیری حداقل ۵۰ حرف");

  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<any>();
  if (!debate || !["open", "challengers"].includes(debate.status)) return err("این بحث پذیرای چالشگر نیست");
  if (debate.creator_id === user!.id) return err("نمی‌توانید بحث خود را چالش کنید");

  const existing = await c.env.DB.prepare("SELECT id FROM challengers WHERE debate_id = ? AND user_id = ?").bind(debateId, user!.id).first();
  if (existing) return err("شما قبلاً ثبت‌نام کرده‌اید");

  await c.env.DB.prepare("INSERT INTO challengers (debate_id, user_id, position_statement) VALUES (?, ?, ?)").bind(debateId, user!.id, positionStatement).run();
  if (debate.status === "open") {
    await c.env.DB.prepare("UPDATE debates SET status = 'challengers', updated_at = ? WHERE id = ?").bind(new Date().toISOString(), debateId).run();
  }
  return ok({ success: true });
});

debates.post("/:id/accept", async (c) => {
  const debateId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { challengerUserId, firstSpeakerId } = await c.req.json<{ challengerUserId: number; firstSpeakerId: number }>();

  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<any>();
  if (!debate || debate.creator_id !== user!.id) return err("فقط ایجادکننده می‌تواند بپذیرد");
  if (debate.status !== "challengers") return err("وضعیت نامناسب");

  await c.env.DB.prepare("UPDATE challengers SET status = 'accepted' WHERE debate_id = ? AND user_id = ?").bind(debateId, challengerUserId).run();
  await c.env.DB.prepare("UPDATE challengers SET status = 'rejected' WHERE debate_id = ? AND user_id != ? AND status = 'pending'").bind(debateId, challengerUserId).run();
  await c.env.DB.prepare(
    "UPDATE debates SET opponent_id = ?, status = 'in_progress', current_turn = 1, next_speaker = ?, updated_at = ? WHERE id = ?"
  ).bind(challengerUserId, firstSpeakerId, new Date().toISOString(), debateId).run();

  return ok({ success: true });
});

debates.post("/:id/turn", async (c) => {
  const debateId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { content } = await c.req.json<{ content: string }>();
  if (!content || content.length < 10) return err("پیام حداقل ۱۰ حرف");

  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<any>();
  if (!debate || debate.status !== "in_progress") return err("بحث فعال نیست");
  if (debate.next_speaker !== user!.id) return err("نوبت شما نیست");

  const nextTurn = debate.current_turn + 1;
  const nextSpeakerId = debate.creator_id === user!.id ? debate.opponent_id : debate.creator_id;

  await c.env.DB.prepare("INSERT INTO turns (debate_id, user_id, turn_number, content) VALUES (?, ?, ?, ?)").bind(debateId, user!.id, nextTurn, content).run().catch(() => { throw err("این نوبت قبلاً ثبت شده"); });

  const now = new Date().toISOString();
  if (nextTurn >= debate.max_turns) {
    await c.env.DB.prepare("UPDATE debates SET status = 'closed', closed_reason = 'max_turns', closed_at = ?, current_turn = ?, next_speaker = NULL, updated_at = ? WHERE id = ?")
      .bind(now, nextTurn, now, debateId).run();
  } else {
    await c.env.DB.prepare("UPDATE debates SET current_turn = ?, next_speaker = ?, closure_requested_by = NULL, updated_at = ? WHERE id = ?")
      .bind(nextTurn, nextSpeakerId, now, debateId).run();
  }

  return ok({ success: true });
});

debates.post("/:id/closure", async (c) => {
  const debateId = parseInt(c.req.param("id"));
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const debate = await c.env.DB.prepare("SELECT * FROM debates WHERE id = ?").bind(debateId).first<any>();
  if (!debate || debate.status !== "in_progress") return err("بحث فعال نیست");
  if (debate.creator_id !== user!.id && debate.opponent_id !== user!.id) return err("شما در این بحث نیستید");

  if (debate.closure_requested_by === user!.id) return err("قبلاً درخواست داده‌اید");

  const now = new Date().toISOString();
  if (debate.closure_requested_by) {
    await c.env.DB.prepare("UPDATE debates SET status = 'closed', closed_reason = 'mutual', closed_at = ?, next_speaker = NULL, updated_at = ? WHERE id = ?")
      .bind(now, now, debateId).run();
  } else {
    await c.env.DB.prepare("UPDATE debates SET closure_requested_by = ?, updated_at = ? WHERE id = ?")
      .bind(user!.id, now, debateId).run();
  }

  return ok({ success: true });
});

export { debates };