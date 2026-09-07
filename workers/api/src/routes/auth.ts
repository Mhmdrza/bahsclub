import { Hono } from "hono";
import { createSession, hashPassword, verifyPassword, getAuthToken, getCurrentUser, err, ok } from "../lib";

const auth = new Hono<{ Bindings: { DB: D1Database } }>();

auth.post("/register", async (c) => {
  const { username, email, password } = await c.req.json<{ username: string; email: string; password: string }>();
  if (!username || username.length < 2) return err("نام کاربری حداقل ۲ حرف");
  if (!email || !email.includes("@")) return err("ایمیل نامعتبر");
  if (!password || password.length < 6) return err("رمز عبور حداقل ۶ حرف");

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE username = ? OR email = ?").bind(username, email).first();
  if (existing) return err("نام کاربری یا ایمیل قبلاً ثبت شده");

  const { hash, salt } = await hashPassword(password);
  const { results: inserted } = await c.env.DB.prepare(
    "INSERT INTO users (username, email, password_hash, password_salt) VALUES (?, ?, ?, ?) RETURNING id"
  ).bind(username, email, hash, salt).run();
  const userId = inserted![0].id as number;

  const token = await createSession(c.env.DB, userId);
  return ok({ token, user: { id: userId, username, email, isTrusted: false } });
});

auth.post("/login", async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>();
  const user = await c.env.DB.prepare("SELECT id, username, email, password_hash, password_salt, is_trusted FROM users WHERE username = ?").bind(username).first<any>();
  if (!user) return err("نام کاربری یا رمز عبور اشتباه است");

  const valid = await verifyPassword(password, user.password_hash, user.password_salt);
  if (!valid) return err("نام کاربری یا رمز عبور اشتباه است");

  const token = await createSession(c.env.DB, user.id);
  return ok({ token, user: { id: user.id, username: user.username, email: user.email, isTrusted: !!user.is_trusted } });
});

auth.get("/session", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  if (!user) return err("نشست نامعتبر", 401);
  return ok({ user });
});

export { auth };