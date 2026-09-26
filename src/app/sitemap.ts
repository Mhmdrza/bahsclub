import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getArticleSlugs,
  getCategoryFacets,
  getLessonSlugs,
  getPageSlugs,
  getPublishedArticles,
  getPublishedTopics,
  getTagFacets,
} from "@/lib/content";

/** Pages whose URL is shadowed by a permanent redirect or reserved segment. */
const EXCLUDED_PAGES = new Set(["club-rules"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const articles = getPublishedArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  const fixed: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learn`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/topics`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/practice`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ladder`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const topicHubs: MetadataRoute.Sitemap = getPublishedTopics().map((topic) => ({
    url: `${SITE_URL}/topics/${topic.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryHubs: MetadataRoute.Sitemap = getCategoryFacets().map((facet) => ({
    url: `${SITE_URL}/articles/category/${facet.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagHubs: MetadataRoute.Sitemap = getTagFacets().map((facet) => ({
    url: `${SITE_URL}/articles/tag/${facet.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const articlePages: MetadataRoute.Sitemap = getArticleSlugs().map((slug) => {
    const article = bySlug.get(slug);
    return {
      url: `${SITE_URL}/articles/${slug}`,
      lastModified:
        (article?.updatedAt && new Date(article.updatedAt)) ||
        (article?.publishedAt && new Date(article.publishedAt)) ||
        now,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  const lessonPages: MetadataRoute.Sitemap = getLessonSlugs().map((slug) => ({
    url: `${SITE_URL}/learn/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const contentPages: MetadataRoute.Sitemap = getPageSlugs()
    .filter((slug) => !EXCLUDED_PAGES.has(slug))
    .map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [
    ...fixed,
    ...topicHubs,
    ...categoryHubs,
    ...tagHubs,
    ...articlePages,
    ...lessonPages,
    ...contentPages,
  ];
}
