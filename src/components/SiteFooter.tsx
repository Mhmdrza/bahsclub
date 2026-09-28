import Link from "next/link";
import { getSiteConfig } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

const START_LINKS = [
  { label: "نردبان قدرت کلام", href: "/ladder" },
  { label: "مسیر سواد قضاوت", href: "/learn/judgment-literacy" },
  { label: "کتابخانه", href: "/articles" },
  { label: "تمرین‌ها", href: "/practice" },
];

const CLUB_LINKS = [
  { label: "مأموریت", href: "/mission" },
  { label: "درباره", href: "/about" },
  { label: "سؤالات متداول", href: "/faq" },
  { label: "واژه‌نامه", href: "/glossary" },
  { label: "ورود به باشگاه", href: "/club" },
];

export function SiteFooter() {
  const config = getSiteConfig();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold text-foreground">{config.title}</p>
          <p className="text-sm text-muted">{config.tagline}</p>
        </div>
        <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
          <nav aria-label="شروع و آموزش">
            <ul className="flex flex-wrap gap-4 text-sm">
              {START_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="بحث‌کلاب">
            <ul className="flex flex-wrap gap-4 text-sm">
              {CLUB_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
