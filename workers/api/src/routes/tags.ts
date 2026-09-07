import { Hono } from "hono";

const tags = new Hono<{ Bindings: { DB: D1Database } }>();

tags.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT t.*, COUNT(DISTINCT dt.debate_id) as debate_count
    FROM tags t LEFT JOIN debate_tags dt ON t.id = dt.tag_id
    GROUP BY t.id ORDER BY debate_count DESC
  `).all<any>();
  return new Response(JSON.stringify({ tags: results || [] }), { headers: { 'Content-Type': 'application/json' } });
});

tags.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const tag = await c.env.DB.prepare("SELECT * FROM tags WHERE slug = ?").bind(slug).first<any>();
  if (!tag) return new Response(JSON.stringify({ error: "برچسب یافت نشد" }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  const { results } = await c.env.DB.prepare(`
    SELECT d.*,
      (SELECT COUNT(*) FROM votes WHERE voteable_type = 'debate' AND voteable_id = d.id) as vote_count
    FROM debates d
    JOIN debate_tags dt ON d.id = dt.debate_id
    WHERE dt.tag_id = ?
    ORDER BY vote_count DESC
  `).bind(tag.id).all<any>();

  return new Response(JSON.stringify({ tag, debates: results || [] }), { headers: { 'Content-Type': 'application/json' } });
});

export { tags };