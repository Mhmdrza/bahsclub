"use client";

import { useActionState, useState } from "react";
import { flagAction } from "@/lib/moderation";

const REASONS: { value: string; label: string }[] = [
  { value: "personal_attack", label: "حمله شخصی (اصل ۱)" },
  { value: "insulting_question", label: "سؤال تحقیرآمیز (اصل ۳)" },
  { value: "derailing", label: "انحراف عمدی از موضوع (اصل ۱۰)" },
  { value: "motive_guessing", label: "حدس‌زدن نیت (اصل ۹)" },
  { value: "pressure", label: "فشار روانی و اخلال (اصل ۱۰)" },
  { value: "spam", label: "هرزنامه و محتوای نامرتبط" },
  { value: "other", label: "سایر" },
];

const initialState = { error: "" };

export function FlagButton({
  flaggableType,
  flaggableId,
  disabled,
}: {
  flaggableType: "debate" | "turn";
  flaggableId: number;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(flagAction, initialState);

  if (disabled) return null;

  if (open) {
    return (
      <div className="relative inline-block">
        <form action={action} className="absolute top-0 left-0 z-20 bg-surface border border-border rounded-lg p-4 shadow-lg w-72" dir="rtl">
          <input type="hidden" name="flaggableType" value={flaggableType} />
          <input type="hidden" name="flaggableId" value={flaggableId} />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">گزارش تخلف</span>
            <button type="button" onClick={() => setOpen(false)} className="text-muted hover:text-foreground text-sm">✕</button>
          </div>
          {state.error && <p className="text-xs text-red-500 mb-2">{state.error}</p>}
          {state.ok ? (
            <p className="text-xs text-accent font-medium">گزارش ثبت شد. متشکریم.</p>
          ) : (
            <>
              <select name="reason" required className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded mb-2">
                <option value="">انتخاب دلیل...</option>
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <textarea
                name="details"
                placeholder="توضیحات (اختیاری)..."
                rows={2}
                className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded mb-2 resize-none"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={pending} className="flex-1 px-3 py-1.5 text-xs rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50">
                  {pending ? "..." : "ارسال"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded border border-border text-muted hover:text-foreground">انصراف</button>
              </div>
            </>
          )}
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="text-muted hover:text-red-500 transition-colors p-0.5"
      title="گزارش تخلف"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    </button>
  );
}