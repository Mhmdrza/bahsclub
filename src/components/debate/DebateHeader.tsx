import { VoteButton } from "./VoteButton";

export function DebateHeader({
  debate: d,
  creator,
  opponent,
  tags,
  statusLabel,
  statusColor,
  debateVoteCount,
  debateVoted,
  isCreator,
}: {
  debate: { id: number; title: string; status: string; currentTurn: number; maxTurns: number; initialStatement: string; createdAt: Date; closedReason: string | null };
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  tags: { id: number; name: string; slug: string }[];
  statusLabel: string;
  statusColor: string;
  debateVoteCount: number;
  debateVoted: boolean;
  isCreator: boolean | undefined;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs px-2 py-0.5 rounded-sm font-medium"
              style={{ background: statusColor + "20", color: statusColor }}
            >
              {statusLabel}
            </span>
            <span className="text-xs" style={{ color: "#5C5C63" }}>
              نوبت {d.currentTurn}/{d.maxTurns}
            </span>
          </div>

          <h1 className="text-xl font-bold mb-2" style={{ color: "#1A1A1D" }}>{d.title}</h1>

          <p className="text-sm mb-3" style={{ color: "#5C5C63" }}>
            {creator.username}
            {opponent ? ` در مقابل ${opponent.username}` : ""}
          </p>

          {/* Initial statement */}
          <div
            className="border-r-2 px-3 py-2 text-sm mb-3"
            style={{ borderColor: "#D93B3B", background: "#F5F5F7" }}
          >
            <p style={{ color: "#1A1A1D" }}>{d.initialStatement}</p>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <a
                  key={t.id}
                  href={`/debate/tags/${t.slug}`}
                  className="text-xs px-2 py-0.5 rounded-sm hover:opacity-80"
                  style={{ background: "#F5F5F7", color: "#5C5C63", border: "1px solid #E5E5EA" }}
                >
                  {t.name}
                </a>
              ))}
            </div>
          )}
        </div>

        <VoteButton
          voteableType="debate"
          voteableId={d.id}
          initialCount={debateVoteCount}
          initialVoted={debateVoted}
        />
      </div>
    </div>
  );
}