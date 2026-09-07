import { VoteButton } from "./VoteButton";
import { TagBadge } from "./TagBadge";
import { StatusBadge } from "./StatusBadge";

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
}: {
  debate: { id: number; title: string; status: string; currentTurn: number; maxTurns: number; initialStatement: string; createdAt: Date; closedReason: string | null };
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  tags: { id: number; name: string; slug: string }[];
  statusLabel: string;
  statusColor: string;
  debateVoteCount: number;
  debateVoted: boolean;
  isCreator: boolean | undefined;
}) {
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
            <span className="font-semibold text-foreground">{creator.username}</span>
            {opponent ? (
              <>
                <span className="text-muted/60">در برابر</span>
                <span className="font-semibold text-foreground">{opponent.username}</span>
              </>
            ) : (
              <span className="text-muted/60">(در جستجوی هماورد)</span>
            )}
          </div>

          {/* Initial statement / Thesis */}
          <div className="border-r-2 border-accent bg-surface px-4 py-3 rounded-l-md text-sm my-4 text-foreground/90 leading-relaxed shadow-xs">
            <div className="text-xs font-semibold text-accent mb-1">طرح مسئله / موضع اولیه:</div>
            <p className="whitespace-pre-wrap">{d.initialStatement}</p>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((t) => (
                <TagBadge key={t.id} name={t.name} slug={t.slug} />
              ))}
            </div>
          )}
        </div>

        <VoteButton
          voteableType="debate"
          voteableId={d.id}
          initialCount={debateVoteCount}
          initialVoted={debateVoted}
        />
      </div>
    </div>
  );
}