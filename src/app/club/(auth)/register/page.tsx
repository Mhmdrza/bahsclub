"use client";

import { useActionState, useEffect, useState } from "react";
import { registerAction, waitlistAction } from "@/lib/auth-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, UserPlus, Mail, Users, Lock } from "lucide-react";

const initialRegister = { error: "" };
const initialWaitlist = { success: false };

export default function RegisterPage() {
  const params = useSearchParams();
  const inviteCode = params.get("code");
  const [inviterUsername, setInviterUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteCode) return;
    fetch(`/api/invites/info?code=${inviteCode}`)
      .then(r => r.json())
      .then(d => { if (d.inviterUsername) setInviterUsername(d.inviterUsername); })
      .catch(() => {});
  }, [inviteCode]);

  const [regState, regAction, regPending] = useActionState(registerAction, initialRegister);
  const [wlState, wlAction, wlPending] = useActionState(waitlistAction, initialWaitlist);

  if (inviteCode) {
    return (
      <div className="max-w-md mx-auto mt-8 sm:mt-14" dir="rtl">
        <div className="flex items-center gap-2 text-xs text-muted mb-4">
          <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowRight size={14} />
            <span>بازگشت به باشگاه</span>
          </Link>
        </div>

        <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium mb-3">
            <Mail size={13} />
            <span>دعوت‌نامه اختصاصی</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">شما دعوت شده‌اید</h1>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            {inviterUsername ? (
              <><span className="text-accent font-semibold">@{inviterUsername}</span> شما را به باشگاه دعوت کرده. ایمیل ثبت‌شده در دعوت‌نامه را وارد کنید تا حساب بسازید</>
            ) : (
              "یک عضو باشگاه شما را دعوت کرده. ایمیل ثبت‌شده در دعوت‌نامه را وارد کنید تا حساب بسازید"
            )}
          </p>

          <form action={regAction} className="flex flex-col gap-4">
            <input type="hidden" name="inviteCode" value={inviteCode} />

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">ایمیل (مطابق دعوت‌نامه)</label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
            </div>

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
              <label className="text-xs font-semibold text-foreground block mb-1.5">رمز عبور</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
            </div>

            {regState?.error && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{regState.error}</p>
            )}

            <button
              type="submit"
              disabled={regPending}
              className="w-full py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 shadow-xs cursor-pointer"
            >
              {regPending ? "در حال ایجاد حساب..." : "فعال‌سازی حساب"}
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

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-14" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted mb-4">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به باشگاه</span>
        </Link>
      </div>

      <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium mb-3">
          <Lock size={13} />
          <span>دسترسی محدود</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">ورود به باشگاه اندیشه</h1>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          باشگاه اندیشه یک انجمن دربسته برای گفتگوهای ساختاریافته است. در حال حاضر عضویت تنها با دعوت‌نامه اعضا امکان‌پذیر است
        </p>

        <div className="bg-background border border-border rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Users size={18} className="text-muted shrink-0 mt-0.5" />
            <div className="text-xs text-muted leading-relaxed">
              <p className="font-semibold text-foreground mb-1">چرا دعوت‌نامه؟</p>
              <p>
                کیفیت گفتگوها به انتخاب اعضا وابسته است. دعوت‌نامه‌های محدود باعث می‌شود هر عضو جدید توسط یک عضو فعلی تأیید شود. این یعنی جامعه‌ای متمرکز و گفتگوهایی عمیق‌تر
              </p>
            </div>
          </div>
        </div>

        <details className="group mb-6">
          <summary className="text-xs text-accent font-semibold cursor-pointer hover:underline list-none flex items-center gap-1.5">
            <span>کد دعوت دارم</span>
            <span className="text-[10px] text-muted group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 p-3 rounded-xl bg-background border border-border">
            <p className="text-[11px] text-muted mb-2">اگر یکی از اعضا به شما دعوت‌نامه داده، کد را وارد کنید</p>
            <form action={regAction} className="flex flex-col gap-3">
              <input type="hidden" name="inviteCode" value="" />
              <input
                name="inviteCode"
                placeholder="کد دعوت"
                required
                className="w-full px-3 py-2 border border-border bg-surface text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
              <input
                name="email"
                type="email"
                placeholder="ایمیل (مطابق دعوت‌نامه)"
                required
                className="w-full px-3 py-2 border border-border bg-surface text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
              <input
                name="username"
                placeholder="نام کاربری"
                required
                className="w-full px-3 py-2 border border-border bg-surface text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
              <input
                name="password"
                type="password"
                placeholder="رمز عبور"
                required
                className="w-full px-3 py-2 border border-border bg-surface text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={regPending}
                className="w-full py-2 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs cursor-pointer"
              >
                {regPending ? "..." : "فعال‌سازی حساب"}
              </button>
            </form>
            {regState?.error && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-2">{regState.error}</p>
            )}
          </div>
        </details>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface px-3 text-xs text-muted">یا در لیست انتظار ثبت کنید</span>
          </div>
        </div>

        {wlState.success ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium mb-3">
              <Mail size={13} />
              <span>ثبت شد</span>
            </div>
            <p className="text-sm text-foreground font-semibold mb-1">در لیست انتظار ثبت شدید</p>
            <p className="text-xs text-muted leading-relaxed">
              وقتی یکی از اعضا دعوت‌نامه‌ای برای شما صادر کند، از طریق ایمیل مطلع خواهید شد
            </p>
          </div>
        ) : (
          <form action={wlAction} className="flex flex-col gap-3">
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
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                حوزه‌های مورد علاقه <span className="text-muted font-normal">(اختیاری)</span>
              </label>
              <textarea
                name="note"
                placeholder="مثلاً: فلسفه، سیاست، علوم شناختی"
                rows={2}
                className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors resize-none"
              />
            </div>
            {wlState?.error && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{wlState.error}</p>
            )}
            <button
              type="submit"
              disabled={wlPending}
              className="w-full py-2.5 text-sm rounded-xl border border-accent text-accent font-semibold hover:bg-accent/5 disabled:opacity-50 transition-colors shadow-xs cursor-pointer bg-transparent"
            >
              {wlPending ? "..." : "ثبت در لیست انتظار"}
            </button>
          </form>
        )}

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