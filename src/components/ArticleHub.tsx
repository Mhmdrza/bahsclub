import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import type { Article } from "@/lib/types";
import { formatPersianNumber } from "@/lib/utils";

interface ArticleHubProps {
  title: string;
  description: string;
  path: string;
  breadcrumbs: BreadcrumbItem[];
  articles: Article[];
}

/** Shared renderer for category/tag hub pages — the crawlable facet URLs. */
export function ArticleHub({
  title,
  description,
  path,
  breadcrumbs,
  articles,
}: ArticleHubProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd data={collectionJsonLd({ name: title, description, path })} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold">{title}</h1>
        <p className="text-muted">{description}</p>
        <p className="mt-2 text-sm text-muted">
          {formatPersianNumber(articles.length)} مطلب
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="rounded-lg border border-dashed border-border py-12 text-center text-muted">
          هنوز مطلبی در این بخش منتشر نشده است.
        </p>
      )}
    </div>
  );
}
