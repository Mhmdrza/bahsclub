"use client";

import { useActionState, useState, useEffect } from "react";
import { createInviteAction, getMyInvitesAction, getInviteQuotaAction } from "@/lib/invite-actions";
import Link from "next/link";
import { ArrowRight, Mail, Copy, Check, Users, Infinity } from "lucide-react";

const initState = { success: false, code: "", email: "" };

export default function InvitesPage() {
  const [state, action, pending] = useActionState(createInviteAction, initState);
  const [invites, setInvites] = useState<any[]>([]);
  const [quota, setQuota] = useState<{ remaining: number; unlimited: boolean }>({ remaining: 0, unlimited: false });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getMyInvitesAction().then((r: any) => setInvites(r.items || []));
    getInviteQuotaAction().then(setQuota);
  }, []);

  useEffect(() => {
    if (state.success) {
      getMyInvitesAction().then((r: any) => setInvites(r.items || []));
      getInviteQuotaAction().then(setQuota);
    }
  }, [state.success]);

  const copyLink = (code: string) => {
    const link = `${window.location.origin}/club/register?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="max-w-lg mx-auto mt-8 sm:mt-14" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted mb-4">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به باشگاه</span>
        </Link>
      </div>

      <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
          <Mail size={13} />
          <span>دعوت از دیگران</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">دعوت‌نامه‌های اختصاصی</h1>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          هر دعوت‌نامه منحصربه‌فرد است و فقط برای یک ایمیل مشخص کار می‌کند
        </p>

        {/* Quota */}
        <div className="bg-background border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-muted shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-muted">سهمیه دعوت</span>
              <div className="text-sm font-bold text-foreground font-mono mt-0.5">
                {quota.unlimited ? (
                  <span className="flex items-center gap-1">
                    <Infinity size={14} /> نامحدود
                  </span>
                ) : (
                  <span>{quota.remaining} باقی‌مانده</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create new invite */}
        <form action={action} className="flex flex-col gap-3 mb-6 p-4 rounded-xl bg-background border border-border">
          <h2 className="text-xs font-semibold text-foreground">صدور دعوت‌نامه جدید</h2>
          <div className="flex gap-2">
            <input
              name="email"
              type="email"
              placeholder="ایمیل دعوت‌شونده"
              required
              className="flex-1 px-3 py-2 border border-border bg-surface text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors font-mono"
            />
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs cursor-pointer shrink-0"
            >
              {pending ? "..." : "صدور"}
            </button>
          </div>
          {state.error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
          )}
          {state.success && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="mb-1">دعوت‌نامه صادر شد. لینک اختصاصی:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[11px] bg-background px-2 py-1 rounded border border-border truncate font-mono">
                  {origin}/club/register?code={state.code}
                </code>
                <button
                  type="button"
                  onClick={() => copyLink(state.code)}
                  className="text-accent hover:underline shrink-0 cursor-pointer"
                >
                  {copied === state.code ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Invite history */}
        <h2 className="text-xs font-semibold text-foreground mb-3">تاریخچه دعوت‌نامه‌ها</h2>
        {invites.length === 0 ? (
          <p className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-xl">
            هنوز دعوت‌نامه‌ای صادر نکرده‌اید
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {invites.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-xl bg-background border border-border text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-foreground truncate">{inv.invited_email}</p>
                  <p className="text-muted mt-0.5">
                    {inv.used_by ? (
                      <span className="text-green-600 dark:text-green-400">استفاده شده</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">منتظر استفاده</span>
                    )}
                  </p>
                </div>
                {!inv.used_by && (
                  <button
                    type="button"
                    onClick={() => copyLink(inv.code)}
                    className="text-accent hover:text-accent/70 transition-colors cursor-pointer p-1"
                    title="کپی لینک دعوت"
                  >
                    {copied === inv.code ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}