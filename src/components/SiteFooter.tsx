import Link from "next/link";
import { getSiteConfig } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteFooter() {
  const config = getSiteConfig();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">{config.title}</p>
          <p className="text-sm text-muted">{config.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
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
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
