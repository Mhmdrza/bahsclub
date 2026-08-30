import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticleBySlug,
  getArticleSlugs,
  getLessonsForArticle,
  getLessonNavigation,
  getRelatedArticles,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TableOfContents } from "@/components/TableOfContents";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PrevNextNav } from "@/components/PrevNextNav";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { ExerciseBlock } from "@/components/ExerciseBlock";
import { ArticleCard } from "@/components/ArticleCard";
import { formatPersianNumber, levelLabel } from "@/lib/utils";
import { Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lesson: lessonSlug } = await searchParams;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const lessons = getLessonsForArticle(slug);
  const nav = lessonSlug
    ? getLessonNavigation(lessonSlug, slug)
    : { prev: undefined, next: undefined };
  const related = getRelatedArticles(article);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        <article className="min-w-0 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "خانه", href: "/" },
              { label: "مقاله‌ها", href: "/articles" },
              { label: article.title },
            ]}
          />

          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-bold">{article.title}</h1>
            <p className="mb-4 text-lg text-muted">{article.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>سطح: {levelLabel(article.level)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {formatPersianNumber(article.readingTime)} دقیقه مطالعه
              </span>
              <span>دسته: {article.category}</span>
            </div>
            {lessons.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="text-muted">بخشی از:</span>
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/learn/${lesson.slug}`}
                    className="rounded-md bg-accent-light px-2 py-0.5 text-accent hover:underline"
                  >
                    {lesson.title}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <TableOfContents headings={article.headings} variant="mobile" />

          <MarkdownContent content={article.content} />

          {article.exercise && (
            <ExerciseBlock exercise={article.exercise} />
          )}

          <div className="mt-8">
            <MarkCompleteButton slug={slug} lessonSlug={lessonSlug} />
          </div>

          {(nav.prev || nav.next) && (
            <PrevNextNav
              prev={nav.prev}
              next={nav.next}
              lessonSlug={lessonSlug}
            />
          )}

          {related.length > 0 && (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="mb-4 text-lg font-semibold">مقالات مرتبط</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <ArticleCard key={item.slug} article={item} />
                ))}
              </div>
            </section>
          )}
        </article>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents headings={article.headings} variant="desktop" />
          </div>
        </div>
      </div>
    </div>
  );
}
