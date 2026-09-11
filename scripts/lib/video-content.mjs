import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { parseTldr } from "./tldr.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");
export const ARTICLES_DIR = path.join(ROOT, "content", "articles");

const KEY_IDEA_RE = /^\s*>\s*\*\*ایده[ٔ]?\s*کلیدی[^*]*\*\*\s*(.+)/m;

export function extractKeyIdea(content) {
  const m = content.match(KEY_IDEA_RE);
  return m ? m[1].trim() : null;
}

export function splitIdea(idea) {
  const cleaned = idea.replace(/\s+/g, " ").replace(/[.,]+$/, "");
  for (const b of ["؛", ";", ". ", ".", "، ", "،"]) {
    const idx = cleaned.indexOf(b);
    if (idx > 20) {
      const at = idx + b.length - 1;
      return [cleaned.slice(0, at).trim(), cleaned.slice(at + 1).trim()].filter(Boolean);
    }
  }
  return [cleaned];
}

export function loadArticles() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = data.slug ?? file.replace(/\.mdx$/, "");
    return {
      slug,
      data,
      content,
      keyIdea: extractKeyIdea(content),
      tldr: parseTldr(content),
    };
  });
}

export function bySlug(articles) {
  const map = new Map(articles.map((a) => [a.slug, a]));
  return (slug) => map.get(slug);
}

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}
