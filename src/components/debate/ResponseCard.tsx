import { VoteButton } from "./VoteButton";
import { FlagButton } from "./FlagButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ResponseCard({
  response,
  isAuthor,
  challengeId,
  debateAction,
}: {
  response: { id: number; userId: number; content: string; status: string; username: string; voteCount: number; userVoted: boolean; moderationState?: string; createdAt: string; debateId?: number | null; debateStatus?: string | null };
  isAuthor: boolean;
  challengeId: number;
  debateAction: (fd: FormData) => Promise<void>;
}) {
  const isDebating = response.status === "debating";
  const initial = (response.username || "?").trim().charAt(0).toUpperCase();

  if (response.moderationState === "removed") {
    return (
      <div className="border border-border/50 bg-surface/30 rounded-xl p-4 text-xs text-muted text-center italic">
        این نقد توسط داور حذف شده است
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl p-5 shadow-xs transition-all ${
      isDebating ? "border-accent/40 bg-accent/5" : "border-border bg-surface"
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/club/users/${response.username}`}
            className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent font-mono"
          >
            {initial}
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/club/users/${response.username}`}
              className="font-bold text-sm text-foreground hover:text-accent transition-colors"
            >
              @{response.username}
            </Link>
            {isDebating && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-accent/15 text-accent font-medium border border-accent/20">
                نویسنده در حال مباحثه با این هم‌آوردی
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VoteButton
            voteableType="challenge_response"
            voteableId={response.id}
            initialCount={response.voteCount}
            initialVoted={response.userVoted}
          />
          <FlagButton
            flaggableType="challenge_response"
            flaggableId={response.id}
            disabled={false}
          />
        </div>
      </div>

      <p className="text-sm text-foreground/90 leading-relaxed mb-4 bg-background/80 p-4 rounded-xl border border-border/60 font-normal whitespace-pre-wrap">
        {response.content}
      </p>

      {isDebating && response.debateId && (
        <div className="flex justify-end mb-3">
          <Link
            href={`/club/debates/${response.debateId}`}
            className="text-xs px-4 py-2 rounded-xl bg-accent/10 text-accent font-semibold border border-accent/20 hover:bg-accent/20 transition-colors inline-flex items-center gap-1.5"
          >
            مشاهده مباحثه در جریان
            <ArrowLeft size={13} />
          </Link>
        </div>
      )}

      {isAuthor && !isDebating && (
        <form action={debateAction} className="flex justify-end">
          <input type="hidden" name="challengeId" value={challengeId} />
          <input type="hidden" name="responseId" value={response.id} />
          <button
            type="submit"
            className="text-xs px-4 py-2 rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            شروع مباحثه با این هم‌آوردی
          </button>
        </form>
      )}
    </div>
  );
}