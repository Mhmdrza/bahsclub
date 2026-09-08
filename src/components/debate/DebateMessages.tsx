import { MessageBlock } from "./MessageBlock";

export function DebateMessages({
  messages,
  session,
  debateId,
  debaterIds,
  creatorId,
}: {
  messages: (any & { userVoted: boolean; voteCount: number; moderationState?: string })[];
  session: { user: { id: number; role: string } } | null;
  debateId: number;
  debaterIds: (number | null)[];
  creatorId?: number;
}) {
  return (
    <div className="flex flex-col gap-3 my-6 py-2">
      {messages.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl text-sm text-muted bg-surface/30">
          هنوز پیامی ثبت نشده است. اولین پیام را ارسال کنید.
        </div>
      ) : (
        messages.map((msg) => {
          const isSelf = session ? session.user.id === msg.userId : false;
          const isCreator = creatorId ? msg.userId === creatorId : false;

          return (
            <MessageBlock
              key={msg.id}
              username={msg.username}
              content={msg.content}
              moderationState={msg.moderationState || "normal"}
              createdAt={msg.createdAt}
              voteCount={msg.voteCount}
              userVoted={msg.userVoted}
              canVote={!!session && !debaterIds.includes(session.user.id)}
              voteableType="message"
              voteableId={msg.id}
              session={session}
              isSelf={isSelf}
              isCreator={isCreator}
            />
          );
        })
      )}
    </div>
  );
}