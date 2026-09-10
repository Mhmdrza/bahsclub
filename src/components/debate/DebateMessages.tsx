import { MessageBlock } from "./MessageBlock";

export function DebateMessages({
  messages,
  session,
  debaterIds,
  creatorId,
}: {
  messages: {
    id: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
    voteCount: number;
    userVoted: boolean;
    moderationState?: string;
  }[];
  session: { user: { id: number; role: string } } | null;
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
          const isSelf = session ? Number(session.user.id) === Number(msg.userId) : false;
          const isCreator = creatorId ? Number(msg.userId) === Number(creatorId) : false;

          return (
            <MessageBlock
              key={msg.id}
              username={msg.username}
              content={msg.content}
              moderationState={msg.moderationState || "normal"}
              createdAt={msg.createdAt}
              voteCount={msg.voteCount}
              userVoted={msg.userVoted}
              canVote={!!session && !debaterIds.map(Number).includes(Number(session.user.id))}
              voteableType="message"
              voteableId={msg.id}
              session={session}
              alignRight={isCreator}
              isSelf={isSelf}
              />
          );
        })
      )}
    </div>
  );
}