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
  return (
    <Link
      href={`/club/debates/${d.debate.id}`}
      className="group block border border-border bg-surface hover:border-accent/40 rounded-lg p-4 transition-all duration-150 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <StatusBadge status={d.debate.status} />
            <span className="text-xs text-muted font-mono">
              {d.messageCount} پیام
            </span>
            <span className="text-xs text-muted">•</span>
            <span
              className="text-xs text-muted hover:text-accent transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/club/users/${d.creator.username}`);
              }}
            >
              {d.creator.username}
            </span>
          </div>

          <h3 className="font-bold text-base text-foreground group-hover:text-accent transition-colors leading-snug truncate">
            {d.debate.title}
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[3rem] py-1 px-2 rounded border border-border/70 bg-background text-muted group-hover:border-accent/30 group-hover:text-accent transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span className="text-xs font-bold mt-0.5 font-mono">{d.voteCount}</span>
        </div>
      </div>
    </Link>
  );
}