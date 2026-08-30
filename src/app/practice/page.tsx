import type { Metadata } from "next";
import { getSiteConfig, getPracticeArticles } from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "تمرین‌ها",
  description: "تمرین‌های عملی برای محک زدن باورها، تقویت استدلال، و یادگیری مهارت‌های سواد قضاوت.",
};

export default function PracticePage() {
  const config = getSiteConfig();
  const practices = getPracticeArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
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

      <div className="grid gap-4 sm:grid-cols-2">
        {practices.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}