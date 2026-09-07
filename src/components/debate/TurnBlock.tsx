"use client";

import { toggleVote } from "@/lib/votes";
import { useCallback } from "react";

export function TurnBlock({
  turnNumber,
  username,
  content,
  createdAt,
  voteCount,
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
  const handleVote = useCallback(async () => {
    if (canVote) {
      try {
        await toggleVote(voteableType, voteableId);
      } catch {}
    }
  }, [canVote, voteableType, voteableId]);

  return (
    <div
      className="border-b py-4"
      style={{ borderColor: "#E5E5EA" }}
    >
      <div className="flex gap-4">
        {/* Turn number marker */}
        <div
          className="text-xs font-bold pt-0.5 shrink-0"
          style={{ color: "#5C5C63", minWidth: "2rem" }}
        >
          #{turnNumber}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 text-sm mb-2">
            <span className="font-semibold" style={{ color: "#1A1A1D" }}>{username}</span>
            <span className="text-xs" style={{ color: "#5C5C63" }}>
              {new Intl.DateTimeFormat("fa-IR", {
                hour: "2-digit", minute: "2-digit",
              }).format(new Date(createdAt))}
            </span>
          </div>

          {/* Content */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#1A1A1D", fontSize: "1rem" }}>
            {content}
          </div>
        </div>

        {/* Vote */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1">
          <button
            onClick={canVote ? handleVote : undefined}
            className="p-1 rounded-sm transition-colors disabled:opacity-50"
            style={{
              color: initialVoted ? "#D93B3B" : "#5C5C63",
              cursor: canVote ? "pointer" : "default",
            }}
            title={canVote ? "رأی" : undefined}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={initialVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </button>
          <span className="text-xs" style={{ color: voteCount > 0 ? "#D93B3B" : "#5C5C63" }}>
            {voteCount}
          </span>
        </div>
      </div>
    </div>
  );
}