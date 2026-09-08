"use client";

import { useActionState } from "react";
import { requestClosureAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function ClosureRequest({
  debateId,
  hasRequested,
  otherRequested,
}: {
  debateId: number;
  hasRequested: boolean;
  otherRequested: boolean;
}) {
  const [state, action, pending] = useActionState(requestClosureAction, initialState);

  if (hasRequested) {
    return (
      <div className="mt-6 text-center py-3 px-4 text-xs rounded border border-border bg-surface text-muted">
        شما درخواست اتمام بحث را ثبت کرده‌اید. در انتظار تأیید طرف مقابل.
      </div>
    );
  }

  if (otherRequested) {
    return (
      <div className="mt-6 text-center p-4 border border-accent/40 bg-accent-light/50 rounded-lg">
        <p className="text-sm font-medium text-foreground mb-3">
          طرف مقابل پیشنهاد پایان این مباحثه را داده است.
        </p>
        <form action={action}>
          <input type="hidden" name="debateId" value={debateId} />
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {pending ? "در حال پردازش..." : "موافقت با پایان بحث"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <form action={action}>
        <input type="hidden" name="debateId" value={debateId} />
        <button
          type="submit"
          disabled={pending}
          className="px-3.5 py-1.5 text-xs rounded border border-border bg-surface text-muted hover:text-foreground hover:border-muted/50 transition-colors disabled:opacity-50"
        >
          {pending ? "..." : "درخواست توافقی اتمام بحث"}
        </button>
      </form>
      {state?.error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">{state.error}</p>
      )}
    </div>
  );
}