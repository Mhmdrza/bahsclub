import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, ok, err, generateToken, checkRateLimit, getClientIp } from "../lib";

const invites = new Hono<{ Bindings: { DB: D1Database } }>();

const INVITE_LIMIT_NORMAL = 10;

invites.get("/quota", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  if (user!.role === "judge" || user!.isTrusted) return ok({ remaining: -1, unlimited: true });

  const [{ cnt }] = (await c.env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM invites WHERE inviter_id = ?"
  ).bind(user!.id).all<{ cnt: number }>()).results || [{ cnt: 0 }];

  return ok({ remaining: Math.max(0, INVITE_LIMIT_NORMAL - cnt), unlimited: false, totalUsed: cnt, limit: INVITE_LIMIT_NORMAL });
});

invites.post("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { email } = await c.req.json<{ email: string }>();
  if (!email || !email.includes("@")) return err("ایمیل نامعتبر");

  const normalisedEmail = email.toLowerCase().trim();

  const ip = getClientIp(c);
  const rl = checkRateLimit(`invite:${ip}`, 5, 60 * 1000);
  if (rl.limited) return err("تعداد درخواست بیش از حد", 429);

  if (user!.role !== "judge" && !user!.isTrusted) {
    const [{ cnt }] = (await c.env.DB.prepare(
      "SELECT COUNT(*) as cnt FROM invites WHERE inviter_id = ?"
    ).bind(user!.id).all<{ cnt: number }>()).results || [{ cnt: 0 }];
    if (cnt >= INVITE_LIMIT_NORMAL) return err("سهمیه دعوت شما تمام شده", 403);
  }

  const existingUser = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(normalisedEmail).first();
  if (existingUser) return err("این ایمیل قبلاً ثبت‌نام کرده");

  const existingWaitlist = await c.env.DB.prepare("SELECT id, status FROM waitlist WHERE email = ?").bind(normalisedEmail).first<any>();
  if (existingWaitlist && existingWaitlist.status === "invited") return err("این ایمیل قبلاً دعوت شده");

  const code = generateToken().slice(0, 16);
  await c.env.DB.prepare(
    "INSERT INTO invites (code, inviter_id, invited_email) VALUES (?, ?, ?)"
  ).bind(code, user!.id, normalisedEmail).run();

  if (existingWaitlist) {
    await c.env.DB.prepare("UPDATE waitlist SET status = 'invited' WHERE email = ?").bind(normalisedEmail).run();
  }

  return ok({ code, email: normalisedEmail });
});

invites.get("/me", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { results } = await c.env.DB.prepare(
    "SELECT id, code, invited_email, used_by, used_at, created_at FROM invites WHERE inviter_id = ? ORDER BY created_at DESC LIMIT 50"
  ).bind(user!.id).all();

  return ok(results || []);
});

invites.get("/verify", async (c) => {
  const code = c.req.query("code");
  const email = c.req.query("email");
  if (!code || !email) return err("کد و ایمیل الزامی است");

  const invite = await c.env.DB.prepare(
    "SELECT i.id, i.invited_email, i.used_by, i.inviter_id, u.username as inviter_username FROM invites i JOIN users u ON u.id = i.inviter_id WHERE i.code = ?"
  ).bind(code).first();

  if (!invite) return err("کد دعوت نامعتبر است", 404);
  if (invite.used_by) return err("این کد قبلاً استفاده شده", 410);
  if (invite.invited_email !== email.toLowerCase().trim()) {
    return err("این کد برای ایمیل شما صادر نشده", 403);
  }

  return ok({ valid: true, email: invite.invited_email, inviterUsername: invite.inviter_username });
});

invites.get("/info", async (c) => {
  const code = c.req.query("code");
  if (!code) return err("کد الزامی است");

  const invite = await c.env.DB.prepare(
    "SELECT i.used_by, u.username FROM invites i JOIN users u ON u.id = i.inviter_id WHERE i.code = ?"
  ).bind(code).first();

  if (!invite) return err("کد دعوت نامعتبر است", 404);
  if (invite.used_by) return err("این کد قبلاً استفاده شده", 410);

  return ok({ inviterUsername: invite.username });
});

export { invites };