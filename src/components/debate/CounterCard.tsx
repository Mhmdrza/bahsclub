import { VoteButton } from "./VoteButton";
import { FlagButton } from "./FlagButton";

export function CounterCard({
  counter,
  isAuthor,
  statementId,
  acceptAction,
}: {
  counter: { id: number; userId: number; content: string; status: string; username: string; voteCount: number; userVoted: boolean; moderationState?: string; createdAt: string };
  isAuthor: boolean;
  statementId: number;
  acceptAction: (fd: FormData) => Promise<void>;
}) {
  const isAccepted = counter.status === "accepted";

  if (counter.moderationState === "removed") {
    return (
      <div className="border border-border/50 bg-surface/30 rounded-lg p-4 text-xs text-muted text-center">
        این پاسخ توسط داور حذف شده است
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 shadow-xs ${isAccepted ? "border-accent/30 bg-accent/5" : "border-border bg-surface"}`}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground">{counter.username}</span>
          {isAccepted && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">پذیرفته‌شده</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <FlagButton
            flaggableType="counter_statement"
            flaggableId={counter.id}
            disabled={false}
          />
          <VoteButton
            voteableType="counter_statement"
            voteableId={counter.id}
            initialCount={counter.voteCount}
            initialVoted={counter.userVoted}
          />
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed mb-3 bg-background p-3 rounded border border-border/60">
        {counter.content}
      </p>

      {isAuthor && !isAccepted && (
        <form action={acceptAction}>
          <input type="hidden" name="statementId" value={statementId} />
          <input type="hidden" name="counterId" value={counter.id} />
          <button
            type="submit"
            className="text-xs px-3 py-1.5 rounded bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
          >
            شروع مناظره
          </button>
        </form>
      )}
    </div>
  );
}