import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import Link from "next/link";

export default async function TagsPage() {
  const token = await getTokenForAction();

  try {
    const data = await apiFetch<{ items: any[] }>("/api/tags", { token });
    const tags = data.items || [];

    return (
      <div>
        <div className="mb-6 border-b border-border pb-4">
          <div className="eyebrow mb-1">دسته‌بندی موضوعی</div>
          <h1 className="text-2xl font-bold tracking-tight">تگ‌ها</h1>
        </div>

        {tags.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
            هنوز برچسبی وجود ندارد
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {tags.map((t: any) => (
              <Link
                key={t.id}
                href={`/club/tags/${t.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded border border-border bg-surface text-foreground hover:border-accent hover:text-accent transition-colors shadow-xs"
              >
                <span>#{t.name}</span>
                <span className="text-xs text-muted font-mono bg-background px-1.5 py-0.5 rounded border border-border/50">
                  {t.debate_count}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
        خطا در دریافت تگ‌ها
      </div>
    );
  }
}