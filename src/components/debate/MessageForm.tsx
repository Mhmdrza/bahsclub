"use client";

import { useActionState, useEffect, useRef } from "react";
import { postMessageAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function MessageForm({ debateId }: { debateId: number }) {
  const [state, action, pending] = useActionState(postMessageAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <div className="sticky bottom-4 z-10 mt-6 rounded-2xl border border-border bg-surface/95 backdrop-blur-md p-3 sm:p-4 shadow-lg">
      <form ref={formRef} action={action} className="flex flex-col gap-2.5">
        <input type="hidden" name="debateId" value={debateId} />
        <div className="relative">
          <textarea
            name="content"
            placeholder="استدلال یا پاسخ خود را بنویسید..."
            required
            rows={3}
            className="w-full px-3.5 py-2.5 border border-border/80 bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent transition-colors"
          />
        </div>
        {state?.error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">{state.error}</p>
        )}
        {"closureWiped" in state && (state as { closureWiped?: boolean }).closureWiped && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium px-1">
            درخواست پایان بحث قبلی با ثبت این پیام لغو شد
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted hidden sm:inline">
            Enter برای خط جدید • استدلال مستند و محترمانه بنویسید
          </span>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm rounded-xl bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer mr-auto sm:mr-0"
          >
            {pending ? (
              <span>در حال ارسال...</span>
            ) : (
              <>
                <span>ارسال پیام</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}