"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import type { SearchIndexItem } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { useCompletedSlugs } from "@/hooks/useCompletedSlugs";

interface SearchAndFiltersProps {
  items: SearchIndexItem[];
  facets: {
    categories: string[];
    levels: string[];
    tags: string[];
    topics: string[];
  };
  topicLabels: Record<string, string>;
}

type SortOption = "recommended" | "newest" | "shortest";

export function SearchAndFilters({
  items,
  facets,
  topicLabels,
}: SearchAndFiltersProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [tag, setTag] = useState("");
  const [topic, setTopic] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");
  const completedSlugs = useCompletedSlugs();

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "description", "tags", "body", "category"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [items]
  );

  const filtered = useMemo(() => {
    let results = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...items];

    if (category) results = results.filter((i) => i.category === category);
    if (level) results = results.filter((i) => i.level === level);
    if (tag) results = results.filter((i) => i.tags.includes(tag));
    if (topic) results = results.filter((i) => i.topics.includes(topic));

    if (sort === "shortest") {
      results.sort((a, b) => a.readingTime - b.readingTime);
    } else if (sort === "newest") {
      results.sort((a, b) => b.slug.localeCompare(a.slug));
    }

    return results;
  }, [items, query, category, level, tag, topic, sort, fuse]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در مقاله‌ها..."
          aria-label="جستجو در مقاله‌ها"
          className="w-full rounded-lg border border-border bg-surface py-2.5 pr-10 pl-4 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="فیلتر دسته‌بندی"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">همه دسته‌ها</option>
          {facets.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          aria-label="فیلتر سطح"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">همه سطوح</option>
          {facets.levels.map((l) => (
            <option key={l} value={l}>
              {l === "beginner"
                ? "مبتدی"
                : l === "intermediate"
                  ? "متوسط"
                  : "پیشرفته"}
            </option>
          ))}
        </select>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-label="فیلتر موضوع"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">همه موضوع‌ها</option>
          {facets.topics.map((t) => (
            <option key={t} value={t}>
              {topicLabels[t] ?? t}
            </option>
          ))}
        </select>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          aria-label="فیلتر برچسب"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">همه برچسب‌ها</option>
          {facets.tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="مرتب‌سازی"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="recommended">پیشنهادی</option>
          <option value="newest">تازه‌ترین</option>
          <option value="shortest">کوتاه‌ترین</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-12 text-center text-muted">
          مقاله‌ای با این فیلترها پیدا نشد.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <ArticleCard
              key={item.slug}
              article={{
                ...item,
                status: "published",
                order: 0,
                publishedAt: "",
                content: "",
                headings: [],
              }}
              completed={completedSlugs.has(item.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
