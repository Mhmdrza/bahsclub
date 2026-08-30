import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import type {
  Article,
  ArticleFrontmatter,
  Lesson,
  LessonFrontmatter,
  Page,
  PageFrontmatter,
  SearchIndexItem,
  SiteConfig,
  TocHeading,
  Topic,
} from "./types";
import { slugifyHeading } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const LESSONS_DIR = path.join(CONTENT_DIR, "lessons");
const TOPICS_DIR = path.join(CONTENT_DIR, "topics");
const PAGES_DIR = path.join(CONTENT_DIR, "pages");

function readDirFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

function normalizeArticleContent(content: string, title: string): string {
  const lines = content.split("\n");
  const firstHeading = lines.findIndex((line) => /^#\s+/.test(line));
  if (firstHeading !== -1) {
    const headingText = lines[firstHeading].replace(/^#\s+/, "").trim();
    if (headingText === title) {
      lines.splice(firstHeading, 1);
      if (lines[firstHeading]?.trim() === "") {
        lines.splice(firstHeading, 1);
      }
    }
  }
  return lines.join("\n");
}

function normalizeArticleFrontmatter(data: ArticleFrontmatter): ArticleFrontmatter {
  return {
    ...data,
    readingTime: Number(data.readingTime),
    order: Number(data.order),
    tags: data.tags ?? [],
    topics: data.topics ?? [],
  };
}
function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[#*`]/g, "").trim();
    headings.push({ id: slugifyHeading(text), text, level });
  }

  return headings;
}

function loadArticlesRaw(): Article[] {
  const files = readDirFiles(ARTICLES_DIR);

  return files.map((filename) => {
    const filePath = path.join(ARTICLES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = normalizeArticleFrontmatter(data as ArticleFrontmatter);
    const normalizedContent = normalizeArticleContent(content, frontmatter.title);

    return {
      ...frontmatter,
      content: normalizedContent,
      headings: extractHeadings(normalizedContent),
    };
  });
}

let articlesCache: Article[] | null = null;

function getAllArticlesRaw(): Article[] {
  if (!articlesCache) {
    articlesCache = loadArticlesRaw();
  }
  return articlesCache;
}

export function getPublishedArticles(): Article[] {
  return getAllArticlesRaw()
    .filter((article) => article.status === "published")
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "fa"));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getArticleSlugs(): string[] {
  return getPublishedArticles().map((article) => article.slug);
}

function loadLessonsRaw(): LessonFrontmatter[] {
  const files = readDirFiles(LESSONS_DIR);

  return files.map((filename) => {
    const filePath = path.join(LESSONS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    return data as LessonFrontmatter;
  });
}

function resolveLesson(lesson: LessonFrontmatter): Lesson {
  const published = getPublishedArticles();
  const articleMap = new Map(published.map((a) => [a.slug, a]));

  const resolvedSteps: Article[] = [];
  const missing: string[] = [];

  for (const stepSlug of lesson.steps) {
    const article = articleMap.get(stepSlug);
    if (article) {
      resolvedSteps.push(article);
    } else {
      missing.push(stepSlug);
    }
  }

  if (lesson.status === "published" && missing.length > 0) {
    throw new Error(
      `Lesson "${lesson.slug}" references missing or unpublished articles: ${missing.join(", ")}`
    );
  }

  return { ...lesson, resolvedSteps };
}

export function getPublishedLessons(): Lesson[] {
  return loadLessonsRaw()
    .filter((lesson) => lesson.status === "published")
    .sort((a, b) => a.order - b.order)
    .map(resolveLesson);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  const lesson = loadLessonsRaw().find((l) => l.slug === slug);
  if (!lesson || lesson.status !== "published") return undefined;
  return resolveLesson(lesson);
}

export function getLessonSlugs(): string[] {
  return getPublishedLessons().map((lesson) => lesson.slug);
}

export function getLessonsForArticle(articleSlug: string): Lesson[] {
  return getPublishedLessons().filter((lesson) =>
    lesson.steps.includes(articleSlug)
  );
}

export function getLessonNavigation(
  lessonSlug: string,
  articleSlug: string
): { prev?: Article; next?: Article } {
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) return {};

  const index = lesson.resolvedSteps.findIndex((a) => a.slug === articleSlug);
  if (index === -1) return {};

  return {
    prev: index > 0 ? lesson.resolvedSteps[index - 1] : undefined,
    next:
      index < lesson.resolvedSteps.length - 1
        ? lesson.resolvedSteps[index + 1]
        : undefined,
  };
}

function loadTopicsRaw(): Topic[] {
  const files = readDirFiles(TOPICS_DIR);

  return files.map((filename) => {
    const filePath = path.join(TOPICS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    return data as Topic;
  });
}

export function getPublishedTopics(): Topic[] {
  return loadTopicsRaw()
    .filter((topic) => topic.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getPublishedTopics().find((topic) => topic.slug === slug);
}

export function getTopicSlugs(): string[] {
  return getPublishedTopics().map((topic) => topic.slug);
}

export function getArticlesByTopic(topicSlug: string): Article[] {
  return getPublishedArticles().filter((article) =>
    article.topics.includes(topicSlug)
  );
}

function loadPagesRaw(): Page[] {
  const files = readDirFiles(PAGES_DIR);

  return files.map((filename) => {
    const filePath = path.join(PAGES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = data as PageFrontmatter;
    return { ...frontmatter, content };
  });
}

export function getPublishedPages(): Page[] {
  return loadPagesRaw()
    .filter((page) => page.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function getPageBySlug(slug: string): Page | undefined {
  return getPublishedPages().find((page) => page.slug === slug);
}

export function getPageSlugs(): string[] {
  return getPublishedPages().map((page) => page.slug);
}

export function getSiteConfig(): SiteConfig {
  const configPath = path.join(CONTENT_DIR, "site.yaml");
  const raw = fs.readFileSync(configPath, "utf8");
  return loadYaml(raw) as SiteConfig;
}

export function getFeaturedLesson(): Lesson | undefined {
  const config = getSiteConfig();
  if (!config.featuredLessonSlug) return getPublishedLessons()[0];
  return (
    getLessonBySlug(config.featuredLessonSlug) ?? getPublishedLessons()[0]
  );
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  if (article.related?.length) {
    return article.related
      .map((slug) => getArticleBySlug(slug))
      .filter((a): a is Article => Boolean(a))
      .slice(0, limit);
  }

  return getPublishedArticles()
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        (candidate.topics.some((t) => article.topics.includes(t)) ||
          candidate.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}

export function getPracticeArticles(): Article[] {
  return getPublishedArticles().filter((article) => article.type === "practice");
}

export function getTacticArticles(): Article[] {
  return getPublishedArticles().filter((article) => article.type === "tactic");
}

export function getFacetValues(): {
  categories: string[];
  levels: string[];
  tags: string[];
  topics: string[];
} {
  const articles = getPublishedArticles();
  const categories = [...new Set(articles.map((a) => a.category))].sort((a, b) =>
    a.localeCompare(b, "fa")
  );
  const levels = [...new Set(articles.map((a) => a.level))];
  const tags = [...new Set(articles.flatMap((a) => a.tags))].sort((a, b) =>
    a.localeCompare(b, "fa")
  );
  const topics = getPublishedTopics().map((t) => t.slug);

  return { categories, levels, tags, topics };
}

export function getHomeSlotArticles(): {
  concept?: Article;
  tactic?: Article;
  practice?: Article;
} {
  const config = getSiteConfig();
  const articles = getPublishedArticles();
  const result: { concept?: Article; tactic?: Article; practice?: Article } =
    {};

  for (const slot of config.homeSlots) {
    const article =
      (slot.articleSlug
        ? getArticleBySlug(slot.articleSlug)
        : articles.find((a) => a.featuredOnHome === slot.type)) ?? undefined;
    if (article) {
      result[slot.type] = article;
    }
  }

  return result;
}

export function buildSearchIndex(): SearchIndexItem[] {
  return getPublishedArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    level: article.level,
    tags: article.tags,
    topics: article.topics,
    type: article.type,
    readingTime: article.readingTime,
    body: article.content,
  }));
}
