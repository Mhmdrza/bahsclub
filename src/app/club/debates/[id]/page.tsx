import { getDebateDetail } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DebateHeader } from "@/components/debate/DebateHeader";
import { DebateMessages } from "@/components/debate/DebateMessages";
import { MessageForm } from "@/components/debate/MessageForm";
import { ClosureRequest } from "@/components/debate/ClosureRequest";
import { LivePoll } from "@/components/debate/LivePoll";

export default async function DebatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const debateId = parseInt(id);
  if (isNaN(debateId)) notFound();

  const data = await getDebateDetail(debateId);
  if (!data) notFound();

  const d = data.debate;
  const session = data.session;

  const isParticipant = !!session && (session.user.id === d.creatorId || session.user.id === d.opponentId);
  const isCreator = !!session && session.user.id === d.creatorId;
  const hasRequestedClosure = !!session && d.closureRequestedBy === session.user.id;
  const otherRequestedClosure = d.closureRequestedBy && !hasRequestedClosure && isParticipant;

  const statusLabels: Record<string, string> = {
    in_progress: "در جریان",
    closed: "پایان یافته",
  };

  const statusColors: Record<string, string> = {
    in_progress: "#2D8B6E",
    closed: "#7B7B82",
  };

  return (
    <div>
      <LivePoll debateId={d.id} messageCount={data.messages.length} active={d.status === "in_progress"} />
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
        session={session as any}
      />

      <DebateMessages
        messages={data.messages}
        session={session as any}
        debateId={d.id}
        debaterIds={[d.creatorId, d.opponentId]}
        creatorId={d.creatorId}
      />

      {session && d.status === "in_progress" && isParticipant && (
        <MessageForm debateId={d.id} />
      )}

      {d.status === "in_progress" && session && !isParticipant && (
        <div className="text-center py-4 text-xs font-mono text-muted border border-dashed border-border rounded-lg mt-4 bg-surface/50">
          این مناظره در حال انجام است. فقط شرکت‌کنندگان می‌توانند پیام ارسال کنند.
        </div>
      )}

      {d.status === "in_progress" && isParticipant && (
        <ClosureRequest
          debateId={d.id}
          hasRequested={!!hasRequestedClosure}
          otherRequested={!!otherRequestedClosure}
        />
      )}

      {d.status === "closed" && d.closedReason && (
        <div className="border border-border bg-surface px-4 py-3 text-xs text-muted rounded-lg mt-6 text-center">
          {d.closedReason === "mutual" && "این بحث با توافق طرفین پایان یافت."}
          {d.closedReason === "forfeit" && "این بحث به دلیل عدم فعالیت در مهلت مقرر پایان یافت."}
        </div>
      )}

      {!session && (
        <div className="text-center py-6 text-xs text-muted mt-6 border border-dashed border-border rounded-lg bg-surface/50">
          برای شرکت در این بحث،{" "}
          <Link href="/club/login" className="text-accent underline font-medium">
            وارد حساب خود شوید
          </Link>
          .
        </div>
      )}
    </div>
  );
}