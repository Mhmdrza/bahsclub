import { getDebateDetail, checkForfeit } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { DebateHeader } from "@/components/debate/DebateHeader";
import { DebateTurns } from "@/components/debate/DebateTurns";
import { ChallengeSection } from "@/components/debate/ChallengeSection";
import { TurnForm } from "@/components/debate/TurnForm";
import { ClosureRequest } from "@/components/debate/ClosureRequest";

async function acceptAction(fd: FormData) {
  "use server";
  const { acceptChallengerAction } = await import("@/lib/debate-actions");
  await acceptChallengerAction(null, fd);
}

export default async function DebatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const debateId = parseInt(id);
  if (isNaN(debateId)) notFound();

  // Lazy forfeit check
  await checkForfeit(debateId);
  const data = await getDebateDetail(debateId);
  if (!data) notFound();

  const d = data.debate;
  const session = data.session;

  // Determine if current user is a participant
  const isParticipant = !!session && (session.user.id === d.creatorId || session.user.id === d.opponentId);
  const isCreator = !!session && session.user.id === d.creatorId;
  const isOpponent = !!session && d.opponentId && session.user.id === d.opponentId;
  const canSpeak = !!session && d.status === "in_progress" && d.nextSpeaker === session.user.id;
  const isMyTurn = canSpeak;
  const hasRequestedClosure = !!session && d.closureRequestedBy === session.user.id;
  const otherRequestedClosure = d.closureRequestedBy && !hasRequestedClosure && isParticipant;

  const statusLabels: Record<string, string> = {
    open: "در انتظار چالشگر",
    challengers: "در حال بررسی چالشگران",
    in_progress: "در جریان",
    closed: "پایان یافته",
  };

  const statusColors: Record<string, string> = {
    open: "#C7883D",
    challengers: "#C7883D",
    in_progress: "#2D8B6E",
    closed: "#7B7B82",
  };

  return (
    <div>
      <DebateHeader
        debate={d}
        creator={data.creator || { id: 0, username: "?" }}
        opponent={data.opponent}
        tags={data.tags}
        statusLabel={statusLabels[d.status]}
        statusColor={statusColors[d.status]}
        debateVoteCount={data.debateVoteCount}
        debateVoted={data.debateVoted}
        isCreator={isCreator}
      />

      {/* Turn list */}
      <DebateTurns turns={data.turns} session={session} debateId={d.id} debaterIds={[d.creatorId, d.opponentId]} />

      {/* Turn form */}
      {canSpeak && (
        <TurnForm debateId={d.id} turnNumber={d.currentTurn + 1} />
      )}

      {/* Inactive status */}
      {d.status === "in_progress" && session && !canSpeak && isParticipant && (
        <div className="text-center py-4 text-xs font-mono text-muted border border-dashed border-border rounded-lg mt-4 bg-surface/50">
          در انتظار پاسخ طرف مقابل...
        </div>
      )}

      {/* Closure */}
      {d.status === "in_progress" && isParticipant && (
        <ClosureRequest
          debateId={d.id}
          hasRequested={!!hasRequestedClosure}
          otherRequested={!!otherRequestedClosure}
        />
      )}

      {/* Closed banner */}
      {d.status === "closed" && d.closedReason && (
        <div className="border border-border bg-surface px-4 py-3 text-xs text-muted rounded-lg mt-6 text-center">
          {d.closedReason === "mutual" && "این بحث با توافق طرفین پایان یافت."}
          {d.closedReason === "forfeit" && "این بحث به دلیل عدم فعالیت در مهلت مقرر پایان یافت."}
          {d.closedReason === "max_turns" && "این بحث به سقف حداکثر نوبت‌ها رسید و به پایان رسید."}
        </div>
      )}

      {/* Challenge section */}
      {session && (d.status === "open" || d.status === "challengers") && !isCreator && !d.opponentId && (
        <ChallengeSection debateId={d.id} />
      )}

      {/* Creator's pending challengers */}
      {isCreator && d.status === "challengers" && data.pendingChallengers.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <div className="eyebrow mb-1.5">داوطلبان</div>
          <h2 className="text-lg font-bold text-foreground mb-4">درخواست‌های هماوردی</h2>
          <div className="flex flex-col gap-3">
            {data.pendingChallengers.map((c: any) => (
              <div
                key={c.id}
                className="border border-border bg-surface p-4 rounded-lg shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">{c.user.username}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-4 bg-background p-3 rounded border border-border/60">
                  {c.positionStatement}
                </p>
                <form action={acceptAction}>
                  <input type="hidden" name="debateId" value={d.id} />
                  <input type="hidden" name="challengerUserId" value={c.userId} />
                  <input type="hidden" name="firstSpeakerId" value={d.creatorId} />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs rounded bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
                  >
                    پذیرش مناظره با {c.user.username}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No session — prompt login */}
      {!session && (d.status === "open" || d.status === "challengers") && (
        <div className="text-center py-6 text-xs text-muted mt-6 border border-dashed border-border rounded-lg bg-surface/50">
          برای شرکت در این بحث یا ارسال چالش،{" "}
          <a href="/club/login" className="text-accent underline font-medium">
            وارد حساب خود شوید
          </a>
          .
        </div>
      )}
    </div>
  );
}