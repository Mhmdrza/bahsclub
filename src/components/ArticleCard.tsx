import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatPersianNumber, levelLabel, typeLabel } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  completed?: boolean;
  href?: string;
}

export function ArticleCard({
  article,
  completed = false,
  href,
}: ArticleCardProps) {
  const link = href ?? `/articles/${article.slug}`;

  return (
    <Link
      href={link}
      className="group block rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-background"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-md bg-background px-2 py-0.5">
          {article.category}
        </span>
        <span>{levelLabel(article.level)}</span>
        <span>{typeLabel(article.type)}</span>
        {completed && (
          <span className="flex items-center gap-1 text-accent">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            تکمیل شده
          </span>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold group-hover:text-accent">
        {article.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-muted">
        {article.description}
      </p>
      <div className="flex items-center gap-1 text-xs text-muted">
        <Clock className="h-3.5 w-3.5" aria-hidden />
        <span>{formatPersianNumber(article.readingTime)} دقیقه مطالعه</span>
      </div>
    </Link>
  );
}
