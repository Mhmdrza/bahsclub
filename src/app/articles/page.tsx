import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  buildSearchIndex,
  getFacetValues,
  getPublishedTopics,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { facetSlug } from "@/lib/content";
import { SearchAndFilters } from "@/components/SearchAndFilters";

export const metadata: Metadata = pageMetadata({
  path: "/articles",
  title: "مقاله‌ها",
  description: "کتابخانهٔ مقالات، درس‌ها، تاکتیک‌ها و تمرین‌های بحث‌کلاب.",
});

export default function ArticlesPage() {
  const items = buildSearchIndex();
  const facets = getFacetValues();
  const topics = getPublishedTopics();
  const topicLabels = Object.fromEntries(topics.map((t) => [t.slug, t.title]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "مقاله‌ها" }]}
      />
      <h1 className="mb-2 text-3xl font-bold">مقاله‌ها</h1>
      <p className="mb-6 text-muted">
        جستجو و فیلتر در میان مقالات، تاکتیک‌ها و تمرین‌ها.
      </p>
      <nav aria-label="مرور موضوعی" className="mb-8 space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted">موضوع‌ها:</span>
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-md bg-surface px-2 py-0.5 text-muted hover:text-accent"
            >
              {topic.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted">دسته‌ها:</span>
          {facets.categories.map((category) => (
            <Link
              key={category}
              href={`/articles/category/${facetSlug(category)}`}
              className="rounded-md bg-surface px-2 py-0.5 text-muted hover:text-accent"
            >
              {category}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted">برچسب‌ها:</span>
          {facets.tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles/tag/${facetSlug(tag)}`}
              className="rounded-md bg-surface px-2 py-0.5 text-muted hover:text-accent"
            >
              {tag}
            </Link>
          ))}
        </div>
      </nav>
      <Suspense fallback={<div className="py-12 text-center text-muted">در حال بارگذاری...</div>}>
        <SearchAndFilters
          items={items}
          facets={facets}
          topicLabels={topicLabels}
        />
      </Suspense>
    </div>
  );
}
