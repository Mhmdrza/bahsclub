import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const LESSONS_DIR = path.join(ROOT, "content", "lessons");
const PAGES_DIR = path.join(ROOT, "content", "pages");
const CONFIG_PATH = path.join(ROOT, "content", "site.yaml");

const errors = [];
const warnings = [];

function err(msg) {
  errors.push(msg);
  console.error("  ❌ " + msg);
}
function warn(msg) {
  warnings.push(msg);
  console.warn("  ⚠️  " + msg);
}

// ── Load all article slugs ─────────────────────────────────────────
function loadArticleSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug ?? f.replace(".mdx", ""),
        file: f,
        type: data.type ?? "article",
        order: Number(data.order) || 0,
        status: data.status ?? "published",
        related: data.related ?? [],
        topics: data.topics ?? [],
        family: data.family ?? "",
      };
    });
}

// ── Load lesson data ──────────────────────────────────────────────
function loadLessons() {
  if (!fs.existsSync(LESSONS_DIR)) return [];
  return fs
    .readdirSync(LESSONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(LESSONS_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug ?? f.replace(".md", ""),
        file: f,
        steps: data.steps ?? [],
        status: data.status ?? "published",
        order: Number(data.order) || 0,
      };
    });
}

// ── Load pages ─────────────────────────────────────────────────────
function loadPages() {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
      const { data } = matter(raw);
      return { slug: data.slug ?? f.replace(".md", ""), file: f };
    });
}

// ── Load topics ────────────────────────────────────────────────────
function loadTopicSlugs() {
  const dir = path.join(ROOT, "content", "topics");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data } = matter(raw);
      return data.slug ?? f.replace(".md", "");
    });
}

// ── MAIN VALIDATION ────────────────────────────────────────────────
function main() {
  const articles = loadArticleSlugs();
  const slugSet = new Set(articles.map((a) => a.slug));
  const publishedSlugs = new Set(
    articles.filter((a) => a.status === "published").map((a) => a.slug)
  );
  const lessons = loadLessons();
  const pages = loadPages();
  const topicSlugs = loadTopicSlugs();

  console.log(`Validating ${articles.length} articles, ${lessons.length} lessons, ${pages.length} pages...\n`);

  // 1. Duplicate slugs
  const seen = {};
  for (const a of articles) {
    if (seen[a.slug]) err(`Duplicate slug "${a.slug}" in ${a.file} and ${seen[a.slug]}`);
    seen[a.slug] = a.file;
  }

  // 2. Duplicate order numbers per type
  const ordersByType = {};
  for (const a of articles) {
    const key = a.type;
    if (!ordersByType[key]) ordersByType[key] = {};
    if (ordersByType[key][a.order]) {
      err(`Duplicate order ${a.order} for type "${key}": "${a.slug}" (${a.file}) vs "${ordersByType[key][a.order]}"`);
    }
    ordersByType[key][a.order] = a.slug;
  }

  // 3. Lesson steps must reference existing, published articles
  for (const l of lessons) {
    if (l.status !== "published") continue;
    for (const step of l.steps) {
      if (!slugSet.has(step)) {
        err(`Lesson "${l.slug}" (${l.file}) step "${step}" does not match any article slug`);
      } else if (!publishedSlugs.has(step)) {
        warn(`Lesson "${l.slug}" step "${step}" references non-published article`);
      }
    }
  }

  // 4. Cross-references in article bodies
  for (const a of articles) {
    const filePath = path.join(ARTICLES_DIR, a.file);
    const raw = fs.readFileSync(filePath, "utf8");
    const re = /\]\(\/articles\/([a-zA-Z0-9_-]+)\)/g;
    let m;
    while ((m = re.exec(raw)) !== null) {
      if (!slugSet.has(m[1])) {
        err(`Article "${a.slug}" (${a.file}) links to "/articles/${m[1]}" which does not exist`);
      }
    }
  }

  // 5. related frontmatter slugs
  for (const a of articles) {
    for (const rel of a.related) {
      if (!slugSet.has(rel)) {
        err(`Article "${a.slug}" has related="${rel}" which does not exist`);
      }
    }
  }

  // 6. topics frontmatter must reference valid topic slugs
  for (const a of articles) {
    for (const t of a.topics) {
      if (!topicSlugs.includes(t)) {
        err(`Article "${a.slug}" references topic "${t}" which does not exist`);
      }
    }
  }

  // 7. site.yaml homeSlots
  if (fs.existsSync(CONFIG_PATH)) {
    const config = loadYaml(fs.readFileSync(CONFIG_PATH, "utf8"));
    for (const slot of config.homeSlots ?? []) {
      if (slot.articleSlug && !slugSet.has(slot.articleSlug)) {
        err(`site.yaml homeSlot references "${slot.articleSlug}" which does not exist`);
      }
    }
    if (config.featuredLessonSlug) {
      const lessonSlugs = lessons.map((l) => l.slug);
      if (!lessonSlugs.includes(config.featuredLessonSlug)) {
        err(`site.yaml featuredLessonSlug "${config.featuredLessonSlug}" does not match any lesson`);
      }
    }
  }

  // 8. Missing required frontmatter
  for (const a of articles) {
    if (!a.family) warn(`Article "${a.slug}" has no family — consider adding one`);
  }

  // 9. Pages must have unique slugs
  const pageSeen = {};
  for (const p of pages) {
    if (pageSeen[p.slug]) err(`Duplicate page slug "${p.slug}" in ${p.file}`);
    pageSeen[p.slug] = p.file;
  }

  // ── Summary ──────────────────────────────────────────────────────
  console.log(`\n${"=".repeat(50)}`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All checks passed. Content library is consistent.");
    process.exit(0);
  } else {
    console.log(`❌ ${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(errors.length > 0 ? 1 : 0);
  }
}

main();