"use client";

import { useActionState } from "react";
import { respondToIdeaAction } from "@/lib/debate-actions";

const initialState = { error: "", success: false, kind: "" };

export function ResponseForm({
  ideaId,
  compact,
}: {
  ideaId: number;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<{ error: string; success?: boolean; kind?: string }, FormData>(
    respondToIdeaAction,
    initialState
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="ideaId" value={ideaId} />
      <textarea
        name="content"
        placeholder="پاسخ یا چالش خود را بنویسید..."
        required
        rows={compact ? 3 : 4}
        maxLength={5000}
        className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-md resize-y focus:outline-hidden focus:border-accent"
      />
      {state?.error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
          {state.kind === "challenge"
            ? "چالش تو ثبت شد؛ نویسنده دربارهٔ تبدیل آن به مباحثه تصمیم می‌گیرد."
            : "پاسخ تو ثبت شد."}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="submit"
          name="kind"
          value="reply"
          disabled={pending}
          className="px-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground font-medium hover:border-accent/40 disabled:opacity-50 transition-colors cursor-pointer"
        >
          ثبت پاسخ
        </button>
        <button
          type="submit"
          name="kind"
          value="challenge"
          disabled={pending}
          className="px-4 py-2 text-sm rounded-lg bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
        >
          {pending ? "در حال ارسال..." : "ثبت چالش ساختاریافته"}
        </button>
      </div>
      <p className="text-[11px] text-muted">
        پاسخ یک نظر آزاد است؛ چالش ساختاریافته درخواست مباحثهٔ دوطرفه است که نویسنده می‌پذیرد یا رد می‌کند.
      </p>
    </form>
  );
}
