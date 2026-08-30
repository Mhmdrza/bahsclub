import Link from "next/link";
import { getSiteConfig } from "@/lib/content";

export function SiteHeader() {
  const config = getSiteConfig();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold text-foreground hover:text-accent"
        >
          {config.title}
        </Link>
        <nav aria-label="ناوبری اصلی" className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-1">
            {config.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-2 text-sm">
            منو
          </summary>
          <ul className="absolute left-0 top-full z-50 mt-2 min-w-48 rounded-md border border-border bg-surface p-2 shadow-sm">
            {config.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-background"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </header>
  );
}
