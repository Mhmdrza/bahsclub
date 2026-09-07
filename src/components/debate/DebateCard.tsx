import Link from "next/link";
import { TagBadge } from "./TagBadge";
import { StatusBadge } from "./StatusBadge";

export function DebateCard({
  debate: d,
  statusColor,
}: {
  debate: {
    debate: { id: number; title: string; status: string; currentTurn: number; maxTurns: number; createdAt: Date };
    creator: { username: string };
    voteCount: number;
    turnCount: number;
    tags?: { id: number; name: string; slug: string }[];
  };
  statusColor: string;
}) {
  const statusLabels: Record<string, string> = {
    open: "در انتظار چالشگر",
    challengers: "در حال بررسی",
    in_progress: "در جریان",
    closed: "پایان یافته",
  };

  return (
    <Link
      href={`/debate/debates/${d.debate.id}`}
      className="block border px-4 py-3 rounded-sm hover:opacity-80 transition-opacity"
      style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-1 truncate">{d.debate.title}</h3>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#5C5C63" }}>
            <span>{d.creator.username}</span>
            <StatusBadge label={statusLabels[d.debate.status] || d.debate.status} color={statusColor} />
            <span>نوبت {d.debate.currentTurn}/{d.debate.maxTurns}</span>
          </div>
          {d.tags && d.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {d.tags.map((t) => <TagBadge key={t.id} name={t.name} slug={t.slug} />)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm whitespace-nowrap" style={{ color: "#D93B3B" }}>
          <span>{d.voteCount}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}