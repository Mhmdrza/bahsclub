import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, needJudge, ensureNotBlocked, err, ok } from "../lib";

const REASONS = ["personal_attack", "insulting_question", "derailing", "motive_guessing", "pressure", "spam", "other"];
const SEP = "\x00";

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
  if (!["debate", "turn"].includes(flaggableType)) return err("نوع گزارش نامعتبر");
  if (!REASONS.includes(reason)) return err("دلیل نامعتبر");

  if (flaggableType === "turn") {
    const turn = await c.env.DB.prepare("SELECT user_id FROM turns WHERE id = ?").bind(flaggableId).first<any>();
    if (!turn) return err("پیام یافت نشد", 404);
    if (turn.user_id === user!.id) return err("نمی‌توانید پیام خود را گزارش کنید");
  } else {
    const debate = await c.env.DB.prepare("SELECT creator_id FROM debates WHERE id = ?").bind(flaggableId).first<any>();
    if (!debate) return err("بحث یافت نشد", 404);
    if (debate.creator_id === user!.id) return err("نمی‌توانید بحث خود را گزارش کنید");
  }

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
  `).all<any>();

  const pendingWithContext = [];
  for (const p of (pending || [])) {
    let contentPreview = "", authorName = "", debateTitle = "";
    if (p.flaggable_type === "turn") {
      const turn = await c.env.DB.prepare(
        "SELECT t.content, u.username, d.title, d.id as debate_id FROM turns t JOIN users u ON t.user_id = u.id JOIN debates d ON t.debate_id = d.id WHERE t.id = ?"
      ).bind(p.flaggable_id).first<any>();
      if (!turn) continue;
      contentPreview = turn.content.slice(0, 300);
      authorName = turn.username;
      debateTitle = turn.title;
    } else {
      const debate = await c.env.DB.prepare(
        "SELECT d.initial_statement, u.username, d.title FROM debates d JOIN users u ON d.creator_id = u.id WHERE d.id = ?"
      ).bind(p.flaggable_id).first<any>();
      if (!debate) continue;
      contentPreview = debate.initial_statement.slice(0, 300);
      authorName = debate.username;
      debateTitle = debate.title;
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
      debateId: p.flaggable_type === "turn" ? null : p.flaggable_id,
      flaggers,
    });
  }

  const { results: resolved } = await c.env.DB.prepare(`
    SELECT ma.*, u.username as judge_username, t.username as target_username
    FROM mod_actions ma
    JOIN users u ON ma.judge_id = u.id
    JOIN users t ON ma.target_user_id = t.id
    ORDER BY ma.created_at DESC LIMIT 30
  `).all<any>();

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

  if (!["debate", "turn"].includes(flaggableType)) return err("نوع نامعتبر");
  if (!["dismiss", "warn", "temp_block", "rep_adjust", "rep_lock", "rep_unlock"].includes(userAction)) return err("اقدام نامعتبر");

  let targetUserId: number;
  if (flaggableType === "turn") {
    const turn = await c.env.DB.prepare("SELECT user_id FROM turns WHERE id = ?").bind(flaggableId).first<any>();
    if (!turn) return err("پیام یافت نشد", 404);
    targetUserId = turn.user_id;
  } else {
    const debate = await c.env.DB.prepare("SELECT creator_id FROM debates WHERE id = ?").bind(flaggableId).first<any>();
    if (!debate) return err("بحث یافت نشد", 404);
    targetUserId = debate.creator_id;
  }

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
    if (flaggableType === "turn") {
      batchOps.push(c.env.DB.prepare("UPDATE turns SET moderation_state = ? WHERE id = ?").bind(moderationState, flaggableId));
    } else {
      batchOps.push(c.env.DB.prepare("UPDATE debates SET moderation_state = ? WHERE id = ?").bind(moderationState, flaggableId));
    }
  }

  await c.env.DB.batch(batchOps);
  return ok({ ok: true });
});

export { flagsRt };