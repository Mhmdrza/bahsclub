import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import Link from "next/link";

export default async function TagsPage() {
  const token = await getTokenForAction();

  try {
    const data = await apiFetch<{ tags: any[] }>("/api/tags", { token });
    const tags = data.tags || [];

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#1A1A1D" }}>برچسب‌ها</h1>
        {tags.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#5C5C63" }}>
            هنوز برچسبی وجود ندارد
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((t: any) => (
              <Link
                key={t.id}
                href={`/debate/tags/${t.slug}`}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-sm border hover:opacity-80"
                style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
              >
                {t.name}
                <span className="text-xs" style={{ color: "#5C5C63" }}>{t.debate_count}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-16" style={{ color: "#5C5C63" }}>
        خطا در دریافت برچسب‌ها
      </div>
    );
  }
}