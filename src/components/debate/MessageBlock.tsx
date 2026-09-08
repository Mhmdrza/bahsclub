"use client";

import { toggleVote } from "@/lib/votes";
import { useCallback, useState } from "react";
import { FlagButton } from "./FlagButton";
import Link from "next/link";

export function MessageBlock({
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
  isSelf = false,
  isCreator = false,
}: {
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
  isSelf?: boolean;
  isCreator?: boolean;
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
      <div className={`flex w-full ${isSelf ? "justify-start" : "justify-end"} my-2`}>
        <div className="border border-border/40 bg-surface/30 rounded-2xl px-4 py-2 text-xs text-muted/70 italic max-w-sm">
          این پیام توسط داور حذف شده است
        </div>
      </div>
    );
  }

  if (initialModeration === "covered" && !revealed) {
    return (
      <div className={`flex w-full ${isSelf ? "justify-start" : "justify-end"} my-2`}>
        <div className="border border-gold/30 bg-gold/5 rounded-2xl p-3 max-w-md w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gold font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>پیام توسط داور پوشانده شده است</span>
            </div>
            <button
              onClick={() => setRevealed(true)}
              className="text-xs px-2.5 py-1 rounded border border-gold/30 text-gold hover:bg-gold/10 transition-colors shrink-0"
            >
              نمایش محتوا
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initialLetter = (username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className={`flex w-full gap-2.5 sm:gap-3 group my-1.5 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Link
        href={username ? `/club/users/${username}` : "#"}
        className="shrink-0 mt-1 focus:outline-hidden"
        title={username}
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold select-none shadow-2xs border transition-transform group-hover:scale-105 ${
            isSelf
              ? "bg-accent text-accent-fg border-accent/40"
              : isCreator
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
          }`}
        >
          {initialLetter}
        </div>
      </Link>

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${isSelf ? "items-end" : "items-start"}`}>
        {/* Username Header */}
        <div className={`flex items-center gap-2 mb-1 px-1 text-xs text-muted ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
          <Link
            href={username ? `/club/users/${username}` : "#"}
            className="font-semibold text-foreground/90 hover:text-accent transition-colors"
          >
            {username || "کاربر حذف شده"}
          </Link>
          <span className="text-[10px] opacity-75 font-mono">
            {new Intl.DateTimeFormat("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(createdAt))}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-2xs text-sm sm:text-[0.9375rem] leading-relaxed break-words ${
            isSelf
              ? "bg-accent/10 border border-accent/20 text-foreground rounded-tr-xs"
              : "bg-surface border border-border text-foreground rounded-tl-xs"
          }`}
        >
          {initialModeration === "covered" && revealed && (
            <div className="text-[11px] text-gold/80 mb-2 pb-1.5 border-b border-gold/20 font-medium">
              محتوای پوشانده‌شده توسط داور (فقط برای شما قابل مشاهده است)
            </div>
          )}

          <div className="whitespace-pre-wrap font-normal">{content}</div>

          {/* Footer inside bubble / actions */}
          <div
            className={`flex items-center gap-1.5 mt-2 pt-1.5 border-t ${
              isSelf ? "border-accent/15 justify-end" : "border-border/40 justify-start"
            }`}
          >
            {/* Vote button */}
            <button
              onClick={canVote ? handleVote : undefined}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                voted
                  ? "bg-accent text-accent-fg font-bold"
                  : "bg-background/80 hover:bg-background text-muted border border-border/60"
              } ${canVote ? "cursor-pointer" : "cursor-default opacity-80"}`}
              title={canVote ? "رأی به این استدلال" : undefined}
              disabled={!canVote}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill={voted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              <span>{voteCount}</span>
            </button>

            {/* Flag button */}
            <FlagButton
              flaggableType="message"
              flaggableId={voteableId}
              disabled={!session}
            />
          </div>
        </div>
      </div>
    </div>
  );
}