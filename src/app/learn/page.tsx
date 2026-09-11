import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  ShieldAlert,
  Dumbbell,
  ArrowLeft,
  Layers,
  Search,
} from "lucide-react";
import { LADDER } from "@/lib/ladder";
import {
  getPublishedLessons,
  getPublishedTopics,
  getPracticeArticles,
  getTacticArticles,
} from "@/lib/content";
import { LessonCard } from "@/components/LessonCard";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "آموزش و یادگیری",
  description:
    "مرکز آموزش جامع حرف‌کلاب — مسیرهای یادگیری، مقالات، تاکتیک‌های انحرافی و تمرین‌های تفکر نقاد.",
};

export default function LearnPage() {
  const lessons = getPublishedLessons();
  const topics = getPublishedTopics();
  const practiceArticles = getPracticeArticles().slice(0, 4);
  const tacticArticles = getTacticArticles().slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "آموزش و یادگیری" }]}
      />

      {/* Header Hub Banner */}
      <div className="mb-12 rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">مرکز آموزش و مهارت‌آموزی</p>
            <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
              چگونه کیفیت گفت‌وگوهایمان را بالا ببریم؟
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              اینجا تمام منابع آموزشی حرف‌کلاب گردآوری شده است: از مسیرهای آموزشی گام‌به‌گام برای تقویت سواد قضاوت تا راهنمای خنثی‌سازی مغالطه‌ها و تمرین‌های تعاملی.
            </p>
          </div>
          <Link
            href="/articles"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-accent/40 bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <Search className="h-4 w-4 text-accent" />
            جستجو در کتابخانه مقالات
          </Link>
        </div>

        {/* Quick Nav Anchor Pills */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6 text-xs">
          <a
            href="#ladder"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            نردبان یادگیری
          </a>
          <a
            href="#paths"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            مسیرهای یادگیری
          </a>
          <a
            href="#topics"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            موضوعات و سرفصل‌ها
          </a>
          <a
            href="#tactics"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            تاکتیک‌ها و مغالطه‌ها
          </a>
          <a
            href="#practice"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            تمرین‌های عملی
          </a>
        </div>
      </div>

      {/* 0. Learning Ladder */}
      <section id="ladder" className="mb-16 scroll-mt-20 sm:mb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Layers className="h-5 w-5" />
              <p className="eyebrow">نقشهٔ رشد</p>
            </div>
            <h2 className="text-2xl font-extrabold">کجای مسیر ایستاده‌ای؟</h2>
          </div>
          <Link
            href="/ladder"
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            نردبان کامل و آزمون ←
          </Link>
        </div>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          آموزش‌های ما سه لایه دارند که روی هم ساخته می‌شوند. اگر نمی‌دانی از کجا شروع
          کنی، با آزمون کوتاه نردبان، نقطهٔ شروع خودت را پیدا کن.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {LADDER.map((rung) => (
            <Link
              key={rung.id}
              href={`/ladder#rung-${rung.id}`}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow"
            >
              <span className="mb-3 inline-flex w-fit items-center justify-center rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-bold text-accent">
                {rung.step}
              </span>
              <h3 className="mb-1 font-bold group-hover:text-accent">
                {rung.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                {rung.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 1. Learning Paths Section */}
      <section id="paths" className="mb-16 sm:mb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Compass className="h-5 w-5" />
              <p className="eyebrow">نقشه راه</p>
            </div>
            <h2 className="text-2xl font-extrabold">مسیرهای یادگیری گام‌به‌گام</h2>
          </div>
        </div>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          دوره‌های آموزشی ساختاریافته که هر کدام یک مهارت مشخص را از صفر تا صد پوشش می‌دهند. پیشنهاد می‌کنیم از مسیر «سواد قضاوت» شروع کنید.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>

      {/* 2. Topics / Categories Overview */}
      <section id="topics" className="mb-16 sm:mb-20">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gold">
            <BookOpen className="h-5 w-5" />
            <p className="eyebrow">دسته‌بندی‌ها</p>
          </div>
          <h2 className="text-2xl font-extrabold">سرفصل‌های آموزشی</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
            >
              <div>
                <h3 className="mb-2 font-bold text-foreground group-hover:text-accent">
                  {topic.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted">
                  {topic.description}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                مشاهده مقالات این سرفصل
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Tactics & Fallacies */}
      <section id="tactics" className="mb-16 sm:mb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <ShieldAlert className="h-5 w-5" />
              <p className="eyebrow">دفاع فکری</p>
            </div>
            <h2 className="text-2xl font-extrabold">تاکتیک‌های انحرافی و مغالطه‌ها</h2>
          </div>
          <Link
            href="/topics/tactics"
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            همه تاکتیک‌ها ←
          </Link>
        </div>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          تکنیک‌هایی که بحث را ناخودآگاه یا تعمدی از شواهد دور می‌کنند، و روش‌های آرام و بدون تنش برای خنثی کردن آن‌ها.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tacticArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* 4. Practical Exercises */}
      <section id="practice" className="mb-16 sm:mb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <Dumbbell className="h-5 w-5" />
              <p className="eyebrow">کارگاه عملی</p>
            </div>
            <h2 className="text-2xl font-extrabold">تمرین‌ها و آزمایش‌های فردی</h2>
          </div>
          <Link
            href="/practice"
            className="shrink-0 text-sm font-semibold text-gold hover:underline"
          >
            همه تمرین‌ها ←
          </Link>
        </div>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          مهارت بحث فقط با خواندن به دست نمی‌آید. این تمرین‌ها عضلهٔ تفکر نقاد و صداقت فکری شما را تقویت می‌کنند.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {practiceArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* 5. Direct Link to Search Library */}
      <section className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
        <h3 className="mb-2 text-xl font-bold">به دنبال موضوع یا مقالهٔ خاصی هستید؟</h3>
        <p className="mx-auto mb-6 max-w-lg text-sm text-muted">
          می‌توانید در میان بیش از ۵۰ مقاله، تمرین و تاکتیک با استفاده از فیلترهای موضوعی و سطح دشواری جستجو کنید.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          <Search className="h-4 w-4" />
          ورود به موتور جستجوی مقالات
        </Link>
      </section>
    </div>
  );
}
