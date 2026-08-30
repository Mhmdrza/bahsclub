"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  AlertTriangle,
  BookOpen,
  Target,
  Zap,
  Layers,
  Users,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ManifestArticle {
  slug: string;
  title: string;
  type: string;
  category: string;
  level: string;
  readingTime: number;
  order: number;
  tags: string[];
  topics: string[];
  family: string;
  status: string;
  lessons: string[];
  inboundLinks: string[];
  file: string;
}

interface ManifestLesson {
  slug: string;
  title: string;
  steps: string[];
  order: number;
}

interface ManifestGaps {
  orphans: string[];
  noFamily: string[];
  unreferenced: string[];
  sparseTags: string[];
  sparseTopics: string[];
}

interface Manifest {
  generatedAt: string;
  counts: { articles: number; lessons: number; families: number };
  articles: ManifestArticle[];
  lessons: ManifestLesson[];
  families: Record<string, string[]>;
  gaps: ManifestGaps;
}

// ── Helpers ────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, React.ReactNode> = {
  article: <BookOpen className="h-3.5 w-3.5" />,
  tactic: <Target className="h-3.5 w-3.5" />,
  practice: <Zap className="h-3.5 w-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
  article: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  tactic: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  practice:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "مبتدی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

const FAMILY_LABELS: Record<string, string> = {
  "schopenhauer-tactics": "تاکتیک‌های شوپنهاور",
  "classic-fallacies": "مغالطه‌های کلاسیک",
  "appeal-fallacies": "مغالطه‌های توسل",
  "hidden-distortions": "تحریف‌های پنهان",
  "judgment-literacy-core": "سواد قضاوت (مسیر اصلی)",
  "club-philosophy": "فلسفهٔ باشگاه",
  "practice-exercises": "تمرین‌های عملی",
  "advanced-judgment": "قضاوت پیشرفته",
};

