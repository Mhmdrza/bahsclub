import Link from "next/link";
import { MessageSquareQuote, Flame } from "lucide-react";

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
  const initial = (s.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="group border border-border bg-surface hover:border-accent/40 rounded-2xl p-5 transition-all duration-150 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Author Header */}
          <div className="flex items-center gap-2 mb-2.5">
            <Link
              href={`/club/users/${s.username}`}
              className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors group/user"
            >
              <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent font-mono">
                {initial}
              </div>
              <span className="font-semibold text-foreground group-hover/user:text-accent transition-colors">
                @{s.username}
              </span>
            </Link>
          </div>

          <Link href={`/club/statements/${s.id}`} className="block group/link">
            <h3 className="font-bold text-base text-foreground group-hover/link:text-accent transition-colors leading-snug mb-1.5">
              {s.title}
            </h3>

            <p className="text-xs text-muted/90 line-clamp-3 leading-relaxed mb-3">
              {s.content}
            </p>
          </Link>

          {/* Tags */}
          {s.tags && s.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {s.tags.map((t: any) => (
                <Link
                  key={t.id}
                  href={`/club/tags/${t.slug}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-md border border-border bg-background text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Counters & Meta */}
          <div className="flex items-center gap-4 text-xs text-muted font-mono pt-2 border-t border-border/40">
            <Link
              href={`/club/statements/${s.id}`}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <MessageSquareQuote size={14} className="text-muted/80" />
              <span>{s.counterCount} پاسخ</span>
            </Link>

            {s.activeDebateCount > 0 && (
              <Link
                href={`/club/statements/${s.id}`}
                className="inline-flex items-center gap-1 text-accent font-medium hover:underline"
              >
                <Flame size={14} />
                <span>{s.activeDebateCount} مباحثه در جریان</span>
              </Link>
            )}
          </div>
        </div>

        {/* Vote Score Pill */}
        <Link
          href={`/club/statements/${s.id}`}
          className="flex flex-col items-center justify-center min-w-[3.25rem] py-2 px-2.5 rounded-xl border border-border bg-background text-muted group-hover:border-accent/40 group-hover:text-accent transition-colors shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span className="text-xs font-bold mt-1 font-mono">{s.voteCount}</span>
        </Link>
      </div>
    </div>
  );
}