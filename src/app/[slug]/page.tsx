import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getPageSlugs } from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarkdownContent } from "@/components/MarkdownContent";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const RESERVED = new Set([
  "learn",
  "articles",
  "topics",
  "practice",
  "judges",
  "ladder",
  "rules",
  "club",
  "api",
  "_next",
]);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPageSlugs()
    .filter((slug) => !RESERVED.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const page = getPageBySlug(slug);
  if (!page) return {};
  return pageMetadata({
    path: `/${slug}`,
    title: page.title,
    description: page.description,
  });
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const page = getPageBySlug(slug);
  if (!page) notFound();

  const breadcrumbs = [
    { label: "خانه", href: "/" },
    { label: page.title },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.description && (
          <p className="mt-2 text-muted">{page.description}</p>
        )}
      </header>
      <MarkdownContent content={page.content} />
    </div>
  );
}
