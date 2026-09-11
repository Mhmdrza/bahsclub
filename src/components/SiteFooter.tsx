import Link from "next/link";
import { getPublishedPages, getSiteConfig } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

const CLUB_ONLY_PAGES = new Set(["rules"]);

export function SiteFooter() {
  const config = getSiteConfig();
  const navHrefs = new Set(config.nav.map((item) => item.href));
  const pages = getPublishedPages().filter(
    (page) =>
      !CLUB_ONLY_PAGES.has(page.slug) && !navHrefs.has(`/${page.slug}`)
  );

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold text-foreground">{config.title}</p>
          <p className="text-sm text-muted">{config.tagline}</p>
        </div>
        <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
          <nav aria-label="ناوبری پاورقی">
            <ul className="flex flex-wrap gap-4 text-sm">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="صفحه‌های سایت">
            <ul className="flex flex-wrap gap-4 text-sm">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-muted hover:text-accent"
                  >
                    {page.title}
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
