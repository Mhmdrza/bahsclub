import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleHub } from "@/components/ArticleHub";
import { getCategoryFacets } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getCategoryFacets().map((facet) => ({ category: facet.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const facet = getCategoryFacets().find((f) => f.slug === category);
  if (!facet) return {};
  return pageMetadata({
    path: `/articles/category/${facet.slug}`,
    title: `دستهٔ ${facet.label}`,
    description: `همهٔ مقاله‌ها، تاکتیک‌ها و تمرین‌های دستهٔ «${facet.label}» در بحث‌کلاب.`,
  });
}

export default async function CategoryHubPage({ params }: Props) {
  const { category } = await params;
  const facet = getCategoryFacets().find((f) => f.slug === category);
  if (!facet) notFound();

  const path = `/articles/category/${facet.slug}`;
  return (
    <ArticleHub
      title={`دستهٔ ${facet.label}`}
      description={`همهٔ مطلب‌های دستهٔ «${facet.label}» در بحث‌کلاب.`}
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
