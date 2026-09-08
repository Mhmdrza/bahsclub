"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/auth-actions";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-14" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted mb-4">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به باشگاه</span>
        </Link>
      </div>

      <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
          <UserPlus size={13} />
          <span>عضویت در باشگاه</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">ایجاد شناسنامه فکری</h1>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          برای ثبت باورها، آزمودن استدلال‌ها و مشارکت در گفتگوهای ساختاریافته حساب بسازید
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">نام کاربری</label>
            <input
              name="username"
              placeholder="مثال: socrates"
              required
              className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">ایمیل</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">رمز عبور</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
            />
          </div>

          {state?.error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 shadow-xs cursor-pointer"
          >
            {pending ? "در حال ایجاد حساب..." : "ثبت‌نام و شروع"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/club/login" className="text-accent font-semibold hover:underline">
            ورود به حساب
          </Link>
        </div>
      </div>
    </div>
  );
}
