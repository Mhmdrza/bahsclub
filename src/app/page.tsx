import Link from "next/link";
import { Target, Users, TrendingUp } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center sm:mb-24">
        <p className="eyebrow eyebrow-centered mb-5">{config.tagline}</p>
        <h1 className="mx-auto mb-5 max-w-3xl text-4xl font-extrabold leading-[1.4] sm:text-5xl sm:leading-[1.4]">
          {config.title}
        </h1>
        <div
          aria-hidden
          className="mx-auto mb-6 flex items-center justify-center gap-2"
        >
          <span className="w-10 border-t border-gold/60" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          <span className="w-10 border-t border-gold/60" />
        </div>
        <p className="mx-auto mb-9 max-w-xl text-lg leading-loose text-muted">
          {config.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
          >
            از کجا شروع کنم؟
          </Link>
          <Link
            href="/articles/what-is-judgment-testing"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-7 py-3 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
          >
            ایدهٔ اصلی چیست؟
          </Link>
        </div>
      </section>

      {/* The Hook: A Debate You Don't Have to Win */}
      <section className="mb-20 rounded-2xl border border-border bg-surface p-6 text-center shadow-sm sm:mb-24 sm:p-12">
        <p className="eyebrow eyebrow-centered mb-3">روش ما</p>
        <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl">
          بحثی که مجبور نیستی برنده‌اش شوی
        </h2>
        <blockquote className="mx-auto mb-8 max-w-xl border-r-2 border-gold pr-4 text-right leading-loose text-muted">
          در بیشتر بحث‌ها، هر طرف سعی می‌کند طرف مقابل را شکست دهد. ما کار
          متفاوتی می‌کنیم:{" "}
          <strong className="font-semibold text-foreground">
            یک باور را وسط می‌گذاریم و همه با هم محکش می‌زنیم.
          </strong>{" "}
          رقیب شما آدم روبه‌رویتان نیست — موضوع تحت فشار، خودِ قضاوت است.
        </blockquote>
        <div className="mx-auto grid max-w-2xl gap-3 text-sm sm:grid-cols-3">
          {[
            {
              icon: Target,
              title: "محک بزن",
              desc: "یک باور بیاور و ببین از چند جهت مختلف می‌تواند جان سالم به در ببرد",
            },
            {
              icon: Users,
              title: "همکاری کن",
              desc: "دیگران کمکت می‌کنند ضعف‌های استدلالت را پیدا کنی، نه اینکه شکستت دهند",
            },
            {
              icon: TrendingUp,
              title: "قوی‌تر شو",
              desc: "با یک قضاوت به‌روزرسانی‌شده بیرون برو — حتی اگر نتیجه‌ات عوض نشده باشد",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-background p-5"
            >
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mb-1 font-semibold">{item.title}</p>
              <p className="text-xs leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Learning Path */}
      {featuredLesson && (
        <div className="mb-20 sm:mb-24">
          <HomeStartSection lesson={featuredLesson} />
        </div>
      )}

      {/* All Learning Paths */}
      {lessons.length > 0 && (
        <section className="mb-20 sm:mb-24">
          <div className="mb-2 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">یادگیری</p>
              <h2 className="text-2xl font-extrabold">مسیرهای یادگیری</h2>
            </div>
            <Link
              href="/learn"
              className="shrink-0 text-sm font-medium text-accent hover:underline"
            >
              همه مسیرها
            </Link>
          </div>
          <div className="mb-8 w-full border-t border-border" aria-hidden />
          <div className="grid gap-4 sm:grid-cols-2">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>
      )}

      {/* Daily Picks */}
      <section className="mb-20 sm:mb-24">
        <p className="eyebrow mb-2">پیشنهاد روز</p>
        <h2 className="mb-2 text-2xl font-extrabold">امروز چی یاد بگیرم؟</h2>
        <div className="mb-8 w-full border-t border-border" aria-hidden />
        <div className="grid gap-4 sm:grid-cols-3">
          {config.homeSlots.map((slot) => {
            const article = homeSlots[slot.type];
            if (!article) return null;
            return (
              <div key={slot.type}>
                <p className="mb-2 text-xs font-semibold text-gold">
                  {slot.label}
                </p>
                <ArticleCard article={article} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Principles / Club Rules */}
      <section className="mb-20 sm:mb-24">
        <p className="eyebrow mb-2">فرهنگ ما</p>
        <h2 className="mb-2 text-2xl font-extrabold">قوانین باشگاه</h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          این اصول، فرهنگ بحث‌کلاب را می‌سازند — نه فقط برای جلسه‌ها، که برای هر
          گفت‌وگویی
        </p>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.principles.map((principle, i) => (
            <li
              key={principle.title}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm"
            >
              <span
                aria-hidden
                className="mb-3 block text-sm font-bold text-gold"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 font-semibold">{principle.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {principle.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Session Format Preview */}
      <section className="mb-20 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:mb-24 sm:p-10">
        <p className="eyebrow mb-2">ساختار جلسه</p>
        <h2 className="mb-2 text-2xl font-extrabold">یک جلسه چطور می‌گذرد؟</h2>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted">
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
              className="flex gap-3 rounded-xl border border-border bg-background p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 text-xs font-bold text-accent">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs leading-relaxed text-muted">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Live Practice CTA */}
      <section className="border-t border-border pt-10 text-center sm:pt-12">
        <p className="eyebrow eyebrow-centered mb-3">تمرین زنده</p>
        <h2 className="mb-2 text-xl font-extrabold">
          {config.livePractice.title}
        </h2>
        <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-muted">
          {config.livePractice.description}
        </p>
        <Link
          href={config.livePractice.href}
          className="text-sm font-semibold text-gold hover:underline"
        >
          رفتن به تمرین‌ها ←
        </Link>
      </section>
    </div>
  );
}
