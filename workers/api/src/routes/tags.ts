import { Hono } from "hono";
import { err, ok, getPagination, paginatedResponse } from "../lib";

const tags = new Hono<{ Bindings: { DB: D1Database } }>();

tags.get("/", async (c) => {
  const pg = getPagination(c.req.query());

  const [{ total }] = (await c.env.DB.prepare("SELECT COUNT(DISTINCT t.id) as total FROM tags t").all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(`
    SELECT t.*, COUNT(DISTINCT it.idea_id) as idea_count
    FROM tags t LEFT JOIN idea_tags it ON t.id = it.tag_id
    GROUP BY t.id ORDER BY idea_count DESC LIMIT ? OFFSET ?
  `).bind(pg.limit, pg.offset).all();

  return paginatedResponse(results || [], pg.page, pg.limit, total);
});

tags.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const tag = await c.env.DB.prepare("SELECT * FROM tags WHERE slug = ?").bind(slug).first();
  if (!tag) return err("برچسب یافت نشد", 404);

  const pg = getPagination(c.req.query());

  const [{ total }] = (await c.env.DB.prepare(
    "SELECT COUNT(*) as total FROM ideas i JOIN idea_tags it ON i.id = it.idea_id WHERE it.tag_id = ? AND i.moderation_state != 'removed'"
  ).bind(tag.id).all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(`
    SELECT i.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'idea' AND voteable_id = i.id) as vote_count,
      (SELECT COUNT(*) FROM idea_responses WHERE idea_id = i.id) as response_count
    FROM ideas i
    JOIN idea_tags it ON i.id = it.idea_id
    WHERE it.tag_id = ? AND i.moderation_state != 'removed'
    ORDER BY vote_count DESC
    LIMIT ? OFFSET ?
  `).bind(tag.id, pg.limit, pg.offset).all();

  return ok({ tag, items: results || [], pagination: { page: pg.page, limit: pg.limit, total, hasMore: pg.page * pg.limit < total } });
});

export { tags };
