"use client";

import { toggleVote } from "@/lib/votes";
import { useCallback, useState } from "react";

export function TurnBlock({
  turnNumber,
  username,
  content,
  createdAt,
  voteCount: initialVoteCount,
  userVoted: initialVoted,
  canVote,
  voteableType,
  voteableId,
}: {
  turnNumber: number;
  username: string;
  content: string;
  createdAt: Date;
  voteCount: number;
  userVoted: boolean;
  canVote: boolean;
  voteableType: string;
  voteableId: number;
}) {
  const [voted, setVoted] = useState(initialVoted);
  const [voteCount, setVoteCount] = useState(initialVoteCount);

  const handleVote = useCallback(async () => {
    if (!canVote) return;
    setVoted((prev) => !prev);
    setVoteCount((prev) => (voted ? prev - 1 : prev + 1));
    try {
      await toggleVote(voteableType, voteableId);
    } catch {
      // rollback on failure
      setVoted(initialVoted);
      setVoteCount(initialVoteCount);
    }
  }, [canVote, voted, initialVoted, initialVoteCount, voteableType, voteableId]);

  return (
    <article className="border border-border bg-surface rounded-lg p-4 sm:p-5 mb-4 shadow-xs">
      <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-mono font-bold">
            {turnNumber}
          </span>
          <span className="font-bold text-sm text-foreground">{username}</span>
          <span className="text-xs text-muted font-mono">
            {new Intl.DateTimeFormat("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(createdAt))}
          </span>
        </div>

        {/* Minimal vote button */}
        <button
          onClick={canVote ? handleVote : undefined}
          className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-mono transition-colors ${
            voted
              ? "border-accent bg-accent-light text-accent font-bold"
              : "border-border bg-background text-muted hover:border-muted"
          } ${canVote ? "cursor-pointer" : "cursor-default opacity-80"}`}
          title={canVote ? "رأی به این استدلال" : undefined}
          disabled={!canVote}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={voted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          <span>{voteCount}</span>
        </button>
      </div>

      <div className="text-sm sm:text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-foreground/90 font-normal">
        {content}
      </div>
    </article>
  );
}