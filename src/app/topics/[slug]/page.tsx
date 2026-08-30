import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTopicBySlug,
  getTopicSlugs,
  getArticlesByTopic,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";

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
  return {
    title: topic.title,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const articles = getArticlesByTopic(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "خانه", href: "/" },
          { label: "موضوع‌ها", href: "/topics" },
          { label: topic.title },
        ]}
      />
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
