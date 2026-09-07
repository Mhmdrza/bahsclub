import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function DebateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/debate" className="font-bold text-lg tracking-tight hover:text-accent transition-colors">
              باشگاه بحث
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/debate/debates" className="hover:text-foreground transition-colors">بحث‌ها</Link>
              <Link href="/debate/tags" className="hover:text-foreground transition-colors">برچسب‌ها</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {session ? (
              <>
                <span className="text-muted font-medium">{session.user.username}</span>
                <Link
                  href="/api/debate/auth/logout"
                  className="text-xs px-2.5 py-1 rounded border border-border hover:bg-background text-muted hover:text-foreground transition-colors"
                >
                  خروج
                </Link>
              </>
            ) : (
              <>
                <Link href="/debate/login" className="text-muted hover:text-foreground transition-colors">
                  ورود
                </Link>
                <Link
                  href="/debate/register"
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