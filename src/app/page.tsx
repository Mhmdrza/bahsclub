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
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <p className="mb-3 text-sm font-medium text-accent">{config.tagline}</p>
        <h1 className="mb-4 text-3xl font-bold sm:text-5xl">{config.title}</h1>
        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted">
          {config.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-fg hover:bg-accent/90"
          >
            از کجا شروع کنم؟
          </Link>
          <Link
            href="/articles/what-is-judgment-testing"
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-surface"
          >
            ایدهٔ اصلی چیست؟
          </Link>
        </div>
      </section>

      {/* The Hook: A Debate You Don't Have to Win */}
      <section className="mb-16 rounded-xl border border-border bg-surface p-6 sm:p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
          بحثی که مجبور نیستی برنده‌اش شوی
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-muted leading-relaxed">
          در بیشتر بحث‌ها، هر طرف سعی می‌کند طرف مقابل را شکست دهد. ما کار
          متفاوتی می‌کنیم: <strong>یک باور را وسط می‌گذاریم و همه با هم محکش
          می‌زنیم.</strong> رقیب شما آدم روبه‌رویتان نیست — موضوع تحت فشار،
          خودِ قضاوت است.
        </p>
        <div className="mx-auto grid max-w-2xl gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="mb-1 font-semibold">🎯 محک بزن</p>
            <p className="text-muted text-xs leading-relaxed">
              یک باور بیاور و ببین از چند جهت مختلف می‌تواند جان سالم به در ببرد
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-1 font-semibold">🤝 همکاری کن</p>
            <p className="text-muted text-xs leading-relaxed">
              دیگران کمکت می‌کنند ضعف‌های استدلالت را پیدا کنی، نه اینکه
              شکستت دهند
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-1 font-semibold">📈 قوی‌تر شو</p>
            <p className="text-muted text-xs leading-relaxed">
              با یک قضاوت به‌روزرسانی‌شده بیرون برو — حتی اگر نتیجه‌ات عوض نشده
              باشد
            </p>
          </div>
        </div>
      </section>

      {/* Featured Learning Path */}
      {featuredLesson && (
        <div className="mb-16">
          <HomeStartSection lesson={featuredLesson} />
        </div>
      )}

      {/* All Learning Paths */}
      {lessons.length > 0 && (
        <section className="mb-16">
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

      {/* Daily Picks */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold">امروز چی یاد بگیرم؟</h2>
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

      {/* Principles / Club Rules */}
      <section className="mb-16">
        <h2 className="mb-2 text-xl font-bold">قوانین باشگاه</h2>
        <p className="mb-6 text-sm text-muted">
          این اصول، فرهنگ بحث‌کلاب را می‌سازند — نه فقط برای جلسه‌ها، که برای هر
          گفت‌وگویی
        </p>
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

      {/* Session Format Preview */}
      <section className="mb-16 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <h2 className="mb-2 text-xl font-bold">یک جلسه چطور می‌گذرد؟</h2>
        <p className="mb-6 text-sm text-muted max-w-xl">
          به جلسه‌های ما «جلسهٔ بحث» می‌گوییم. ساختارش این است:
        </p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "۱", title: "ارائه", desc: "باورت را بگو و بگو چقدر مطمئنی" },
            { step: "۲", title: "شفاف‌سازی", desc: "فقط سؤال بپرس، نقد نکن" },
            { step: "۳", title: "قوی‌ترین روایت", desc: "بهترین نسخهٔ ادعا را بساز" },
            { step: "۴", title: "نقشهٔ استدلال", desc: "شواهد، پیش‌فرض‌ها، شکاف‌ها" },
            { step: "۵", title: "آزمون", desc: "از زوایای مختلف محک بزن" },
            { step: "۶", title: "واژگونی", desc: "خودت علیه باورت استدلال کن" },
            { step: "۷", title: "بازبینی", desc: "چه تغییری کرد؟ چقدر مطمئنی؟" },
            { step: "۸", title: "مرور فرایند", desc: "خودِ بحث سازنده بود؟" },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-3 rounded-lg border border-border p-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Live Practice CTA */}
      <section className="rounded-lg border border-border bg-surface p-6 text-center">
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