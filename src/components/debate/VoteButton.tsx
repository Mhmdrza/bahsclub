"use client";

import { useOptimistic, useCallback, startTransition } from "react";
import { toggleVote } from "@/lib/votes";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function VoteButton({
  voteableType,
  voteableId,
  initialCount,
  initialVoted,
  isAuthenticated = true,
}: {
  voteableType: string;
  voteableId: number;
  initialCount: number;
  initialVoted: boolean;
  isAuthenticated?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [{ count, voted }, updateOptimistic] = useOptimistic(
    { count: initialCount, voted: initialVoted },
    (state) => ({
      count: state.voted ? state.count - 1 : state.count + 1,
      voted: !state.voted,
    }),
  );

  const handleClick = useCallback(async () => {
    startTransition(() => {
      updateOptimistic(null);
    });
    try {
      await toggleVote(voteableType, voteableId);
      router.refresh();
    } catch {
      router.refresh();
    }
  }, [voteableType, voteableId, updateOptimistic, router]);

  // Not logged in: same pill, but clicking takes them to login and back.
  if (!isAuthenticated) {
    return (
      <Link
        href={`/club/login?next=${encodeURIComponent(pathname)}`}
        className="flex flex-col items-center justify-center min-w-[3.25rem] p-2 rounded-lg border border-dashed border-border bg-surface text-muted hover:border-accent/50 hover:text-accent transition-colors"
        title="برای تأیید وارد شوید"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
        <span className="text-xs font-bold font-mono mt-0.5">{count}</span>
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-w-[3.25rem] p-2 rounded-lg border border-border bg-surface shadow-xs">
      <button
        onClick={handleClick}
        className={`p-1.5 rounded transition-colors ${
          voted ? "text-accent bg-accent-light" : "text-muted hover:text-foreground hover:bg-background"
        }`}
        title="تأیید"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
      </button>
      <span className={`text-xs font-bold font-mono mt-0.5 ${voted ? "text-accent" : "text-muted"}`}>
        {count}
      </span>
    </div>
  );
}
