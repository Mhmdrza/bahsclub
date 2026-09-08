import { VoteButton } from "./VoteButton";
import { FlagButton } from "./FlagButton";
import Link from "next/link";

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
  const initial = (counter.username || "?").trim().charAt(0).toUpperCase();

  if (counter.moderationState === "removed") {
    return (
      <div className="border border-border/50 bg-surface/30 rounded-xl p-4 text-xs text-muted text-center italic">
        این پاسخ توسط داور حذف شده است
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl p-5 shadow-xs transition-all ${
      isAccepted ? "border-accent/40 bg-accent/5" : "border-border bg-surface"
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/club/users/${counter.username}`}
            className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent font-mono"
          >
            {initial}
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/club/users/${counter.username}`}
              className="font-bold text-sm text-foreground hover:text-accent transition-colors"
            >
              @{counter.username}
            </Link>
            {isAccepted && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-accent/15 text-accent font-medium border border-accent/20">
                پذیرفته‌شده برای مناظره
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VoteButton
            voteableType="counter_statement"
            voteableId={counter.id}
            initialCount={counter.voteCount}
            initialVoted={counter.userVoted}
          />
          <FlagButton
            flaggableType="counter_statement"
            flaggableId={counter.id}
            disabled={false}
          />
        </div>
      </div>

      <p className="text-sm text-foreground/90 leading-relaxed mb-4 bg-background/80 p-4 rounded-xl border border-border/60 font-normal whitespace-pre-wrap">
        {counter.content}
      </p>

      {isAuthor && !isAccepted && (
        <form action={acceptAction} className="flex justify-end">
          <input type="hidden" name="statementId" value={statementId} />
          <input type="hidden" name="counterId" value={counter.id} />
          <button
            type="submit"
            className="text-xs px-4 py-2 rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            پذیرش پاسخ و شروع مناظره رسمی
          </button>
        </form>
      )}
    </div>
  );
}