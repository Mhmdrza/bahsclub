import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, err, ok, getPagination } from "../lib";

const users = new Hono<{ Bindings: { DB: D1Database } }>();

users.get("/me/warnings", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { results } = await c.env.DB.prepare(
    "SELECT id, note, created_at FROM mod_actions WHERE target_user_id = ? AND user_action = 'warn' AND acknowledged = 0 ORDER BY created_at DESC"
  ).bind(user!.id).all<any>();
  return ok({ warnings: results || [] });
});

users.post("/me/acknowledge-warnings", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  await c.env.DB.prepare(
    "UPDATE mod_actions SET acknowledged = 1 WHERE target_user_id = ? AND user_action = 'warn'"
  ).bind(user!.id).run();
  return ok({ ok: true });
});

users.get("/me/notifications", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { results } = await c.env.DB.prepare(
    "SELECT id, type, reference_type, reference_id, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
  ).bind(user!.id).all<any>();

  return ok(results || []);
});

users.post("/me/notifications/read", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  await c.env.DB.prepare(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ?"
  ).bind(user!.id).run();
  return ok({ ok: true });
});

users.patch("/me", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { bio } = await c.req.json<{ bio: string }>();
  if (typeof bio !== "string" || bio.length > 500) return err("بیوگرافی حداکثر ۵۰۰ حرف");

  await c.env.DB.prepare("UPDATE users SET bio = ? WHERE id = ?").bind(bio, user!.id).run();
  return ok({ ok: true });
});

users.get("/:username", async (c) => {
  const username = c.req.param("username");
  const user = await c.env.DB.prepare(
    "SELECT id, username, bio, role, reputation, is_trusted, blocked_until, created_at FROM users WHERE username = ?"
  ).bind(username).first<any>();
  if (!user) return err("کاربر یافت نشد", 404);

  const dPg = getPagination(c.req.query());

  const [{ total: debateTotal }] = (await c.env.DB.prepare(
    "SELECT COUNT(*) as total FROM debates d WHERE (d.creator_id = ? OR d.opponent_id = ?) AND d.moderation_state != 'removed'"
  ).bind(user.id, user.id).all<{ total: number }>()).results || [{ total: 0 }];

  const { results: debates } = await c.env.DB.prepare(`
    SELECT d.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'debate' AND voteable_id = d.id) as vote_count,
      (SELECT COUNT(*) FROM debate_messages WHERE debate_id = d.id) as message_count
    FROM debates d
    WHERE (d.creator_id = ? OR d.opponent_id = ?) AND d.moderation_state != 'removed'
    ORDER BY d.updated_at DESC
    LIMIT ? OFFSET ?
  `).bind(user.id, user.id, dPg.limit, dPg.offset).all<any>();

  const { results: statements } = await c.env.DB.prepare(`
    SELECT s.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'statement' AND voteable_id = s.id) as vote_count,
      (SELECT COUNT(*) FROM debates WHERE statement_id = s.id AND status = 'in_progress') as active_debate_count
    FROM statements s
    WHERE s.user_id = ? AND s.moderation_state != 'removed'
    ORDER BY s.created_at DESC
    LIMIT 10
  `).bind(user.id).all<any>();

  const { results: tags } = await c.env.DB.prepare(`
    SELECT DISTINCT t.id, t.name, t.slug, COUNT(DISTINCT st2.statement_id) as statement_count
    FROM tags t
    JOIN statement_tags st ON t.id = st.tag_id
    JOIN statements s ON st.statement_id = s.id
    JOIN statement_tags st2 ON st2.tag_id = t.id
    WHERE s.user_id = ?
    GROUP BY t.id ORDER BY statement_count DESC
  `).bind(user.id).all<any>();

  return ok({
    id: user.id,
    username: user.username,
    bio: user.bio,
    role: user.role,
    reputation: user.reputation,
    isTrusted: !!user.is_trusted,
    blockedUntil: user.blocked_until,
    createdAt: user.created_at,
    debates: debates || [],
    statements: statements || [],
    tags: tags || [],
    pagination: { page: dPg.page, limit: dPg.limit, total: debateTotal, hasMore: dPg.page * dPg.limit < debateTotal },
  });
});

export { users };