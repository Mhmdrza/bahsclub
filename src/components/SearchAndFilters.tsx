"use client";

import { useMemo, useState, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || searchParams.get("type") || ""
  );
  const [level, setLevel] = useState(() => searchParams.get("level") || "");
  const [tag, setTag] = useState(() => searchParams.get("tag") || "");
  const [topic, setTopic] = useState(() => searchParams.get("topic") || "");
  const [sort, setSort] = useState<SortOption>(
    () => (searchParams.get("sort") as SortOption) || "recommended"
  );
  const completedSlugs = useCompletedSlugs();

  const paramsKey = searchParams.toString();
  const [syncedKey, setSyncedKey] = useState(paramsKey);
  if (paramsKey !== syncedKey) {
    setSyncedKey(paramsKey);
    setQuery(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || searchParams.get("type") || "");
    setLevel(searchParams.get("level") || "");
    setTag(searchParams.get("tag") || "");
    setTopic(searchParams.get("topic") || "");
    setSort((searchParams.get("sort") as SortOption) || "recommended");
  }

  const updateUrl = useCallback(
    (updates: {
      query?: string;
      category?: string;
      level?: string;
      tag?: string;
      topic?: string;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      const q = updates.query !== undefined ? updates.query : query;
      const c = updates.category !== undefined ? updates.category : category;
      const l = updates.level !== undefined ? updates.level : level;
      const t = updates.tag !== undefined ? updates.tag : tag;
      const top = updates.topic !== undefined ? updates.topic : topic;
      const s = updates.sort !== undefined ? updates.sort : sort;

      if (q) params.set("q", q);
      else params.delete("q");

      if (c) params.set("category", c);
      else {
        params.delete("category");
        params.delete("type");
      }

      if (l) params.set("level", l);
      else params.delete("level");

      if (t) params.set("tag", t);
      else params.delete("tag");

      if (top) params.set("topic", top);
      else params.delete("topic");

      if (s && s !== "recommended") params.set("sort", s);
      else params.delete("sort");

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [searchParams, pathname, query, category, level, tag, topic, sort]
  );

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
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            updateUrl({ query: val });
          }}
          placeholder="جستجو در مقاله‌ها..."
          aria-label="جستجو در مقاله‌ها"
          className="w-full rounded-lg border border-border bg-surface py-2.5 pr-10 pl-4 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => {
            const val = e.target.value;
            setCategory(val);
            updateUrl({ category: val });
          }}
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
          onChange={(e) => {
            const val = e.target.value;
            setLevel(val);
            updateUrl({ level: val });
          }}
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
          onChange={(e) => {
            const val = e.target.value;
            setTopic(val);
            updateUrl({ topic: val });
          }}
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
          onChange={(e) => {
            const val = e.target.value;
            setTag(val);
            updateUrl({ tag: val });
          }}
          aria-label="فیلتر برچسب"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">همه تگ‌ها</option>
          {facets.tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            const val = e.target.value as SortOption;
            setSort(val);
            updateUrl({ sort: val });
          }}
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
              article={item}
              completed={completedSlugs.has(item.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
