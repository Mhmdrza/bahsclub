import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import { notFound } from "next/navigation";
import { StatementCard } from "@/components/debate/StatementCard";

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await getTokenForAction();

  try {
    const data = await apiFetch<{ tag: any; items: any[]; pagination: { total: number } }>(`/api/tags/${slug}`, { token });
    if (!data.tag) notFound();

    const statements = data.items || [];

    return (
      <div>
        <div className="mb-6 border-b border-border pb-4">
          <div className="eyebrow mb-1">برچسب</div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">#{data.tag.name}</h1>
          <p className="text-xs text-muted font-mono mt-1">{data.pagination?.total || statements.length} بیانیه ثبت‌شده</p>
        </div>

        {statements.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
            هنوز بیانیه‌ای با این برچسب وجود ندارد
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {statements.map((s: any) => (
              <StatementCard
                key={s.id}
                statement={{
                  id: s.id,
                  title: s.title,
                  username: s.username,
                  content: s.content,
                  createdAt: s.created_at,
                  voteCount: s.vote_count || 0,
                  counterCount: s.counter_count || 0,
                  activeDebateCount: 0,
                  tags: [],
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch {
    notFound();
  }
}