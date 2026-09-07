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

export default app;