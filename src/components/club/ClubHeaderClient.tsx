"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Plus, Menu, X, Mail, ShieldAlert, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { SessionData } from "@/lib/session";

export function ClubHeaderClient({
  session,
  logoutAction,
}: {
  session: SessionData | null;
  logoutAction: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/"
            className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1"
            title="بازگشت به سایت اصلی"
          >
            <ArrowRight size={14} />
            <span className="hidden sm:inline">آموزش</span>
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <Link href="/club" className="font-bold text-base sm:text-lg tracking-tight hover:text-accent transition-colors">
            باشگاه اندیشه
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm text-muted">
            <Link href="/club/debates" className="hover:text-foreground transition-colors">
              مباحثه‌ها
            </Link>
            <Link href="/club/tags" className="hover:text-foreground transition-colors">
              موضوعات
            </Link>
            {session && session.user.role === "judge" && (
              <Link href="/club/judge" className="hover:text-gold transition-colors text-gold/90 font-medium">
                داوری
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/club/statements/new"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">ثبت نظر / بیانیه</span>
            <span className="sm:hidden">بیانیه</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/club/notifications"
                className="relative text-muted hover:text-foreground transition-colors p-1.5"
                title="اعلان‌ها"
              >
                <Bell size={16} />
                {session.notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {session.notificationCount > 9 ? "9+" : session.notificationCount}
                  </span>
                )}
              </Link>
              <Link
                href="/club/invites"
                className="hidden md:inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-surface"
              >
                <Mail size={13} />
                <span>دعوت</span>
              </Link>
              <Link
                href={`/club/users/${session.user.username}`}
                className="hidden sm:inline-block text-xs font-mono font-medium px-2 py-1 rounded-md bg-background border border-border hover:border-accent/50 text-foreground transition-colors max-w-28 truncate"
                title={`@${session.user.username}`}
              >
                @{session.user.username}
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <Link href="/club/login" className="text-muted hover:text-foreground transition-colors px-2 py-1">
                ورود
              </Link>
              <Link
                href="/club/register"
                className="px-2.5 py-1 rounded-md border border-border bg-background hover:bg-surface text-foreground font-medium transition-colors"
              >
                عضویت
              </Link>
            </div>
          )}

          {/* Hamburger toggle button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            className="md:hidden flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 text-foreground hover:bg-surface/80 transition-colors"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <nav aria-label="منوی باشگاه" className="flex flex-col gap-1 text-sm">
            {session && (
              <div className="pb-2 mb-2 border-b border-border/60">
                <Link
                  href={`/club/users/${session.user.username}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono font-medium text-foreground"
                >
                  <span>@{session.user.username}</span>
                  <span className="text-[11px] text-muted font-sans">مشاهده پروفایل</span>
                </Link>
              </div>
            )}

            <Link
              href="/club/debates"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-muted hover:bg-background hover:text-foreground transition-colors"
            >
              مباحثه‌ها
            </Link>
            <Link
              href="/club/tags"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-muted hover:bg-background hover:text-foreground transition-colors"
            >
              موضوعات
            </Link>

            {session ? (
              <>
                <Link
                  href="/club/invites"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-muted hover:bg-background hover:text-foreground transition-colors"
                >
                  <Mail size={15} />
                  <span>کدهای دعوت</span>
                </Link>

                {session.user.role === "judge" && (
                  <Link
                    href="/club/judge"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-gold/90 hover:bg-background hover:text-gold transition-colors font-medium"
                  >
                    <ShieldAlert size={15} />
                    <span>پنل داوری</span>
                  </Link>
                )}

                <div className="pt-2 mt-1 border-t border-border/60 flex items-center justify-between px-1">
                  <span className="text-xs text-muted">حالت نمایش</span>
                  <ThemeToggle />
                </div>

                <div className="pt-2 mt-1 border-t border-border/60">
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted hover:text-red-500 hover:bg-background transition-colors text-right"
                    >
                      <LogOut size={14} />
                      <span>خروج از حساب</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="pt-2 mt-1 border-t border-border/60 flex items-center justify-between px-1">
                  <span className="text-xs text-muted">حالت نمایش</span>
                  <ThemeToggle />
                </div>

                <div className="pt-2 mt-1 border-t border-border/60 flex flex-col gap-1.5">
                  <Link
                    href="/club/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center rounded-md px-3 py-2 text-xs bg-background border border-border text-foreground hover:bg-surface transition-colors"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/club/register"
                    onClick={() => setIsOpen(false)}
                    className="block text-center rounded-md px-3 py-2 text-xs bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
                  >
                    عضویت در باشگاه
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
