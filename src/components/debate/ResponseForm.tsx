"use client";

import { useActionState } from "react";
import { acceptChallengeAction, respondToChallengeAction } from "@/lib/debate-actions";

const initialState = { error: "", success: false };

export function ResponseForm({
  challengeId,
  compact,
  allowResponse,
}: {
  challengeId: number;
  compact?: boolean;
  allowResponse?: boolean;
}) {
  const actionFn = allowResponse ? respondToChallengeAction : acceptChallengeAction;
  const [state, action, pending] = useActionState<{ error: string; success?: boolean }, FormData>(
    actionFn,
    initialState
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="challengeId" value={challengeId} />
      <textarea
        name="content"
        placeholder="موضع مخالف یا چالش خود را بنویسید (حداقل ۵۰ حرف)..."
        required
        rows={compact ? 3 : 4}
        className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-md resize-y focus:outline-hidden focus:border-accent"
      />
      {state?.error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
          نقد شما ثبت شد و در انتظار تصمیم نویسنده است.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2">
        {allowResponse && (
          <button
            type="submit"
            name="intent"
            value="response"
            disabled={pending}
            className="px-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground font-medium hover:border-accent/40 disabled:opacity-50 transition-colors cursor-pointer"
          >
            فقط ثبت نقد
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value="debate"
          disabled={pending}
          className="px-4 py-2 text-sm rounded-lg bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
        >
          {pending ? "در حال ارسال..." : "شروع مباحثه"}
        </button>
      </div>
    </form>
  );
}
