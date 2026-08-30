import type { Metadata } from "next";
import {
  buildSearchIndex,
  getFacetValues,
  getPublishedTopics,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchAndFilters } from "@/components/SearchAndFilters";

export const metadata: Metadata = {
  title: "مقاله‌ها",
  description: "کتابخانهٔ مقالات، درس‌ها، تاکتیک‌ها و تمرین‌های بحث‌کلاب.",
};

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
      <p className="mb-8 text-muted">
        جستجو و فیلتر در میان مقالات، تاکتیک‌ها و تمرین‌ها.
      </p>
      <SearchAndFilters
        items={items}
        facets={facets}
        topicLabels={topicLabels}
      />
    </div>
  );
}
