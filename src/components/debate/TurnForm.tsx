"use client";

import { useActionState } from "react";
import { postTurnAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function TurnForm({ debateId, turnNumber }: { debateId: number; turnNumber: number }) {
  const [state, action, pending] = useActionState(postTurnAction, initialState);

  return (
    <div className="mt-6 border border-border bg-surface rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-accent-fg text-xs font-bold font-mono">
          {turnNumber}
        </span>
        <h3 className="text-sm font-bold text-foreground">ثبت نوبت شما</h3>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="debateId" value={debateId} />
        <textarea
          name="content"
          placeholder="استدلال یا پاسخ خود را با شفافیت و دقت بنویسید..."
          required
          rows={5}
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-md resize-y focus:outline-hidden focus:border-accent"
        />
        {state?.error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {pending ? "در حال ارسال..." : "ارسال استدلال"}
          </button>
        </div>
      </form>
    </div>
  );
}