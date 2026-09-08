"use client";

import { useEffect, useRef } from "react";
import { markNotifsReadAction } from "@/lib/notification-actions";

export default function NotifMarkRead() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    markNotifsReadAction().catch(() => {});
  }, []);
  return null;
}