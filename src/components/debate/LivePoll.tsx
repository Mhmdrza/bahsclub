"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ponytail: 10s polling for active debates; add SSE/WebSocket if concurrency grows beyond ~50 active debates
const POLL_INTERVAL = 10000;

export function LivePoll({
  debateId,
  messageCount,
  active,
}: {
  debateId: number;
  messageCount: number;
  active: boolean;
}) {
  const router = useRouter();
  const lastCount = useRef(messageCount);
  const closedRef = useRef(false);

  useEffect(() => {
    if (!active || closedRef.current) return;

    lastCount.current = messageCount;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/poll/debate/${debateId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.messageCount !== lastCount.current || data.closed) {
          lastCount.current = data.messageCount;
          if (data.closed) closedRef.current = true;
          router.refresh();
        }
      } catch {
        // ponytail: silent retry on next tick; add error counter + user notification if failures persist
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [debateId, messageCount, active, router]);

  return null;
}