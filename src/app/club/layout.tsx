import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth-actions";
import Link from "next/link";
import { WarningsBanner } from "@/components/club/WarningsBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Plus } from "lucide-react";

export default async function DebateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1"
              title="بازگشت به سایت اصلی"
            >
              <ArrowRight size={14} />
              <span className="hidden sm:inline">آموزش</span>
            </Link>
            
            <div className="h-4 w-px bg-border hidden sm:block" />

            <Link href="/club" className="font-bold text-lg tracking-tight hover:text-accent transition-colors">
              باشگاه اندیشه
            </Link>

            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/club/debates" className="hover:text-foreground transition-colors">
                مناظره‌ها
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

          <div className="flex items-center gap-3">
            <Link
              href="/club/statements/new"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">ثبت باور / بیانیه</span>
              <span className="sm:hidden">بیانیه</span>
            </Link>

            <div className="h-4 w-px bg-border" />

            <ThemeToggle />

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/club/users/${session.user.username}`}
                  className="text-xs font-mono font-medium px-2 py-1 rounded-md bg-background border border-border hover:border-accent/50 text-foreground transition-colors"
                >
                  @{session.user.username}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-muted hover:text-red-500 transition-colors p-1"
                    title="خروج"
                  >
                    خروج
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
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
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {session && session.warnings && session.warnings.length > 0 && (
          <div className="mb-6">
            <WarningsBanner
              warnings={session.warnings}
              blockedUntil={session.user.blockedUntil}
            />
          </div>
        )}
        {children}
      </main>

      <footer className="border-t border-border py-6 text-xs text-muted bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          باشگاه اندیشه — پایگاهی برای ثبت، محک و پالایش عقلانی باورها
        </div>
      </footer>
    </div>
  );
}