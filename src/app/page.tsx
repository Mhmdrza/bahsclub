import Link from "next/link";
import {
  getSiteConfig,
  getPublishedLessons,
  getFeaturedLesson,
  getHomeSlotArticles,
} from "@/lib/content";
import { LessonCard } from "@/components/LessonCard";
import { ArticleCard } from "@/components/ArticleCard";
import { HomeStartSection } from "@/components/HomeStartSection";

export default function HomePage() {
  const config = getSiteConfig();
  const lessons = getPublishedLessons();
  const featuredLesson = getFeaturedLesson();
  const homeSlots = getHomeSlotArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-10">
        <p className="mb-2 text-sm font-medium text-accent">{config.tagline}</p>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{config.title}</h1>
        <p className="max-w-2xl text-lg text-muted">{config.description}</p>
      </section>

      {featuredLesson && (
        <div className="mb-12">
          <HomeStartSection lesson={featuredLesson} />
        </div>
      )}

      {lessons.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">مسیرهای یادگیری</h2>
            <Link href="/learn" className="text-sm text-accent hover:underline">
              همه مسیرها
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">امروز چه یاد بگیرم؟</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {config.homeSlots.map((slot) => {
            const article = homeSlots[slot.type];
            if (!article) return null;
            return (
              <div key={slot.type}>
                <p className="mb-2 text-xs font-medium text-muted">
                  {slot.label}
                </p>
                <ArticleCard article={article} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">بحث خوب چه شکلی است؟</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.principles.map((principle) => (
            <li
              key={principle.title}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <h3 className="mb-2 font-semibold">{principle.title}</h3>
              <p className="text-sm text-muted">{principle.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="mb-2 text-lg font-bold">{config.livePractice.title}</h2>
        <p className="mb-4 text-sm text-muted">
          {config.livePractice.description}
        </p>
        <Link
          href={config.livePractice.href}
          className="text-sm font-medium text-accent hover:underline"
        >
          رفتن به تمرین‌ها ←
        </Link>
      </section>
    </div>
  );
}
