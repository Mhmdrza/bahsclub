import { Hono } from "hono";
import { getAuthToken, getCurrentUser, needAuth, err, ok } from "../lib";

const votes = new Hono<{ Bindings: { DB: D1Database } }>();

votes.post("/toggle", async (c) => {
  const token = getAuthToken(c);
  const user = await getCurrentUser(c.env.DB, token);
  const authErr = needAuth(user);
  if (authErr) return authErr;

  const { voteableType, voteableId } = await c.req.json<{ voteableType: string; voteableId: number }>();
  if (!["debate", "turn"].includes(voteableType)) return err("نوع رای نامعتبر");

  const existing = await c.env.DB.prepare("SELECT id FROM votes WHERE user_id = ? AND voteable_type = ? AND voteable_id = ?")
    .bind(user!.id, voteableType, voteableId).first<any>();

  if (existing) {
    await c.env.DB.prepare("DELETE FROM votes WHERE id = ?").bind(existing.id).run();
    return ok({ voted: false });
  }

  await c.env.DB.prepare("INSERT INTO votes (user_id, voteable_type, voteable_id) VALUES (?, ?, ?)")
    .bind(user!.id, voteableType, voteableId).run().catch(() => {});

  return ok({ voted: true });
});

export { votes };