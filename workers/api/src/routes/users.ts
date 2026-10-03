import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, err, ok, getPagination, upsertNotification } from "../lib";

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

async function findUser(db: D1Database, username: string) {
  return db.prepare("SELECT id, username FROM users WHERE username = ?").bind(username).first<any>();
}

// POST /api/users/:username/follow — one-way follow (idempotent).
users.post("/:username/follow", async (c) => {
  const token = getAuthToken(c);
  const me = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(me);
  if (authErr) return authErr;

  const target = await findUser(c.env.DB, c.req.param("username"));
  if (!target) return err("کاربر یافت نشد", 404);
  if (target.id === me!.id) return err("نمی‌توانید خودتان را دنبال کنید");

  await c.env.DB.prepare(
    "INSERT OR IGNORE INTO follows (follower_id, followee_id) VALUES (?, ?)"
  ).bind(me!.id, target.id).run();

  await upsertNotification(c.env.DB, target.id, "new_follower", "user", me!.id,
    `${me!.username} شما را دنبال کرد`);

  return ok({ following: true });
});

// DELETE /api/users/:username/follow — unfollow.
users.delete("/:username/follow", async (c) => {
  const token = getAuthToken(c);
  const me = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(me);
  if (authErr) return authErr;

  const target = await findUser(c.env.DB, c.req.param("username"));
  if (!target) return err("کاربر یافت نشد", 404);

  await c.env.DB.prepare(
    "DELETE FROM follows WHERE follower_id = ? AND followee_id = ?"
  ).bind(me!.id, target.id).run();

  return ok({ following: false });
});

// GET /api/users/:username — thought profile: ideas + track record.
users.get("/:username", async (c) => {
  const username = c.req.param("username");
  const user = await c.env.DB.prepare(
    "SELECT id, username, bio, role, reputation, is_trusted, blocked_until, created_at FROM users WHERE username = ?"
  ).bind(username).first<any>();
  if (!user) return err("کاربر یافت نشد", 404);

  const dPg = getPagination(c.req.query());

  const token = getAuthToken(c);
  const me = await getCurrentUser(c.env.DB, token);
  const isMe = !!me && me.id === user.id;

  const [fCount] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM follows WHERE followee_id = ?").bind(user.id).all<any>()).results || [{ cnt: 0 }];
  const [gCount] = (await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM follows WHERE follower_id = ?").bind(user.id).all<any>()).results || [{ cnt: 0 }];
  let isFollowing = false;
  if (me && !isMe) {
    const f = await c.env.DB.prepare("SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?").bind(me.id, user.id).first();
    isFollowing = !!f;
  }

  const { results: ideas } = await c.env.DB.prepare(`
    SELECT i.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'idea' AND voteable_id = i.id) as vote_count,
      (SELECT COUNT(*) FROM idea_responses WHERE idea_id = i.id) as response_count,
      (SELECT COUNT(*) FROM idea_responses WHERE idea_id = i.id AND kind = 'challenge') as challenge_count,
      (SELECT COUNT(*) FROM debates d WHERE d.idea_id = i.id AND d.status = 'in_progress') as active_debate_count,
      (SELECT MAX(version) FROM idea_versions WHERE idea_id = i.id) as version_count
    FROM ideas i
    WHERE i.user_id = ? AND i.moderation_state != 'removed'
    ORDER BY i.created_at DESC
    LIMIT 20
  `).bind(user.id).all<any>();

  const { results: tags } = await c.env.DB.prepare(`
    SELECT DISTINCT t.id, t.name, t.slug, COUNT(DISTINCT it.idea_id) as idea_count
    FROM tags t
    JOIN idea_tags it ON t.id = it.tag_id
    JOIN ideas i ON it.idea_id = i.id
    WHERE i.user_id = ?
    GROUP BY t.id ORDER BY idea_count DESC
  `).bind(user.id).all<any>();

  const [t] = (await c.env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM ideas WHERE user_id = ? AND moderation_state != 'removed') as ideas,
      (SELECT COUNT(*) FROM idea_versions v JOIN ideas i ON v.idea_id = i.id WHERE i.user_id = ? AND v.version > 1) as revisions,
      (SELECT COUNT(*) FROM idea_responses WHERE user_id = ? AND kind = 'reply') as replies,
      (SELECT COUNT(*) FROM idea_responses WHERE user_id = ? AND kind = 'challenge') as challenges,
      (SELECT COUNT(*) FROM debates WHERE creator_id = ? OR opponent_id = ?) as debates,
      (SELECT COUNT(*) FROM ideas i WHERE i.user_id = ? AND (SELECT MAX(version) FROM idea_versions WHERE idea_id = i.id) > 1) as changed_mind
  `).bind(user.id, user.id, user.id, user.id, user.id, user.id, user.id).all<any>()).results || [{}];

  return ok({
    id: user.id,
    username: user.username,
    bio: user.bio,
    role: user.role,
    reputation: user.reputation,
    isTrusted: !!user.is_trusted,
    blockedUntil: user.blocked_until,
    createdAt: user.created_at,
    isMe,
    isFollowing,
    followerCount: (fCount as any).cnt || 0,
    followingCount: (gCount as any).cnt || 0,
    ideas: (ideas || []).map((i: any) => ({ ...i, tags: undefined })),
    tags: tags || [],
    trackRecord: {
      ideas: (t as any).ideas || 0,
      revisions: (t as any).revisions || 0,
      replies: (t as any).replies || 0,
      challenges: (t as any).challenges || 0,
      debates: (t as any).debates || 0,
      changedMind: (t as any).changed_mind || 0,
    },
    pagination: { page: dPg.page, limit: dPg.limit, total: ideas?.length || 0, hasMore: false },
  });
});

export { users };
