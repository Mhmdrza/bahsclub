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
    <div className="flex flex-col mt-4">
      {turns.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-lg text-sm text-muted">
          هنوز نوبتی ثبت نشده است. بحث با اولین نوبت آغاز خواهد شد.
        </div>
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