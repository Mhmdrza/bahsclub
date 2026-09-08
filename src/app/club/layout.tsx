import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth-actions";
import Link from "next/link";
import { WarningsBanner } from "@/components/club/WarningsBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight } from "lucide-react";

export default async function DebateLayout({ children }: { children: React.ReactNode }) {
const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1 text-muted hover:text-foreground transition-colors"
            >
              <ArrowRight size={14} />
              <span>سایت</span>
            </Link>
            <Link href="/club" className="font-bold text-lg tracking-tight hover:text-accent transition-colors">
              باشگاه
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/club/statements" className="hover:text-foreground transition-colors">بیانیه‌ها</Link>
              <Link href="/club/debates" className="hover:text-foreground transition-colors">بحث‌ها</Link>
              <Link href="/club/tags" className="hover:text-foreground transition-colors">تگ‌ها</Link>
              {session && session.user.role === "judge" && (
                <Link href="/club/judge" className="hover:text-gold transition-colors text-gold/80">داوری</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ThemeToggle />
            {session ? (
              <>
                <Link
                  href={`/club/users/${session.user.username}`}
                  className="text-muted font-medium hover:text-foreground transition-colors"
                >
                  {session.user.username}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs px-2.5 py-1 rounded border border-border hover:bg-background text-muted hover:text-foreground transition-colors"
                  >
                    خروج
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/club/login" className="text-muted hover:text-foreground transition-colors">
                  ورود
                </Link>
                <Link
                  href="/club/register"
                  className="px-3 py-1.5 rounded text-sm bg-accent text-accent-fg hover:opacity-90 transition-opacity font-medium"
                >
                  ثبت‌نام
                </Link>
              </>
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
      <footer className="border-t border-border py-6 text-xs text-muted bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          باشگاه بحث — بستری برای مناظره‌های عقلانی و ساختاریافته
        </div>
      </footer>
    </div>
  );
}