import { TurnBlock } from "./TurnBlock";

export function DebateTurns({
  turns,
  session,
  debateId,
  debaterIds,
}: {
  turns: (any & { userVoted: boolean; voteCount: number })[];
  session: { user: { id: number } } | null;
  debateId: number;
  debaterIds: (number | null)[];
}) {
  return (
    <div className="flex flex-col mt-6" style={{ borderTop: "1px solid #E5E5EA" }}>
      {turns.length === 0 ? (
        <p className="text-sm py-4" style={{ color: "#5C5C63" }}>هنوز نوبتی ثبت نشده است</p>
      ) : (
        turns.map((turn) => (
          <TurnBlock
            key={turn.id}
            turnNumber={turn.turnNumber}
            username={turn.user.username}
            content={turn.content}
            createdAt={turn.createdAt}
            voteCount={turn.voteCount}
            userVoted={turn.userVoted}
            canVote={!!session && !debaterIds.includes(session.user.id)}
            voteableType="turn"
            voteableId={turn.id}
          />
        ))
      )}
    </div>
  );
}