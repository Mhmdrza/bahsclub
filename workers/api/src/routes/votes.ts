import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, ensureNotBlocked, err, ok } from "../lib";

const votes = new Hono<{ Bindings: { DB: D1Database } }>();

async function getAuthor(db: D1Database, type: string, id: number): Promise<number | null> {
  const mapping: Record<string, { table: string; col: string }> = {
    statement: { table: "statements", col: "user_id" },
    counter_statement: { table: "counter_statements", col: "user_id" },
    debate: { table: "debates", col: "creator_id" },
    message: { table: "debate_messages", col: "user_id" },
  };
  const m = mapping[type];
  if (!m) return null;
  const row = await db.prepare(`SELECT ${m.col} as author FROM ${m.table} WHERE id = ?`).bind(id).first<any>();
  return row?.author ?? null;
}

votes.post("/toggle", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const blockedErr = ensureNotBlocked(user!);
  if (blockedErr) return blockedErr;

  const { voteableType, voteableId } = await c.req.json<{ voteableType: string; voteableId: number }>();
  if (!["statement", "counter_statement", "debate", "message"].includes(voteableType)) return err("نوع رای نامعتبر");

  const author = await getAuthor(c.env.DB, voteableType, voteableId);
  if (author === user!.id) return err("نمی‌توانید به محتوای خود رأی دهید");

  const insertResult = await c.env.DB.prepare("INSERT OR IGNORE INTO votes (user_id, voteable_type, voteable_id) VALUES (?, ?, ?)")
    .bind(user!.id, voteableType, voteableId).run();

  if (insertResult.meta?.changes === 1) {
    if (author) {
      await c.env.DB.batch([
        c.env.DB.prepare("UPDATE users SET reputation = reputation + 1 WHERE id = ? AND rep_locked = 0").bind(author),
      ]);
    }
    return ok({ voted: true });
  }

  await c.env.DB.prepare("DELETE FROM votes WHERE user_id = ? AND voteable_type = ? AND voteable_id = ?")
    .bind(user!.id, voteableType, voteableId).run();

  if (author) {
    // ponytail: race between unvote and rep_lock toggle — if author got locked after vote was cast, unvote still deducts
    await c.env.DB.batch([
      c.env.DB.prepare("UPDATE users SET reputation = MAX(0, reputation - 1) WHERE id = ? AND rep_locked = 0").bind(author),
    ]);
  }
  return ok({ voted: false });
});

export { votes };