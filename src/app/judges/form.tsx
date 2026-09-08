"use client";

import { useActionState } from "react";
import { applyJudgeAction } from "@/lib/moderation";
import { CheckCircle2, Send } from "lucide-react";

const initialState = { error: "" };

export function JudgeApplicationForm() {
  const [state, action, pending] = useActionState(applyJudgeAction, initialState);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent-light/30 p-6 sm:p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-accent text-accent-fg flex items-center justify-center mx-auto mb-2 shadow-xs">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-lg font-bold text-foreground">درخواست شما با موفقیت ثبت شد</h3>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
          مشخصات و حوزه‌های تخصصی شما بررسی شده و در صورت نیاز به داور در موضوعات انتخابی، از طریق شماره تماس با شما هماهنگ خواهد شد.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">
          نام و نام خانوادگی <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          placeholder="مثال: سهراب رحیمی"
          required
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">
          شماره تماس (جهت هماهنگی و احراز) <span className="text-red-500">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          placeholder="09123456789"
          required
          dir="ltr"
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors text-right font-mono"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">
          موضوعات و حوزه‌های مورد علاقه برای داوری <span className="text-red-500">*</span>
        </label>
        <input
          name="topics"
          placeholder="مثال: فلسفه، اقتصاد، هوش مصنوعی، اخلاق کاربردی"
          required
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors"
        />
        <p className="text-[11px] text-muted mt-1">حوزه‌هایی که در آن‌ها دانش کافی جهت داوری استدلال‌ها و سنجش ادعاها دارید.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">
          سوابق، آشنایی با مغالطات و فنون مناظره (اختیاری)
        </label>
        <textarea
          name="experience"
          placeholder="شرح مختصری از سوابق مطالعاتی، تجربه در مناظره یا آشنایی با استدلال منطقی و مغالطات..."
          rows={4}
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent transition-colors"
        />
      </div>

      {state?.error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 w-full py-3 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs cursor-pointer mt-2"
      >
        {pending ? (
          <span>در حال ارسال درخواست...</span>
        ) : (
          <>
            <Send size={15} />
            <span>ارسال فرم داوری</span>
          </>
        )}
      </button>
    </form>
  );
}
