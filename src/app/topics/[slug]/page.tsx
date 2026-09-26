import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTopicBySlug,
  getTopicSlugs,
  getArticlesByTopic,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, collectionJsonLd, pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  return pageMetadata({
    path: `/topics/${slug}`,
    title: topic.title,
    description: topic.description,
  });
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const articles = getArticlesByTopic(slug);
  const breadcrumbs = [
    { label: "خانه", href: "/" },
    { label: "موضوع‌ها", href: "/topics" },
    { label: topic.title },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd
        data={collectionJsonLd({
          name: topic.title,
          description: topic.description,
          path: `/topics/${slug}`,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold">{topic.title}</h1>
      <p className="mb-8 text-muted">{topic.description}</p>
      {articles.length === 0 ? (
        <p className="text-muted">هنوز مقاله‌ای در این موضوع منتشر نشده.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
