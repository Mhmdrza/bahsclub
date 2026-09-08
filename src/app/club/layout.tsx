import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth-actions";
import { WarningsBanner } from "@/components/club/WarningsBanner";
import { ClubHeaderClient } from "@/components/club/ClubHeaderClient";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSiteConfig } from "@/lib/content";
import Link from "next/link";

export default async function DebateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      <ClubHeaderClient session={session} logoutAction={logoutAction} />

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-right">
            باشگاه اندیشه — پایگاهی برای ثبت، محک و پالایش عقلانی باورها
          </p>
          {/* <div className="hidden md:block">
            <ThemeToggle />
          </div> */}
        </div>
      </footer>
    </div>
  );
}