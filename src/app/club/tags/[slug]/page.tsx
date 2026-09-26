import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import { notFound } from "next/navigation";
import { ChallengeCard } from "@/components/debate/ChallengeCard";

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await getTokenForAction();

  let data: { tag: { id: number; name: string; slug: string }; items: unknown[]; pagination: { total: number } } | undefined;
  try {
    data = await apiFetch<{ tag: { id: number; name: string; slug: string }; items: unknown[]; pagination: { total: number } }>(`/api/tags/${slug}`, { token });
  } catch {
    notFound();
  }
  if (!data || !data.tag) notFound();

  const challenges = data.items || [];

  return (
    <div>
      <div className="mb-6 border-b border-border pb-4">
        <div className="eyebrow mb-1">برچسب</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">#{data.tag.name}</h1>
        <p className="text-xs text-muted font-mono mt-1">{data.pagination?.total || challenges.length} چالش ثبت‌شده</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
          هنوز چالشی با این برچسب وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {challenges.map((s: unknown) => {
            const stmt = s as { id: number; title: string; username: string; content: string; created_at: string; vote_count: number; response_count: number };
            return (
              <ChallengeCard
                key={stmt.id}
                challenge={{
                  id: stmt.id,
                  title: stmt.title,
                  username: stmt.username,
                  content: stmt.content,
                  createdAt: stmt.created_at,
                  voteCount: stmt.vote_count || 0,
                  responseCount: stmt.response_count || 0,
                  activeDebateCount: 0,
                  tags: [],
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}