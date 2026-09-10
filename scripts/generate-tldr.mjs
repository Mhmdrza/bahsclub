import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const OUT_DIR = path.join(ROOT, "public", "tldr");

const KEY_IDEA_RE = /^\s*>\s*\*\*ایده[ٔ]?\s*کلیدی[^*]*\*\*\s*(.+)/m;

function extractKeyIdea(content) {
  const m = content.match(KEY_IDEA_RE);
  return m ? m[1].trim() : null;
}

function splitIdea(idea) {
  const cleaned = idea.replace(/\s+/g, " ").replace(/[.,]+$/, "");
  const breakers = ["؛", ";", ". ", ".", "، ", "،"];
  for (const b of breakers) {
    const idx = cleaned.indexOf(b);
    if (idx > 20) {
      const at = idx + b.length - 1;
      return [
        cleaned.slice(0, at).trim(),
        cleaned.slice(at + 1).trim(),
      ].filter(Boolean);
    }
  }
  return [cleaned];
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function metaText(article) {
  const parts = [];
  if (article.category) parts.push(article.category);
  if (article.readingTime) parts.push(`${article.readingTime} دقیقه مطالعه`);
  return parts.join(" · ");
}

function sceneHook(article) {
  return `<div class="scene" id="s1" data-duration="4.5">
  <span class="eyebrow" data-entrance="eyebrow"><span class="dash"></span>بحث‌کلاب · خلاصه فوری</span>
  <h1 class="title-lg" data-entrance="pop"><span class="accent">${escapeHtml(article.title)}</span></h1>
  <p class="body-lg" data-entrance="slide-up">${escapeHtml(article.description)}</p>
  <div class="meta-line" data-entrance="slide-meta">
    <span class="meta-tag">${escapeHtml(article.category || "مقاله")}</span>
    <span class="meta-tag">${escapeHtml(article.readingTime ? `${article.readingTime} دقیقه مطالعه` : "آموزش")}</span>
  </div>
</div>`;
}

function sceneKeyIdea(ideaLines) {
  const [head, ...rest] = ideaLines;
  const body = rest.length ? `<div class="quote-card" data-entrance="card"><p class="body-lg">${escapeHtml(rest.join(" "))}</p></div>` : "";
  return `<div class="scene" id="s2" data-duration="5.5">
  <span class="eyebrow" data-entrance="eyebrow"><span class="dash"></span>ایده کلیدی</span>
  <h1 class="title-lg" data-entrance="slide-up">${escapeHtml(head)}</h1>
  ${body}
</div>`;
}

function sceneCTA(article) {
  return `<div class="scene" id="s3" data-duration="4">
  <span class="eyebrow" data-entrance="eyebrow"><span class="dash"></span>پیوستن به گفت‌وگو</span>
  <h1 class="title-lg" data-entrance="slide-up">ادعا را بیازمای، <span class="accent">نه شخص را</span></h1>
  <div class="cta-box" data-entrance="slide-up">
    <p class="body-lg" style="margin: 0;">مطالعهٔ کامل مقاله، تمرین‌ها و نمونه‌های استدلالی</p>
    <span class="cta-badge">خواندن متن ←</span>
  </div>
</div>`;
}

function tldrHtml(article, ideaLines) {
  const scenes = [sceneHook(article), sceneKeyIdea(ideaLines), sceneCTA(article)];
  return `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TL;DR — ${escapeHtml(article.title)}</title>
    <link rel="stylesheet" href="/tldr/_shared/tldr.css" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script src="/tldr/_shared/tldr.js"></script>
  </head>
  <body>
    <div class="frame">
      <div class="stage" id="stage">
        <div class="scrim"></div>
        <div class="glow glow-a" id="glowA"></div>
        <div class="glow glow-b" id="glowB"></div>

${scenes.join("\n\n")}

      </div>
    </div>
    <script>
      TLDR.play();
    </script>
  </body>
</html>
`;
}

function generate(slug) {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const file = files.find((f) => {
    const { data } = matter(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8"));
    return (data.slug ?? f.replace(".mdx", "")) === slug;
  });
  if (!file) {
    console.error(`✗ Article not found: ${slug}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const article = {
    title: data.title ?? slug,
    description: data.description ?? "",
    readingTime: data.readingTime ?? "",
    category: data.category ?? "",
    type: data.type ?? "article",
  };

  const idea = extractKeyIdea(content);
  if (!idea) {
    console.error(`✗ No key-idea blockquote in: ${slug}`);
    return;
  }

  const ideaLines = splitIdea(idea);

  const dir = path.join(OUT_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "index.html"), tldrHtml(article, ideaLines), "utf8");
  console.log(`✓ Generated ${slug}: ${article.title}`);
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.log("Usage: node scripts/generate-tldr.mjs <slug> [slug...]");
  console.log("  or: node scripts/generate-tldr.mjs --all");
  process.exit(0);
}
if (targets[0] === "--all") {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  for (const f of files) {
    const { data } = matter(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8"));
    generate(data.slug ?? f.replace(".mdx", ""));
  }
} else {
  targets.forEach(generate);
}