"use client";

import { useActionState } from "react";
import { acknowledgeWarningsAction } from "@/lib/moderation";

export function WarningsBanner({
  warnings,
  blockedUntil,
}: {
  warnings: { id: number; note: string; createdAt: string }[];
  blockedUntil: string | null;
}) {
  const [, action, pending] = useActionState(acknowledgeWarningsAction, null);

  const blocked = blockedUntil && new Date(blockedUntil) > new Date();

  return (
    <div className="flex flex-col gap-2">
      {blocked && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs p-3 rounded text-center">
          حساب شما تا {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(blockedUntil!))} مسدود است
        </div>
      )}
      {warnings.map((w) => (
        <div key={w.id} className="bg-gold/10 border border-gold/30 text-gold p-3 rounded text-xs flex items-center justify-between">
          <span>{w.note}</span>
          <form action={action} className="shrink-0 mr-3">
            <button type="submit" disabled={pending} className="text-xs px-2 py-0.5 rounded border border-gold/30 hover:bg-gold/10 text-gold transition-colors">
              متوجه شدم
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}