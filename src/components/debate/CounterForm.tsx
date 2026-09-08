"use client";

import { useActionState } from "react";
import { counterAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function CounterForm({ statementId }: { statementId: number }) {
  const [state, action, pending] = useActionState(counterAction, initialState);

  return (
    <div className="mt-8 border border-border bg-surface rounded-lg p-5 shadow-xs">
      <div className="eyebrow mb-1.5">پاسخ به بیانیه</div>
      <h2 className="text-lg font-bold text-foreground mb-2">ثبت پاسخ</h2>
      <p className="text-xs text-muted mb-4">
        دیدگاه مخالف یا تکمیلی خود را نسبت به این بیانیه بنویسید.
      </p>
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="statementId" value={statementId} />
        <textarea
          name="content"
          placeholder="پاسخ خود را بنویسید (حداقل ۵۰ حرف)..."
          required
          rows={4}
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
            {pending ? "در حال ارسال..." : "ارسال پاسخ"}
          </button>
        </div>
      </form>
    </div>
  );
}