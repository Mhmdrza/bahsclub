import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import { notFound } from "next/navigation";
import { DebateCard } from "@/components/debate/DebateCard";

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await getTokenForAction();

  try {
    const data = await apiFetch<{ tag: any; debates: any[] }>(`/api/tags/${slug}`, { token });
    if (!data.tag) notFound();

    const debates = data.debates || [];

    return (
      <div>
        <div className="mb-6 border-b border-border pb-4">
          <div className="eyebrow mb-1">برچسب</div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">#{data.tag.name}</h1>
          <p className="text-xs text-muted font-mono mt-1">{debates.length} بحث ثبت‌شده</p>
        </div>

        {debates.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
            هنوز بحثی با این برچسب وجود ندارد
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {debates.map((d: any) => (
              <DebateCard
                key={d.id}
                debate={{
                  debate: {
                    id: d.id,
                    title: d.title,
                    status: d.status,
                    currentTurn: d.current_turn ?? 0,
                    maxTurns: d.max_turns ?? 10,
                    createdAt: d.created_at,
                  },
                  creator: { username: d.creator_username },
                  voteCount: d.vote_count || 0,
                  turnCount: d.current_turn || 0,
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