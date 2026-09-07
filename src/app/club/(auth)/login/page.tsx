"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";
import Link from "next/link";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="max-w-sm mx-auto mt-12 border border-border bg-surface p-6 sm:p-8 rounded-lg shadow-xs">
      <div className="eyebrow mb-1">باشگاه مناظره</div>
      <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">ورود به حساب</h1>
      <p className="text-xs text-muted mb-6">با نام کاربری و رمز عبور خود وارد شوید</p>

      <form action={action} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">نام کاربری</label>
          <input
            name="username"
            placeholder="username"
            required
            className="w-full px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-md focus:outline-hidden focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">رمز عبور</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-md focus:outline-hidden focus:border-accent"
          />
        </div>
        {state?.error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
        >
          {pending ? "در حال ورود..." : "ورود"}
        </button>
      </form>

      <p className="text-xs mt-6 text-center text-muted">
        حساب کاربری ندارید؟{" "}
        <Link href="/club/register" className="text-accent underline font-medium">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}