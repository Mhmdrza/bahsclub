"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "./StatusBadge";

export function DebateCard({
  debate: d,
}: {
  debate: {
    debate: { id: number; title: string; status: string; createdAt: Date };
    creator: { id?: number; username: string };
    voteCount: number;
    messageCount: number;
    tags?: { id: number; name: string; slug: string }[];
  };
  statusColor?: string;
}) {
  const router = useRouter();
  const initial = (d.creator.username || "?").trim().charAt(0).toUpperCase();

  return (
    <Link
      href={`/club/debates/${d.debate.id}`}
      className="group block border border-border bg-surface hover:border-accent/40 rounded-2xl p-4 sm:p-5 transition-all duration-150 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <StatusBadge status={d.debate.status} />
            <div
              className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors cursor-pointer group/author"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/club/users/${d.creator.username}`);
              }}
            >
              <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent font-mono">
                {initial}
              </div>
              <span className="group-hover/author:underline font-medium">@{d.creator.username}</span>
            </div>
            <span className="text-xs text-muted font-mono">
              • {d.messageCount} پیام
            </span>
          </div>

          <h3 className="font-bold text-base text-foreground group-hover:text-accent transition-colors leading-snug truncate">
            {d.debate.title}
          </h3>

          {d.tags && d.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {d.tags.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-0.5 text-[11px] rounded-md border border-border bg-background text-muted"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center min-w-[3.25rem] py-2 px-2.5 rounded-xl border border-border bg-background text-muted group-hover:border-accent/40 group-hover:text-accent transition-colors shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span className="text-xs font-bold mt-1 font-mono">{d.voteCount}</span>
        </div>
      </div>
    </Link>
  );
}