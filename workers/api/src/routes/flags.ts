import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, needJudge, ensureNotBlocked, err, ok } from "../lib";

const REASONS = ["personal_attack", "insulting_question", "derailing", "motive_guessing", "pressure", "spam", "other"];
const SEP = "\x00";

const ALLOWED_TYPES = ["statement", "counter_statement", "debate", "message"];

const typeTableMap: Record<string, string> = {
  statement: "statements",
  counter_statement: "counter_statements",
  debate: "debates",
  message: "debate_messages",
};

const flagsRt = new Hono<{ Bindings: { DB: D1Database } }>();

flagsRt.post("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockErr = ensureNotBlocked(user!);
  if (blockErr) return blockErr;

  const { flaggableType, flaggableId, reason, details } = await c.req.json<{
    flaggableType: string; flaggableId: number; reason: string; details?: string;
  }>();
  if (!ALLOWED_TYPES.includes(flaggableType)) return err("نوع گزارش نامعتبر");
  if (!REASONS.includes(reason)) return err("دلیل نامعتبر");

  const table = typeTableMap[flaggableType];
  const col = flaggableType === "debate" ? "creator_id" : "user_id";
  const target = await c.env.DB.prepare(`SELECT ${col} as author FROM ${table} WHERE id = ?`).bind(flaggableId).first();
  if (!target) return err("یافت نشد", 404);
  if (target.author === user!.id) return err("نمی‌توانید محتوای خود را گزارش کنید");

  await c.env.DB.prepare(
    "INSERT INTO flags (flagger_id, flaggable_type, flaggable_id, reason, details) VALUES (?, ?, ?, ?, ?)"
  ).bind(user!.id, flaggableType, flaggableId, reason, details || null).run().catch(() => err("قبلاً گزارش داده‌اید"));

  return ok({ ok: true });
});

flagsRt.get("/", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const judgeErr = needJudge(user);
  if (judgeErr) return judgeErr;

  const { results: pending } = await c.env.DB.prepare(`
    SELECT f.flaggable_type, f.flaggable_id, COUNT(DISTINCT f.id) as flag_count,
      GROUP_CONCAT(f.reason, '${SEP}') as reasons,
      GROUP_CONCAT(f.details, '${SEP}') as details_list,
      GROUP_CONCAT(u.username, '${SEP}') as flagger_names,
      GROUP_CONCAT(f.created_at, '${SEP}') as flagged_ats
    FROM flags f JOIN users u ON f.flagger_id = u.id
    WHERE f.status = 'pending'
    GROUP BY f.flaggable_type, f.flaggable_id
    ORDER BY MAX(f.created_at) DESC
  `).all();

  const pendingWithContext = [];
  for (const p of (pending || [])) {
    let contentPreview = "", authorName = "", debateTitle = "";

    if (p.flaggable_type === "message") {
      const msg = await c.env.DB.prepare(
        "SELECT m.content, u.username, d.title, d.id as debate_id FROM debate_messages m JOIN users u ON m.user_id = u.id JOIN debates d ON m.debate_id = d.id WHERE m.id = ?"
      ).bind(p.flaggable_id).first();
      if (!msg) continue;
      contentPreview = msg.content.slice(0, 300);
      authorName = msg.username;
      debateTitle = msg.title;
    } else if (p.flaggable_type === "counter_statement") {
      const cs = await c.env.DB.prepare(
        "SELECT cs.content, u.username, s.title FROM counter_statements cs JOIN users u ON cs.user_id = u.id JOIN statements s ON cs.statement_id = s.id WHERE cs.id = ?"
      ).bind(p.flaggable_id).first();
      if (!cs) continue;
      contentPreview = cs.content.slice(0, 300);
      authorName = cs.username;
      debateTitle = cs.title;
    } else if (p.flaggable_type === "statement") {
      const stmt = await c.env.DB.prepare(
        "SELECT s.content, u.username FROM statements s JOIN users u ON s.user_id = u.id WHERE s.id = ?"
      ).bind(p.flaggable_id).first();
      if (!stmt) continue;
      contentPreview = stmt.content.slice(0, 300);
      authorName = stmt.username;
      debateTitle = "";
    } else {
      const d = await c.env.DB.prepare(
        "SELECT d.title, u.username FROM debates d JOIN users u ON d.creator_id = u.id WHERE d.id = ?"
      ).bind(p.flaggable_id).first();
      if (!d) continue;
      contentPreview = d.title;
      authorName = d.username;
      debateTitle = d.title;
    }

    const reasons = (p.reasons || "").split(SEP);
    const details = (p.details_list || "").split(SEP);
    const names = (p.flagger_names || "").split(SEP);
    const ats = (p.flagged_ats || "").split(SEP);

    const flaggers = names.map((n: string, i: number) => ({
      username: n, reason: reasons[i] || "", details: details[i] || "", createdAt: ats[i] || "",
    }));

    pendingWithContext.push({
      flaggableType: p.flaggable_type,
      flaggableId: p.flaggable_id,
      flagCount: p.flag_count,
      contentPreview,
      authorName,
      debateTitle,
      debateId: null,
      flaggers,
    });
  }

  const { results: resolved } = await c.env.DB.prepare(`
    SELECT ma.*, u.username as judge_username, t.username as target_username
    FROM mod_actions ma
    JOIN users u ON ma.judge_id = u.id
    JOIN users t ON ma.target_user_id = t.id
    ORDER BY ma.created_at DESC LIMIT 30
  `).all();

  return ok({ pending: pendingWithContext, resolved: resolved || [] });
});

