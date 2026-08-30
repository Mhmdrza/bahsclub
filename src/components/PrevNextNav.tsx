import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { Article } from "@/lib/types";

interface PrevNextNavProps {
  prev?: Article;
  next?: Article;
  lessonSlug?: string;
}

function articleHref(slug: string, lessonSlug?: string) {
  const base = `/articles/${slug}`;
  return lessonSlug ? `${base}?lesson=${lessonSlug}` : base;
}

export function PrevNextNav({ prev, next, lessonSlug }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="درس قبلی و بعدی"
      className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={articleHref(prev.slug, lessonSlug)}
          className="group flex items-start gap-3 rounded-lg border border-border p-4 hover:border-accent/40"
        >
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden />
          <div>
            <p className="text-xs text-muted">درس قبلی</p>
            <p className="font-medium group-hover:text-accent">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={articleHref(next.slug, lessonSlug)}
          className="group flex items-start justify-end gap-3 rounded-lg border border-border p-4 text-left hover:border-accent/40 sm:text-right"
        >
          <div>
            <p className="text-xs text-muted">درس بعدی</p>
            <p className="font-medium group-hover:text-accent">{next.title}</p>
          </div>
          <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
