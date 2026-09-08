import Link from "next/link";

export function StatementCard({
  statement: s,
}: {
  statement: {
    id: number;
    title: string;
    username: string;
    content: string;
    createdAt: string;
    voteCount: number;
    counterCount: number;
    activeDebateCount: number;
    tags?: { id: number; name: string; slug: string }[];
  };
}) {
  return (
    <Link
      href={`/club/statements/${s.id}`}
      className="group block border border-border bg-surface hover:border-accent/40 rounded-lg p-4 transition-all duration-150 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs text-muted">{s.username}</span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-muted font-mono">
              {s.counterCount} پاسخ
            </span>
            {s.activeDebateCount > 0 && (
              <>
                <span className="text-xs text-muted">•</span>
                <span className="text-xs text-accent font-medium">
                  {s.activeDebateCount} مناظره فعال
                </span>
              </>
            )}
          </div>

          <h3 className="font-bold text-base text-foreground group-hover:text-accent transition-colors leading-snug truncate">
            {s.title}
          </h3>

          <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
            {s.content.slice(0, 200)}
          </p>

          {s.tags && s.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {s.tags.map((t: any) => (
                <span key={t.id} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border border-border bg-background text-muted">
                  #{t.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center min-w-[3rem] py-1 px-2 rounded border border-border/70 bg-background text-muted group-hover:border-accent/30 group-hover:text-accent transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span className="text-xs font-bold mt-0.5 font-mono">{s.voteCount}</span>
        </div>
      </div>
    </Link>
  );
}