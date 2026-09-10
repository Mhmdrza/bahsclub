"use client";

import { useActionState, useEffect, useState } from "react";
import { registerAction } from "@/lib/auth-actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, UserPlus, Mail } from "lucide-react";

const initialRegister = { error: "" };

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
              <><span className="text-accent font-semibold">@{inviterUsername}</span> شما را دعوت کرده. برای ساخت حساب ثبت‌نام کنید</>
            ) : (
              "یک عضو باشگاه شما را دعوت کرده. برای ساخت حساب ثبت‌نام کنید"
            )}
          </p>

          <form action={regAction} className="flex flex-col gap-4">
            <input type="hidden" name="inviteCode" value={inviteCode} />

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
              {regPending ? "در حال ایجاد حساب..." : "ساخت حساب"}
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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
          <UserPlus size={13} />
          <span>عضویت آزاد</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">ورود به باشگاه اندیشه</h1>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          ثبت‌نام برای همه آزاد است. با ساخت حساب می‌توانید مناظره ایجاد کنید، در گفتگوها شرکت کنید و جامعه را غنی‌تر سازید
        </p>

        <form action={regAction} className="flex flex-col gap-4">
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

          <details className="group">
            <summary className="text-xs text-accent font-semibold cursor-pointer hover:underline list-none flex items-center gap-1.5 mt-2">
              <span>کد دعوت دارم</span>
              <span className="text-[10px] text-muted group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2">
              <input
                name="inviteCode"
                placeholder="کد دعوت (اختیاری)"
                className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
              />
            </div>
          </details>

          {regState?.error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{regState.error}</p>
          )}

          <button
            type="submit"
            disabled={regPending}
            className="w-full py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 shadow-xs cursor-pointer"
          >
            {regPending ? "در حال ایجاد حساب..." : "ساخت حساب"}
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