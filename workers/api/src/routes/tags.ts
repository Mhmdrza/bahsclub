import { Hono } from "hono";
import { err, ok, getPagination, paginatedResponse } from "../lib";

const tags = new Hono<{ Bindings: { DB: D1Database } }>();

tags.get("/", async (c) => {
  const pg = getPagination(c.req.query());

  const [{ total }] = (await c.env.DB.prepare("SELECT COUNT(DISTINCT t.id) as total FROM tags t").all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(`
    SELECT t.*, COUNT(DISTINCT st.statement_id) as statement_count
    FROM tags t LEFT JOIN statement_tags st ON t.id = st.tag_id
    GROUP BY t.id ORDER BY statement_count DESC LIMIT ? OFFSET ?
  `).bind(pg.limit, pg.offset).all();

  return paginatedResponse(results || [], pg.page, pg.limit, total);
});

tags.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const tag = await c.env.DB.prepare("SELECT * FROM tags WHERE slug = ?").bind(slug).first();
  if (!tag) return err("برچسب یافت نشد", 404);

  const pg = getPagination(c.req.query());

  const [{ total }] = (await c.env.DB.prepare(
    "SELECT COUNT(*) as total FROM statements s JOIN statement_tags st ON s.id = st.statement_id WHERE st.tag_id = ? AND s.moderation_state != 'removed'"
  ).bind(tag.id).all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(`
    SELECT s.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'statement' AND voteable_id = s.id) as vote_count,
      (SELECT COUNT(*) FROM counter_statements WHERE statement_id = s.id) as counter_count
    FROM statements s
    JOIN statement_tags st ON s.id = st.statement_id
    WHERE st.tag_id = ? AND s.moderation_state != 'removed'
    ORDER BY vote_count DESC
    LIMIT ? OFFSET ?
  `).bind(tag.id, pg.limit, pg.offset).all();

  return ok({ tag, items: results || [], pagination: { page: pg.page, limit: pg.limit, total, hasMore: pg.page * pg.limit < total } });
});

export { tags };