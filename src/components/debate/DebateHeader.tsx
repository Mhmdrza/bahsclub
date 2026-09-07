import { VoteButton } from "./VoteButton";
import { TagBadge } from "./TagBadge";
import { StatusBadge } from "./StatusBadge";
import { FlagButton } from "./FlagButton";
import Link from "next/link";

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
  debate: { id: number; title: string; status: string; currentTurn: number; maxTurns: number; initialStatement: string; moderationState?: string; createdAt: Date; closedReason: string | null };
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

  return (
    <div className="mb-8 border-b border-border pb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <StatusBadge status={d.status} label={statusLabel} />
            <span className="text-xs text-muted font-mono">
              نوبت {d.currentTurn}/{d.maxTurns}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            {d.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-muted mb-4">
            <Link href={`/club/users/${creator.username}`} className="font-semibold text-foreground hover:text-accent transition-colors">{creator.username}</Link>
            {opponent ? (
              <>
                <span className="text-muted/60">در برابر</span>
                <Link href={`/club/users/${opponent.username}`} className="font-semibold text-foreground hover:text-accent transition-colors">{opponent.username}</Link>
              </>
            ) : (
              <span className="text-muted/60">(در جستجوی هماورد)</span>
            )}
          </div>

          {covered ? (
            <div className="border border-gold/30 bg-gold/5 px-4 py-3 rounded-lg my-4 text-xs text-gold font-medium">
              بیانیه اولیه توسط داور پوشانده شده است
            </div>
          ) : (
            <div className="border-r-2 border-accent bg-surface px-4 py-3 rounded-l-md text-sm my-4 text-foreground/90 leading-relaxed shadow-xs">
              <div className="text-xs font-semibold text-accent mb-1">طرح مسئله / موضع اولیه:</div>
              <p className="whitespace-pre-wrap">{d.initialStatement}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((t) => (
                <TagBadge key={t.id} name={t.name} slug={t.slug} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
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
  );
}