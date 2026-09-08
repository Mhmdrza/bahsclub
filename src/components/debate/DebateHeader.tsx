import { VoteButton } from "./VoteButton";
import { TagBadge } from "./TagBadge";
import { StatusBadge } from "./StatusBadge";
import { FlagButton } from "./FlagButton";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export function DebateHeader({
  debate: d,
  creator,
  opponent,
  tags,
  statusLabel,
  statusColor,
  debateVoteCount,
  debateVoted,
  isCreator,
  session,
}: {
  debate: { id: number; title: string; status: string; moderationState?: string; createdAt: Date; closedReason: string | null };
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  tags: { id: number; name: string; slug: string }[];
  statusLabel: string;
  statusColor: string;
  debateVoteCount: number;
  debateVoted: boolean;
  isCreator: boolean;
  session: { user: { id: number; role: string } } | null;
}) {
  const covered = d.moderationState === "covered";
  const creatorInitial = (creator.username || "?").trim().charAt(0).toUpperCase();
  const opponentInitial = (opponent?.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/club/debates" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>همه مباحثه‌ها</span>
        </Link>
      </div>

      <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <StatusBadge status={d.status} label={statusLabel} />
              {d.status === "in_progress" && (
                <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                  <Flame size={13} />
                  <span>مباحثه رسمی زنده</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-foreground leading-snug">
              {d.title}
            </h1>

            {/* Debaters Cards / Matchup */}
            <div className="flex items-center gap-3 p-3 bg-background/80 rounded-xl border border-border/80 w-fit mb-4">
              <Link
                href={`/club/users/${creator.username}`}
                className="flex items-center gap-2 text-xs hover:text-accent transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-accent/15 text-accent border border-accent/20 flex items-center justify-center font-bold text-xs font-mono">
                  {creatorInitial}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">@{creator.username}</span>
                  <span className="text-[10px] text-muted">طراح موضوع</span>
                </div>
              </Link>

              <span className="text-xs font-bold text-muted/60 px-1">با</span>

              {opponent ? (
                <Link
                  href={`/club/users/${opponent.username}`}
                  className="flex items-center gap-2 text-xs hover:text-accent transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs font-mono">
                    {opponentInitial}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">@{opponent.username}</span>
                    <span className="text-[10px] text-muted">هماورد</span>
                  </div>
                </Link>
              ) : (
                <span className="text-xs text-muted italic px-2">در انتظار هماورد</span>
              )}
            </div>

            {covered && (
              <div className="border border-gold/30 bg-gold/5 px-4 py-3 rounded-xl my-4 text-xs text-gold font-medium">
                این مباحثه توسط داور پوشانده شده است
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <TagBadge key={t.id} name={t.name} slug={t.slug} />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <VoteButton
              voteableType="debate"
              voteableId={d.id}
              initialCount={debateVoteCount}
              initialVoted={debateVoted}
            />
            <FlagButton
              flaggableType="debate"
              flaggableId={d.id}
              disabled={!session || isCreator}
            />
          </div>
        </div>
      </div>
    </div>
  );
}