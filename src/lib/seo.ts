import type { Metadata } from "next";
import { getSiteConfig } from "./content";
import { SITE_URL } from "./site";
import type { Article, Lesson } from "./types";

interface PageMetaInput {
  path: string;
  title?: string;
  description?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/** Per-page metadata with canonical + Open Graph + Twitter, resolved against SITE_URL. */
export function pageMetadata({
  path,
  title,
  description,
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const siteName = getSiteConfig().title;
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          url: path,
          title,
          description,
          siteName,
          locale: "fa_IR",
          publishedTime,
          modifiedTime,
        }
      : { type: "website", url: path, title, description, siteName, locale: "fa_IR" };

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph,
    twitter: { card: "summary_large_image", title, description },
  };
}

function org(siteName: string) {
  return { "@type": "Organization", name: siteName, url: SITE_URL };
}

export function websiteJsonLd() {
  const site = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.title,
    url: SITE_URL,
    description: site.description,
    inLanguage: "fa-IR",
    publisher: org(site.title),
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

export function articleJsonLd(article: Article) {
  const site = getSiteConfig();
  const url = `${SITE_URL}/articles/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "fa-IR",
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    articleSection: article.category,
    keywords: [...article.tags, ...article.topics].join(", "),
    author: org(site.title),
    publisher: org(site.title),
  };
}

export function courseJsonLd(lesson: Lesson) {
  const site = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: lesson.title,
    description: lesson.description,
    url: `${SITE_URL}/learn/${lesson.slug}`,
    inLanguage: "fa-IR",
    provider: org(site.title),
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };
}

export function collectionJsonLd(options: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: `${SITE_URL}${options.path}`,
    inLanguage: "fa-IR",
  };
}
