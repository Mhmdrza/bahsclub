"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export function SiteHeaderClient({ config }: { config: SiteConfig }) {
  const [isOpen, setIsOpen] = useState(false);

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
          <nav aria-label="ناوبری اصلی" className="hidden md:block">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/club"
            className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            ورود به باشگاه
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            className="md:hidden flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 text-foreground hover:bg-surface/80 transition-colors"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <nav aria-label="منوی موبایل">
            <ul className="flex flex-col gap-1">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between px-1">
              <span className="text-xs text-muted">حالت نمایش</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}