// ── Component ──────────────────────────────────────────────────────
export function ContentMapClient({ manifest }: { manifest: Manifest }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "families" | "gaps">(
    "table"
  );
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);

  // ── Filtering ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return manifest.articles.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (typeFilter && a.type !== typeFilter) return false;
      if (familyFilter && a.family !== familyFilter) return false;
      if (levelFilter && a.level !== levelFilter) return false;
      return true;
    });
  }, [manifest.articles, search, typeFilter, familyFilter, levelFilter]);

  // ── Unique filter options ─────────────────────────────────────────
  const types = useMemo(
    () => [...new Set(manifest.articles.map((a) => a.type))].sort(),
    [manifest.articles]
  );
  const levels = ["beginner", "intermediate", "advanced"];
  const families = useMemo(
    () =>
      Object.keys(manifest.families).sort((a, b) => {
        const ca = manifest.families[a].length;
        const cb = manifest.families[b].length;
        return cb - ca;
      }),
    [manifest.families]
  );

  return (
    <div>
      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex overflow-hidden rounded-md border border-border">
          {(["table", "families", "gaps"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === mode
                  ? "bg-accent text-white"
                  : "bg-surface text-muted hover:bg-surface/60"
              }`}
            >
              {mode === "table" && "جدول"}
              {mode === "families" && "خانواده‌ها"}
              {mode === "gaps" && "شکاف‌ها"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="جستجو در عنوان، اسلاگ، یا تگ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface py-1.5 pr-8 pl-3 text-sm placeholder:text-muted/60 focus:border-accent/40 focus:outline-none"
          />
        </div>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
        >
          <option value="">همه نوع‌ها</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t === "article" ? "مقاله" : t === "tactic" ? "تاکتیک" : "تمرین"}
            </option>
          ))}
        </select>

        {/* Family filter */}
        <select
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm max-w-[200px]"
        >
          <option value="">همه خانواده‌ها</option>
          {families.map((f) => (
            <option key={f} value={f}>
              {FAMILY_LABELS[f] ?? f} ({manifest.families[f].length})
            </option>
          ))}
        </select>

        {/* Level filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
        >
          <option value="">همه سطح‌ها</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {LEVEL_LABELS[l] ?? l}
            </option>
          ))}
        </select>

        <span className="text-xs text-muted">
          {filtered.length} از {manifest.articles.length} مقاله
        </span>
      </div>

      {/* ── TABLE VIEW ─────────────────────────────────────────────── */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted">
              <tr>
                <th className="px-3 py-2 text-right w-12">#</th>
                <th className="px-3 py-2 text-right">عنوان</th>
                <th className="px-3 py-2 text-right w-24">نوع</th>
                <th className="px-3 py-2 text-right w-24">سطح</th>
                <th className="px-3 py-2 text-right w-36">خانواده</th>
                <th className="px-3 py-2 text-right w-16">زمان</th>
                <th className="px-3 py-2 text-right w-20">درس‌ها</th>
                <th className="px-3 py-2 text-right w-20">ارجاعات</th>
                <th className="px-3 py-2 text-center w-16">ویرایش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr
                  key={a.slug}
                  className="hover:bg-surface/50 transition-colors"
                >
                  <td className="px-3 py-2 text-muted">{a.order}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted">
                        {TYPE_ICONS[a.type] ?? null}
                      </span>
                      <Link
                        href={`/articles/${a.slug}`}
                        target="_blank"
                        className="font-medium hover:text-accent transition-colors"
                      >
                        {a.title}
                      </Link>
                    </div>
                    <div className="mt-0.5 text-xs text-muted truncate max-w-xs">
                      {a.slug}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs ${
                        TYPE_COLORS[a.type] ?? "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {TYPE_ICONS[a.type] ?? null}
                      {a.type === "article"
                        ? "مقاله"
                        : a.type === "tactic"
                          ? "تاکتیک"
                          : "تمرین"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {LEVEL_LABELS[a.level] ?? a.level}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <span className="text-muted">
                      {FAMILY_LABELS[a.family] ?? a.family}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted">
                    {a.readingTime}′
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {a.lessons.length > 0 ? (
                      <span className="text-accent">{a.lessons.length}</span>
                    ) : (
                      <span className="text-muted/50">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {a.inboundLinks.length > 0 ? (
                      <span className="text-accent">
                        {a.inboundLinks.length}
                      </span>
                    ) : (
                      <span className="text-muted/50">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Link
                      href={`/admin/articles/${a.slug}/edit`}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── FAMILIES VIEW ──────────────────────────────────────────── */}
      {viewMode === "families" && (
        <div className="space-y-3">
          {families.map((family) => {
            const members = (manifest.families[family] ?? [])
              .map((slug) => manifest.articles.find((a) => a.slug === slug))
              .filter(Boolean) as ManifestArticle[];
            const isExpanded = expandedFamily === family;

            return (
              <div
                key={family}
                className="rounded-lg border border-border bg-surface"
              >
                <button
                  onClick={() =>
                    setExpandedFamily(isExpanded ? null : family)
                  }
                  className="flex w-full items-center justify-between px-4 py-3 text-right"
                >
                  <div>
                    <span className="font-semibold">
                      {FAMILY_LABELS[family] ?? family}
                    </span>
                    <span className="mr-2 text-xs text-muted">
                      ({members.length} مقاله)
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted" />
                  )}
                </button>
                {isExpanded && (
                  <div className="border-t border-border px-4 py-3">
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {members.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/admin/articles/${a.slug}/edit`}
                          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent/40 hover:bg-background transition-colors"
                        >
                          <span className="text-muted">
                            {TYPE_ICONS[a.type] ?? null}
                          </span>
                          <span>{a.title}</span>
                          <span className="mr-auto text-xs text-muted/50">
                            #{a.order}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── GAPS VIEW ──────────────────────────────────────────────── */}
      {viewMode === "gaps" && (
        <div className="space-y-6">
          {/* Orphans */}
          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              مقالات بدون درس
              <span className="text-sm font-normal text-muted">
                ({manifest.gaps.orphans.length})
              </span>
            </h2>
            <p className="mb-3 text-xs text-muted">
              این مقاله‌ها در هیچ مسیر یادگیری‌ای قرار ندارند. شاید نیاز به یک
              درس جدید باشد.
            </p>
            <div className="flex flex-wrap gap-2">
              {manifest.gaps.orphans.map((slug) => {
                const a = manifest.articles.find((x) => x.slug === slug);
                if (!a) return null;
                return (
                  <Link
                    key={slug}
                    href={`/admin/articles/${slug}/edit`}
                    className="rounded border border-border px-2 py-1 text-xs hover:border-accent/40"
                  >
                    {a.title}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Unreferenced */}
          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
              <FileText className="h-4 w-4 text-amber-500" />
              مقالات بدون ارجاع داخلی
              <span className="text-sm font-normal text-muted">
                ({manifest.gaps.unreferenced.length})
              </span>
            </h2>
            <p className="mb-3 text-xs text-muted">
              هیچ مقالهٔ دیگری به این‌ها لینک نداده. شاید نیاز به ارجاع متقابل
              در مقاله‌های مرتبط باشد.
            </p>
            <div className="flex flex-wrap gap-2">
              {manifest.gaps.unreferenced.map((slug) => {
                const a = manifest.articles.find((x) => x.slug === slug);
                if (!a) return null;
                return (
                  <Link
                    key={slug}
                    href={`/admin/articles/${slug}/edit`}
                    className="rounded border border-border px-2 py-1 text-xs hover:border-accent/40"
                  >
                    {a.title}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Sparse tags */}
          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
              <Layers className="h-4 w-4 text-amber-500" />
              تگ‌های کم‌استفاده
              <span className="text-sm font-normal text-muted">
                ({manifest.gaps.sparseTags.length})
              </span>
            </h2>
            <p className="mb-3 text-xs text-muted">
              هر تگ فقط در یک مقاله استفاده شده. یا باید حذف شوند یا مقالهٔ
              بیشتری با آن تگ نوشته شود.
            </p>
            <div className="flex flex-wrap gap-1">
              {manifest.gaps.sparseTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-background px-2 py-0.5 text-xs text-muted border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Sparse topics */}
          <section className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
              <BookOpen className="h-4 w-4 text-amber-500" />
              موضوعات کم‌محتوا
              <span className="text-sm font-normal text-muted">
                ({manifest.gaps.sparseTopics.length})
              </span>
            </h2>
            <p className="mb-3 text-xs text-muted">
              این موضوعات کمتر از ۳ مقاله دارند. شاید نیاز به محتوای بیشتر
              باشد.
            </p>
            <div className="flex flex-wrap gap-1">
              {manifest.gaps.sparseTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded bg-background px-2 py-0.5 text-xs text-muted border border-border"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}