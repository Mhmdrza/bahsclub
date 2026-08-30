import Link from "next/link";
import { isAuthenticated, logout } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  // Allow login page through even without auth; proxy.ts redirects anyway
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {authenticated && (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  پنل مدیریت
                </Link>
                <div className="hidden md:flex items-center gap-1">
                  <NavLink href="/admin/articles" label="مقاله‌ها" />
                  <NavLink href="/admin/lessons" label="درس‌ها" />
                  <NavLink href="/admin/topics" label="موضوعات" />
                  <NavLink href="/admin/pages" label="برگه‌ها" />
                  <NavLink href="/admin/site-config" label="تنظیمات سایت" />
                  <NavLink href="/admin/settings" label="تنظیمات" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  target="_blank"
                >
                  مشاهده سایت
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    خروج
                  </button>
                </form>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
    >
      {label}
    </Link>
  );
}