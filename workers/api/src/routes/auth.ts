import { Hono } from "hono";
import { createSession, deleteUserSessions, hashPassword, verifyPassword, getAuthToken, getCurrentUser, err, ok, isStrongPassword, checkRateLimit, getClientIp } from "../lib";

const auth = new Hono<{ Bindings: { DB: D1Database } }>();

auth.post("/register", async (c) => {
  const ip = getClientIp(c);
  const rl = checkRateLimit(`register:${ip}`, 10, 60 * 1000);
  if (rl.limited) return err("تعداد درخواست بیش از حد. بعداً تلاش کنید", 429);

  const { username, email, password, inviteCode } = await c.req.json<{ username: string; email: string; password: string; inviteCode: string }>();
  if (!username || username.length < 2) return err("نام کاربری حداقل ۲ حرف");
  if (!email || !email.includes("@")) return err("ایمیل نامعتبر");

  const normalisedEmail = email.toLowerCase().trim();

  const pwErr = isStrongPassword(password);
  if (pwErr) return err(pwErr);

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE username = ? OR email = ?").bind(username, normalisedEmail).first();
  if (existing) return err("نام کاربری یا ایمیل قبلاً ثبت شده");

  const { hash, salt } = await hashPassword(password);
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO users (username, email, password_hash, password_salt) VALUES (?, ?, ?, ?) RETURNING id"
  ).bind(username, normalisedEmail, hash, salt).run();
  const userId = inserted![0].id as number;

  if (inviteCode) {
    const invite = await c.env.DB.prepare(
      "SELECT id FROM invites WHERE code = ? AND used_by IS NULL"
    ).bind(inviteCode).first();
    if (invite) {
      await c.env.DB.prepare("UPDATE invites SET used_by = ?, used_at = datetime('now') WHERE id = ?").bind(userId, invite.id).run();
    }
  }

  const token = await createSession(c.env.DB, userId);
  return ok({ token, user: { id: userId, username, email: normalisedEmail, isTrusted: false } });
});

auth.post("/login", async (c) => {
  const ip = getClientIp(c);
  const rl = checkRateLimit(`login:${ip}`, 20, 60 * 1000);
  if (rl.limited) return err("تعداد درخواست بیش از حد. بعداً تلاش کنید", 429);

  const { username, password } = await c.req.json<{ username: string; password: string }>();
  const user = await c.env.DB.prepare("SELECT id, username, email, password_hash, password_salt, is_trusted FROM users WHERE username = ?").bind(username).first();
  if (!user) return err("نام کاربری یا رمز عبور اشتباه است");

  const valid = await verifyPassword(password, user.password_hash, user.password_salt);
  if (!valid) return err("نام کاربری یا رمز عبور اشتباه است");

  await deleteUserSessions(c.env.DB, user.id);
  const token = await createSession(c.env.DB, user.id);
  return ok({ token, user: { id: user.id, username: user.username, email: user.email, isTrusted: !!user.is_trusted } });
});

auth.get("/session", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  if (!user) return err("نشست نامعتبر", 401);

  const { results: warnings } = await c.env.DB.prepare(
    "SELECT id, note, created_at FROM mod_actions WHERE target_user_id = ? AND user_action = 'warn' AND acknowledged = 0 ORDER BY created_at DESC"
  ).bind(user.id).all();

  const [{ cnt }] = (await c.env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND is_read = 0"
  ).bind(user.id).all()).results || [{ cnt: 0 }];

  return ok({ user, warnings: warnings || [], notificationCount: cnt as number });
});

export { auth };