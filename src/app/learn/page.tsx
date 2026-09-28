import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Dumbbell,
  Search,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getPublishedLessons } from "@/lib/content";
import { LessonCard } from "@/components/LessonCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = pageMetadata({
  path: "/learn",
  title: "آموزش و یادگیری",
  description:
    "مرکز آموزش جامع بحث‌کلاب — مسیرهای یادگیری، مقالات، تاکتیک‌های انحرافی و تمرین‌های تفکر نقاد.",
});

export default function LearnPage() {
  const lessons = getPublishedLessons();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 wrap-anywhere sm:px-6 sm:py-12">
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
              اینجا تمام منابع آموزشی بحث‌کلاب گردآوری شده است: از مسیرهای آموزشی گام‌به‌گام برای تقویت سواد قضاوت تا راهنمای خنثی‌سازی مغالطه‌ها و تمرین‌های تعاملی.
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
            href="#paths"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            مسیرهای یادگیری
          </a>
          <a
            href="#ladder"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            نردبان قدرت کلام
          </a>
          <a
            href="#library"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            کتابخانه
          </a>
          <a
            href="#practice"
            className="rounded-full border border-border bg-background px-3.5 py-1.5 font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            تمرین‌های عملی
          </a>
        </div>
      </div>

      {/* 0. Ladder pointer — placement lives on /ladder */}
      <section id="ladder" className="mb-16 scroll-mt-20 sm:mb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-accent/30 bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="eyebrow mb-1">نقشهٔ رشد</p>
            <h2 className="text-xl font-extrabold">جای خودت را نمی‌دانی؟</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              با آزمون کوتاه نردبان قدرت کلام — پایه، نبرد، قدرت کلام — نقطهٔ
              شروع خودت را پیدا کن، بعد برای مسیر برگرد اینجا.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/ladder#assessment"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent/90"
            >
              رفتن به آزمون
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/ladder"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:border-accent/50"
            >
              دیدن هر سه سطح
            </Link>
          </div>
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

      {/* 2. Library pointer — articles, topics and tactics live in /articles */}
      <section id="library" className="mb-16 scroll-mt-20 sm:mb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow mb-1">کتابخانه</p>
              <h2 className="text-xl font-extrabold">
                دنبال مقاله یا موضوع خاصی هستی؟
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                همهٔ مقاله‌ها، تاکتیک‌ها و سرفصل‌ها با جست‌وجو و فیلتر موضوعی در
                کتابخانه‌اند — بیش از ۵۰ مطلب.
              </p>
            </div>
          </div>
          <Link
            href="/articles"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-accent/40 bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <Search className="h-4 w-4 text-accent" />
            ورود به کتابخانه
          </Link>
        </div>
      </section>

      {/* 3. Practice pointer — exercises live on /practice */}
      <section id="practice" className="mb-16 scroll-mt-20 sm:mb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent">
              <Dumbbell className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow mb-1">کارگاه عملی</p>
              <h2 className="text-xl font-extrabold">خواندن فقط شروع ماجراست</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                مهارت بحث فقط با خواندن به دست نمی‌آید — کمی نوشتن، کمی
                بازنگری.
              </p>
            </div>
          </div>
          <Link
            href="/practice"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent/90"
          >
            دیدن تمرین‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
