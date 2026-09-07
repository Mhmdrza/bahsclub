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
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#1A1A1D" }}>{data.tag.name}</h1>
          <p className="text-sm" style={{ color: "#5C5C63" }}>{debates.length} بحث</p>
        </div>

        {debates.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#5C5C63" }}>
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
                statusColor={
                  d.status === "in_progress" ? "#2D8B6E" :
                  ["open", "challengers"].includes(d.status) ? "#C7883D" : "#7B7B82"
                }
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