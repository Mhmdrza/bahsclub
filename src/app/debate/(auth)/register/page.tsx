"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/auth-actions";
import Link from "next/link";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#1A1A1D" }}>ثبت‌نام</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5C63" }}>یک نام کاربری انتخاب کنید</p>

      <form action={action} className="flex flex-col gap-4">
        <input
          name="username"
          placeholder="نام کاربری"
          required
          className="w-full px-3 py-2 border text-sm rounded-sm"
          style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
        />
        <input
          name="email"
          type="email"
          placeholder="ایمیل"
          required
          className="w-full px-3 py-2 border text-sm rounded-sm"
          style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
        />
        <input
          name="password"
          type="password"
          placeholder="رمز عبور"
          required
          className="w-full px-3 py-2 border text-sm rounded-sm"
          style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
        />
        {state?.error && (
          <p className="text-sm" style={{ color: "#D93B3B" }}>{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-2 text-sm rounded-sm disabled:opacity-50"
          style={{ background: "#D93B3B", color: "#FFFFFF" }}
        >
          {pending ? "..." : "ثبت‌نام"}
        </button>
      </form>

      <p className="text-sm mt-4 text-center" style={{ color: "#5C5C63" }}>
        قبلاً ثبت‌نام کرده‌اید؟ <Link href="/debate/login" style={{ color: "#D93B3B" }}>ورود</Link>
      </p>
    </div>
  );
}