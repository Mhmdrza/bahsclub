"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ponytail: 10s polling for active debates; add SSE/WebSocket if concurrency grows beyond ~50 active debates
const POLL_INTERVAL = 10000;

export function LivePoll({
  debateId,
  turnCount,
  active,
}: {
  debateId: number;
  turnCount: number;
  active: boolean;
}) {
  const router = useRouter();
  const lastTurnCount = useRef(turnCount);
  const closedRef = useRef(false);

  useEffect(() => {
    if (!active || closedRef.current) return;

    lastTurnCount.current = turnCount;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/poll/debate/${debateId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.turnCount !== lastTurnCount.current || data.closed) {
          lastTurnCount.current = data.turnCount;
          if (data.closed) closedRef.current = true;
          router.refresh();
        }
      } catch {
        // ponytail: silent retry on next tick; add error counter + user notification if failures persist
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [debateId, turnCount, active, router]);

  return null;
}