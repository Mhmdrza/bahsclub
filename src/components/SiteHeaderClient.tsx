"use client";

import Link from "next/link";
import type { SiteConfig } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeaderClient({ config }: { config: SiteConfig }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold text-foreground hover:text-accent tracking-tight"
          >
            {config.title}
          </Link>
          <nav aria-label="ناوبری اصلی" className="hidden sm:block">
            <ul className="flex items-center gap-1">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-1.5 text-xs text-muted hover:bg-surface hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/club"
            className="text-xs px-3 py-1.5 rounded-lg bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
          >
            ورود به باشگاه
          </Link>
          <ThemeToggle />
          <details className="relative sm:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-border px-2.5 py-1 text-xs">
              منو
            </summary>
            <ul className="absolute left-0 top-full z-50 mt-2 min-w-40 rounded-lg border border-border bg-surface p-2 shadow-md">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-1.5 text-xs hover:bg-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}