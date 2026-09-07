import { Hono } from "hono";
import { auth } from "./routes/auth";
import { debates } from "./routes/debates";
import { votes } from "./routes/votes";
import { tags } from "./routes/tags";
import { users } from "./routes/users";
import { flagsRt } from "./routes/flags";

type Bindings = { DB: D1Database };

const app = new Hono<{ Bindings: Bindings }>();

app.route("/api/auth", auth);
app.route("/api/debates", debates);
app.route("/api/votes", votes);
app.route("/api/tags", tags);
app.route("/api/users", users);
app.route("/api/flags", flagsRt);

const FORFEIT_HOURS = 24;

async function runForfeitCheck(db: D1Database) {
  const cutoff = new Date(Date.now() - FORFEIT_HOURS * 60 * 60 * 1000).toISOString();
  await db.prepare(`
    UPDATE debates SET status = 'closed', closed_reason = 'forfeit', updated_at = ?
    WHERE id IN (
      SELECT d.id FROM debates d
      LEFT JOIN turns t ON t.debate_id = d.id
      WHERE d.status = 'in_progress'
      GROUP BY d.id
      HAVING COALESCE(MAX(t.created_at), d.created_at) < ?
    )
  `).bind(new Date().toISOString(), cutoff).run();
}

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Bindings, _ctx: ExecutionContext) {
    await runForfeitCheck(env.DB);
  },
};