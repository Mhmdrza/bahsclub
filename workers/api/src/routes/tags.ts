import { Hono } from "hono";
import { err, ok, getPagination, paginatedResponse } from "../lib";

const tags = new Hono<{ Bindings: { DB: D1Database } }>();

tags.get("/", async (c) => {
  const pg = getPagination(c.req.query());

  const [{ total }] = (await c.env.DB.prepare("SELECT COUNT(DISTINCT t.id) as total FROM tags t").all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(`
    SELECT t.*, COUNT(DISTINCT dt.debate_id) as debate_count
    FROM tags t LEFT JOIN debate_tags dt ON t.id = dt.tag_id
    GROUP BY t.id ORDER BY debate_count DESC LIMIT ? OFFSET ?
  `).bind(pg.limit, pg.offset).all<any>();

  return paginatedResponse(results || [], pg.page, pg.limit, total);
});

tags.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const tag = await c.env.DB.prepare("SELECT * FROM tags WHERE slug = ?").bind(slug).first<any>();
  if (!tag) return err("برچسب یافت نشد", 404);

  const pg = getPagination(c.req.query());

  const [{ total }] = (await c.env.DB.prepare(
    "SELECT COUNT(*) as total FROM debates d JOIN debate_tags dt ON d.id = dt.debate_id WHERE dt.tag_id = ?"
  ).bind(tag.id).all<{ total: number }>()).results || [{ total: 0 }];

  const { results } = await c.env.DB.prepare(`
    SELECT d.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'debate' AND voteable_id = d.id) as vote_count
    FROM debates d
    JOIN debate_tags dt ON d.id = dt.debate_id
    WHERE dt.tag_id = ?
    ORDER BY vote_count DESC
    LIMIT ? OFFSET ?
  `).bind(tag.id, pg.limit, pg.offset).all<any>();

  return ok({ tag, items: results || [], pagination: { page: pg.page, limit: pg.limit, total, hasMore: pg.page * pg.limit < total } });
});

export { tags };