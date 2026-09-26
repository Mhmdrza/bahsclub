import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHub } from "@/components/ArticleHub";
import { getTagFacets } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getTagFacets().map((facet) => ({ tag: facet.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const facet = getTagFacets().find((f) => f.slug === tag);
  if (!facet) return {};
  return pageMetadata({
    path: `/articles/tag/${facet.slug}`,
    title: `برچسب ${facet.label}`,
    description: `همهٔ مطلب‌های برچسب‌شده با «${facet.label}» در بحث‌کلاب.`,
  });
}

export default async function TagHubPage({ params }: Props) {
  const { tag } = await params;
  const facet = getTagFacets().find((f) => f.slug === tag);
  if (!facet) notFound();

  const path = `/articles/tag/${facet.slug}`;
  return (
    <ArticleHub
      title={`برچسب ${facet.label}`}
      description={`همهٔ مطلب‌های برچسب‌شده با «${facet.label}» در بحث‌کلاب.`}
      path={path}
      breadcrumbs={[
        { label: "خانه", href: "/" },
        { label: "مقاله‌ها", href: "/articles" },
        { label: facet.label },
      ]}
      articles={facet.articles}
    />
  );
}
