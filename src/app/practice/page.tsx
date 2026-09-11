import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig, getPracticeArticles } from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { ExerciseBlock } from "@/components/ExerciseBlock";

export const metadata: Metadata = {
  title: "تمرین‌ها",
  description: "تمرین‌های عملی برای محک زدن باورها، تقویت استدلال، و یادگیری مهارت‌های سواد قضاوت.",
};

export default function PracticePage() {
  const config = getSiteConfig();
  const practices = getPracticeArticles();
  const interactive = practices.filter((article) => article.exercise);
  const rest = practices.filter((article) => !article.exercise);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "تمرین‌ها" }]}
      />
      <h1 className="mb-2 text-3xl font-bold">تمرین‌ها</h1>
      <p className="mb-8 max-w-2xl text-muted">
        تمرین‌های کوتاه و عملی برای تقویت مهارت‌های سواد قضاوت: از محک زدن
        باورهای شخصی تا تشخیص تاکتیک‌های انحرافی در گفت‌وگو.
      </p>

      <section className="mb-10 rounded-lg border border-border bg-surface p-6">
        <h2 className="mb-2 text-lg font-bold">{config.livePractice.title}</h2>
        <p className="text-sm text-muted">{config.livePractice.description}</p>
      </section>

      {interactive.map((article) => (
        <article key={article.slug} className="mb-10">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold">
              <Link
                href={`/articles/${article.slug}`}
                className="hover:text-accent"
              >
                {article.title}
              </Link>
            </h2>
            <Link
              href={`/articles/${article.slug}`}
              className="shrink-0 text-sm font-semibold text-accent hover:underline"
            >
              متن کامل ←
            </Link>
          </div>
          {article.exercise && <ExerciseBlock exercise={article.exercise} />}
        </article>
      ))}

      {rest.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
