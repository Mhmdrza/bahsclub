import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { load as loadYaml, dump as dumpYaml } from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const LESSONS_DIR = path.join(ROOT, "content", "lessons");
const PAGES_DIR = path.join(ROOT, "content", "pages");
const TOPICS_DIR = path.join(ROOT, "content", "topics");
const CONFIG_PATH = path.join(ROOT, "content", "site.yaml");
const MANIFEST_PATH = path.join(ROOT, "content", "manifest.yaml");

// ── Read all articles ──────────────────────────────────────────────
function loadArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug ?? f.replace(".mdx", ""),
        title: data.title ?? data.slug,
        description: data.description ?? "",
        type: data.type ?? "article",
        category: data.category ?? "",
        level: data.level ?? "beginner",
        readingTime: Number(data.readingTime) || 0,
        order: Number(data.order) || 0,
        tags: data.tags ?? [],
        topics: data.topics ?? [],
        family: data.family ?? "",
        status: data.status ?? "published",
        publishedAt: data.publishedAt ?? "",
        related: data.related ?? [],
        file: f,
      };
    })
    .sort((a, b) => a.order - b.order);
}

// ── Read all lessons ───────────────────────────────────────────────
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
        title: data.title ?? data.slug,
        description: data.description ?? "",
        status: data.status ?? "published",
        order: Number(data.order) || 0,
        steps: data.steps ?? [],
        featured: data.featured ?? false,
        milestone: data.milestone ?? "",
      };
    })
    .sort((a, b) => a.order - b.order);
}

// ── Read all pages ─────────────────────────────────────────────────
function loadPages() {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug ?? f.replace(".md", ""),
        title: data.title ?? data.slug,
        description: data.description ?? "",
        status: data.status ?? "published",
        order: Number(data.order) || 0,
      };
    });
}

// ── Read topics ────────────────────────────────────────────────────
function loadTopics() {
  if (!fs.existsSync(TOPICS_DIR)) return [];
  return fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(TOPICS_DIR, f), "utf8");
      const { data } = matter(raw);
      return {
        slug: data.slug ?? f.replace(".md", ""),
        title: data.title ?? data.slug,
        description: data.description ?? "",
        status: data.status ?? "published",
        order: Number(data.order) || 0,
      };
    });
}

// ── Read site config ───────────────────────────────────────────────
function loadSiteConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return loadYaml(raw);
}

// ── Extract cross-references from article bodies ───────────────────
function extractLinks(articleSlugs) {
  const slugSet = new Set(articleSlugs);
  const crossRefs = {};

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
    const { data } = matter(raw);
    const slug = data.slug ?? f.replace(".mdx", "");
    const content = raw;

    // Match markdown links to /articles/X
    const links = [];
    const re = /\]\(\/articles\/([a-zA-Z0-9_-]+)\)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      if (slugSet.has(m[1]) && !links.includes(m[1])) {
        links.push(m[1]);
      }
    }
    if (links.length) crossRefs[slug] = links;
  }
  return crossRefs;
}

// ── Build families from frontmatter ────────────────────────────────
function buildFamilies(articles) {
  const families = {};
  for (const a of articles) {
    if (!a.family) continue;
    if (!families[a.family]) families[a.family] = [];
    families[a.family].push(a.slug);
  }
  return families;
}

// ── Compute lesson memberships ─────────────────────────────────────
function computeLessonMemberships(articles, lessons) {
  const slugToLessons = {};
  for (const a of articles) slugToLessons[a.slug] = [];
  for (const l of lessons) {
    for (const step of l.steps) {
      if (slugToLessons[step]) slugToLessons[step].push(l.slug);
    }
  }
  return slugToLessons;
}

// ── Detect gaps ────────────────────────────────────────────────────
function detectGaps(articles, crossRefs, lessonMemberships, lessons) {
  const allSlugs = articles.map((a) => a.slug);

  // Orphan articles: not in any lesson
  const orphans = allSlugs.filter((s) => !lessonMemberships[s]?.length);

  // Articles without family
  const noFamily = articles.filter((a) => !a.family).map((a) => a.slug);

  // Articles that nothing links to (and are not the first in a lesson)
  const linkedTo = new Set(Object.values(crossRefs).flat());
  const lessonStarts = new Set(lessons.map((l) => l.steps[0]).filter(Boolean));
  const unreferenced = allSlugs.filter(
    (s) => !linkedTo.has(s) && !lessonStarts.has(s)
  );

  // Tags with very few articles
  const tagCount = {};
  for (const a of articles) {
    for (const t of a.tags) tagCount[t] = (tagCount[t] || 0) + 1;
  }
  const sparseTags = Object.entries(tagCount)
    .filter(([, c]) => c < 2)
    .map(([t]) => t);

  // Topics with very few articles
  const topicCount = {};
  for (const a of articles) {
    for (const t of a.topics) topicCount[t] = (topicCount[t] || 0) + 1;
  }
  const sparseTopics = Object.entries(topicCount)
    .filter(([, c]) => c < 3)
    .map(([t]) => t);

  return { orphans, noFamily, unreferenced, sparseTags, sparseTopics };
}

// ── MAIN ───────────────────────────────────────────────────────────
function main() {
  const articles = loadArticles();
  const lessons = loadLessons();
  const pages = loadPages();
  const topics = loadTopics();
  const siteConfig = loadSiteConfig();

  const articleSlugs = articles.map((a) => a.slug);
  const crossRefs = extractLinks(articleSlugs);
  const families = buildFamilies(articles);
  const lessonMemberships = computeLessonMemberships(articles, lessons);
  const gaps = detectGaps(articles, crossRefs, lessonMemberships, lessons);

  // Attach lesson memberships to articles
  const enrichedArticles = articles.map((a) => ({
    ...a,
    lessons: lessonMemberships[a.slug] ?? [],
    inboundLinks: Object.entries(crossRefs)
      .filter(([, targets]) => targets.includes(a.slug))
      .map(([source]) => source),
  }));

  const manifest = {
    generatedAt: new Date().toISOString(),
    counts: {
      articles: articles.length,
      lessons: lessons.length,
      pages: pages.length,
      topics: topics.length,
      families: Object.keys(families).length,
    },
    articles: enrichedArticles,
    lessons,
    pages,
    topics,
    families,
    crossRefs,
    lessonMemberships,
    gaps,
    siteConfig: siteConfig
      ? {
          title: siteConfig.title,
          tagline: siteConfig.tagline,
          featuredLessonSlug: siteConfig.featuredLessonSlug,
          homeSlots: siteConfig.homeSlots,
          nav: siteConfig.nav,
        }
      : null,
  };

  fs.writeFileSync(MANIFEST_PATH, dumpYaml(manifest, { lineWidth: 120 }), "utf8");
  console.log(`✓ Manifest written: ${MANIFEST_PATH}`);
  console.log(`  Articles: ${manifest.counts.articles}`);
  console.log(`  Lessons:  ${manifest.counts.lessons}`);
  console.log(`  Pages:    ${manifest.counts.pages}`);
  console.log(`  Topics:   ${manifest.counts.topics}`);
  console.log(`  Families: ${manifest.counts.families}`);
  console.log(`  Orphans (no lesson): ${gaps.orphans.length}`);
  console.log(`  No family:          ${gaps.noFamily.length}`);
  console.log(`  Unreferenced:       ${gaps.unreferenced.length}`);
}

main();