flagsRt.post("/resolve", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const judgeErr = needJudge(user);
  if (judgeErr) return judgeErr;

  const { flaggableType, flaggableId, userAction, contentAction, note, durationDays, repDelta } =
    await c.req.json<{
      flaggableType: string; flaggableId: number; userAction: string;
      contentAction?: string; note?: string; durationDays?: number; repDelta?: number;
    }>();

  if (!ALLOWED_TYPES.includes(flaggableType)) return err("نوع نامعتبر");
  if (!["dismiss", "warn", "temp_block", "rep_adjust", "rep_lock", "rep_unlock"].includes(userAction)) return err("اقدام نامعتبر");

  const table = typeTableMap[flaggableType];
  const col = flaggableType === "debate" ? "creator_id" : "user_id";
  const target = await c.env.DB.prepare(`SELECT ${col} as author FROM ${table} WHERE id = ?`).bind(flaggableId).first();
  if (!target) return err("یافت نشد", 404);
  const targetUserId = target.author;

  const batchOps: D1PreparedStatement[] = [
    c.env.DB.prepare("UPDATE flags SET status = 'resolved' WHERE flaggable_type = ? AND flaggable_id = ? AND status = 'pending'")
      .bind(flaggableType, flaggableId),
    c.env.DB.prepare(
      `INSERT INTO mod_actions (judge_id, target_user_id, flaggable_type, flaggable_id, user_action, content_action, note, duration_days, rep_delta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(user!.id, targetUserId, flaggableType, flaggableId, userAction, contentAction || null, note || null, durationDays || null, repDelta || null),
  ];

  if (userAction === "temp_block" && durationDays) {
    const blockedUntil = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    batchOps.push(c.env.DB.prepare("UPDATE users SET blocked_until = ? WHERE id = ?").bind(blockedUntil, targetUserId));
  } else if (userAction === "rep_adjust" && repDelta) {
    batchOps.push(c.env.DB.prepare("UPDATE users SET reputation = MAX(0, reputation + ?) WHERE id = ?").bind(repDelta, targetUserId));
  } else if (userAction === "rep_lock") {
    batchOps.push(c.env.DB.prepare("UPDATE users SET rep_locked = 1 WHERE id = ?").bind(targetUserId));
  } else if (userAction === "rep_unlock") {
    batchOps.push(c.env.DB.prepare("UPDATE users SET rep_locked = 0 WHERE id = ?").bind(targetUserId));
  }

  if (contentAction && ["cover", "remove"].includes(contentAction)) {
    const moderationState = contentAction === "cover" ? "covered" : "removed";
    batchOps.push(c.env.DB.prepare(`UPDATE ${table} SET moderation_state = ? WHERE id = ?`).bind(moderationState, flaggableId));
  }

  await c.env.DB.batch(batchOps);
  return ok({ ok: true });
});

flagsRt.post("/apply-judge", async (c) => {
  const { name, phone, topics, experience } = await c.req.json<{
    name: string;
    phone: string;
    topics: string;
    experience?: string;
  }>();

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return err("نام و نام خانوادگی را وارد کنید");
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
    return err("شماره تماس معتبر وارد کنید");
  }
  if (!topics || typeof topics !== "string" || topics.trim().length < 3) {
    return err("حوزه‌های مورد علاقه و توانمندی را وارد کنید");
  }

  await c.env.DB.prepare(
    "INSERT INTO judge_applications (name, phone, topics, experience) VALUES (?, ?, ?, ?)"
  ).bind(name.trim(), phone.trim(), topics.trim(), experience?.trim() || null).run();

  return ok({ ok: true });
});

export { flagsRt };