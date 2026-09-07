import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function DebateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F5F7", color: "#1A1A1D" }}>
      <header className="border-b border-[#E5E5EA]" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/debate" className="font-bold text-lg" style={{ color: "#1A1A1D" }}>
              باشگاه بحث
            </Link>
            <nav className="flex gap-4 text-sm" style={{ color: "#5C5C63" }}>
              <Link href="/debate/debates">بحث‌ها</Link>
              <Link href="/debate/tags">برچسب‌ها</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {session ? (
              <>
                <span style={{ color: "#5C5C63" }}>{session.user.username}</span>
                <Link href="/api/debate/auth/logout" style={{ color: "#D93B3B" }}>خروج</Link>
              </>
            ) : (
              <>
                <Link href="/debate/login" style={{ color: "#5C5C63" }}>ورود</Link>
                <Link
                  href="/debate/register"
                  className="px-3 py-1.5 rounded-sm text-sm"
                  style={{ background: "#D93B3B", color: "#FFFFFF" }}
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-[#E5E5EA] py-4 text-xs" style={{ color: "#5C5C63", background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          باشگاه بحث — بستری برای مناظره‌های ساختاریافته
        </div>
      </footer>
    </div>
  );
}