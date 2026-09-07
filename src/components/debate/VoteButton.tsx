"use client";

import { useOptimistic, useCallback, startTransition } from "react";
import { toggleVote } from "@/lib/votes";
import { useRouter } from "next/navigation";

export function VoteButton({
  voteableType,
  voteableId,
  initialCount,
  initialVoted,
}: {
  voteableType: string;
  voteableId: number;
  initialCount: number;
  initialVoted: boolean;
}) {
  const router = useRouter();

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
      const result = await toggleVote(voteableType, voteableId);
      router.refresh();
    } catch {
      // If not logged in, navigation will happen on its own
    }
  }, [voteableType, voteableId, updateOptimistic, router]);

  return (
    <div className="flex flex-col items-center gap-0.5 shrink-0">
      <button
        onClick={handleClick}
        className="p-1 rounded-sm transition-colors"
        style={{
          color: voted ? "#D93B3B" : "#5C5C63",
        }}
        title="رأی"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
      </button>
      <span className="text-xs font-medium" style={{ color: count > 0 ? "#D93B3B" : "#5C5C63" }}>
        {count}
      </span>
    </div>
  );
}