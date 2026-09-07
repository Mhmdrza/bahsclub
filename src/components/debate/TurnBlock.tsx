"use client";

import { toggleVote } from "@/lib/votes";
import { useCallback, useState } from "react";
import { FlagButton } from "./FlagButton";

export function TurnBlock({
  turnNumber,
  username,
  content,
  moderationState: initialModeration,
  createdAt,
  voteCount: initialVoteCount,
  userVoted: initialVoted,
  canVote,
  voteableType,
  voteableId,
  session,
}: {
  turnNumber: number;
  username: string;
  content: string;
  moderationState?: string;
  createdAt: Date;
  voteCount: number;
  userVoted: boolean;
  canVote: boolean;
  voteableType: string;
  voteableId: number;
  session: { user: { id: number; role: string } } | null;
}) {
  const [voted, setVoted] = useState(initialVoted);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [revealed, setRevealed] = useState(false);

  const handleVote = useCallback(async () => {
    if (!canVote) return;
    setVoted((prev) => !prev);
    setVoteCount((prev) => (voted ? prev - 1 : prev + 1));
    try {
      await toggleVote(voteableType, voteableId);
    } catch {
      setVoted(initialVoted);
      setVoteCount(initialVoteCount);
    }
  }, [canVote, voted, initialVoted, initialVoteCount, voteableType, voteableId]);

  if (initialModeration === "removed") {
    return (
      <article className="border border-border/50 bg-surface/30 rounded-lg p-4 mb-4 text-xs text-muted text-center">
        این پیام توسط داور حذف شده است
      </article>
    );
  }

  if (initialModeration === "covered" && !revealed) {
    return (
      <article className="border border-gold/30 bg-gold/5 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gold font-medium flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            این پیام توسط داور پوشانده شده است
          </div>
          <button
            onClick={() => setRevealed(true)}
            className="text-xs px-2 py-0.5 rounded border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            نمایش محتوا
          </button>
        </div>
      </article>
    );
  }

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

        <div className="flex items-center gap-1">
          <FlagButton
            flaggableType="turn"
            flaggableId={voteableId}
            disabled={!session}
          />
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
      </div>

      {initialModeration === "covered" && revealed && (
        <div className="text-xs text-gold/70 mb-2 border border-gold/20 bg-gold/5 px-2 py-1 rounded">
          محتوای پوشانده‌شده توسط داور (فقط برای شما قابل مشاهده است)
        </div>
      )}

      <div className="text-sm sm:text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-foreground/90 font-normal">
        {content}
      </div>
    </article>
  );
}