import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import Link from "next/link";
import { Hash } from "lucide-react";

export default async function TagsPage() {
  const token = await getTokenForAction();

  let data: { items: unknown[] } | undefined;
  try {
    data = await apiFetch<{ items: unknown[] }>("/api/tags", { token });
  } catch {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted">
        خطا در دریافت تگ‌ها
      </div>
    );
  }
  const tags = data?.items || [];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="border-b border-border pb-4">
        <div className="eyebrow mb-1">دسته‌بندی موضوعی</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">موضوعات و برچسب‌ها</h1>
        <p className="text-xs text-muted mt-1">دیدگاه‌ها و باورها را بر اساس حوزه اندیشه‌ای و تگ کاوش کنید</p>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
          هنوز برچسبی وجود ندارد
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {tags.map((t: unknown) => {
            const tag = t as { id: number; slug: string; name: string; statement_count: number };
            return (
              <Link
                key={tag.id}
                href={`/club/tags/${tag.slug}`}
                className="group flex items-center justify-between p-4 rounded-xl border border-border bg-surface hover:border-accent/50 transition-all shadow-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Hash size={15} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                  <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors truncate">
                    {tag.name}
                  </span>
                </div>
                <span className="text-xs text-muted font-mono bg-background px-2 py-0.5 rounded-md border border-border/60 shrink-0">
                  {tag.statement_count}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}