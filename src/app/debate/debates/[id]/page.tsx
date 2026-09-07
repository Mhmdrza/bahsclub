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
        <div className="text-center py-4 text-sm" style={{ color: "#5C5C63" }}>
          منتظر نوبت حریف
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
        <div
          className="border px-4 py-3 text-sm rounded-sm mt-4"
          style={{ borderColor: "#E5E5EA", background: "#F5F5F7", color: "#5C5C63" }}
        >
          {d.closedReason === "mutual" && "این بحث با توافق طرفین پایان یافت"}
          {d.closedReason === "forfeit" && "این بحث به دلیل عدم فعالیت پایان یافت"}
          {d.closedReason === "max_turns" && "این بحث به حداکثر نوبت‌ها رسید"}
        </div>
      )}

      {/* Challenge section */}
      {session && (d.status === "open" || d.status === "challengers") && !isCreator && !d.opponentId && (
        <ChallengeSection debateId={d.id} />
      )}

      {/* Creator's pending challengers */}
      {isCreator && d.status === "challengers" && data.pendingChallengers.length > 0 && (
        <div className="mt-6 border-t" style={{ borderColor: "#E5E5EA" }}>
          <h2 className="text-lg font-bold mt-4 mb-3" style={{ color: "#1A1A1D" }}>چالشگران</h2>
          {data.pendingChallengers.map((c: any) => (
            <div
              key={c.id}
              className="border px-4 py-3 mb-3 rounded-sm"
              style={{ borderColor: "#E5E5EA", background: "#FFFFFF" }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: "#1A1A1D" }}>{c.user.username}</p>
              <p className="text-sm mb-3" style={{ color: "#5C5C63" }}>{c.positionStatement}</p>
              <form action={acceptAction}>
                <input type="hidden" name="debateId" value={d.id} />
                <input type="hidden" name="challengerUserId" value={c.userId} />
                <input type="hidden" name="firstSpeakerId" value={d.creatorId} />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs rounded-sm"
                  style={{ background: "#2D8B6E", color: "#FFFFFF" }}
                >
                  قبول {c.username}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* No session — prompt login */}
      {!session && (d.status === "open" || d.status === "challengers") && (
        <div className="text-center py-4 text-sm mt-4" style={{ color: "#5C5C63" }}>
          <a href="/debate/login" style={{ color: "#D93B3B" }}>وارد شوید</a> تا بتوانید چالش کنید
        </div>
      )}
    </div>
  );
}