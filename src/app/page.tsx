import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Crown,
  Dumbbell,
  Shield,
  Swords,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { LessonCard } from "@/components/LessonCard";
import { ArticleCard } from "@/components/ArticleCard";
import {
  getPracticeArticles,
  getPublishedLessons,
  getPublishedTopics,
  getSiteConfig,
} from "@/lib/content";
import { LADDER } from "@/lib/ladder";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  description: getSiteConfig().description,
});

const LADDER_META = [
  {
    id: "paye",
    icon: Shield,
    warrior: "گارد و ایستادن",
    line: "مثل نفس و قدم رزمی‌کار؛ بدون این پایه هر تکنیکی فرو می‌ریزد.",
  },
  {
    id: "nabard",
    icon: Swords,
    warrior: "دفاع و ضدحمله",
    line: "مثل دفاع در نبرد؛ وقتی بحث داغ شد گم نشوی و به مسیر برگردی.",
  },
  {
    id: "ghodrat-kalam",
    icon: Crown,
    warrior: "ذهن و میدان",
    line: "مثل استراتژی جنگجو؛ کسی که معنا را تعریف می‌کند میدان را می‌برد.",
  },
];

export default function HomePage() {
  const lessons = getPublishedLessons();
  const topics = getPublishedTopics();
  const practice = getPracticeArticles().slice(0, 4);

  const levels = LADDER.map((rung) => ({
    ...rung,
    meta: LADDER_META.find((m) => m.id === rung.id)!,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <HeroSection />

      {/* 2. Three-level ladder: پایه / نبرد / قدرت کلام */}
      <section className="mb-20 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">
            نقشهٔ رشد — مثل یک رزمی‌کار
          </p>
          <h2 className="text-3xl font-extrabold">
            سه سطح: پایه، نبرد، قدرت کلام
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            اول گارد می‌گیری، بعد دفاع و ضدحمله را یاد می‌گیری، آخر میدان معنا را
            تعریف می‌کنی. ببین کجای مسیری و قدم بعدی‌ات چیست.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {levels.map(({ id, step, title, subtitle, meta }) => {
            const Icon = meta.icon;
            return (
              <Link
                key={id}
                href={`/ladder#rung-${id}`}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow"
              >
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="eyebrow mb-1">
                  {step} — {meta.warrior}
                </span>
                <h3 className="mb-1 font-semibold leading-snug group-hover:text-accent">
                  {title}
                </h3>
                <p className="mb-2 text-xs font-medium text-muted">{subtitle}</p>
                <p className="mb-4 text-xs leading-relaxed text-muted">
                  {meta.line}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  دیدن مرحله در نردبان
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Learning paths */}
      <section id="paths" className="mb-20 sm:mb-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <Compass className="h-5 w-5" />
              <p className="eyebrow">مسیرهای گام‌به‌گام</p>
            </div>
            <h2 className="text-2xl font-extrabold">از کجا شروع می‌کنی؟</h2>
          </div>
          <Link
            href="/learn"
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            همهٔ مسیرها ←
          </Link>
        </div>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          هر مسیر یک مهارت را قدم‌به‌قدم می‌سازد. پیشنهاد ما برای شروع «سواد قضاوت»
          است — ولی تو ترتیب و سرعت را انتخاب می‌کنی.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>

      {/* 3b. Self-check CTA */}
      <section className="mb-20 sm:mb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-accent/30 bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="eyebrow mb-1">کجای مسیری؟</p>
            <h3 className="text-lg font-bold">
              با چند سؤال کوتاه، نقطهٔ شروع خودت را پیدا کن
            </h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              آزمون کوتاه نردبان می‌گوید از پایه شروع کنی، به نبرد بروی، یا وقتش
              رسیده به قدرت کلام فکر کنی.
            </p>
          </div>
          <Link
            href="/ladder#assessment"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent/90"
          >
            پیدا کردن نقطهٔ شروع
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. Topics */}
      <section className="mb-20 sm:mb-24">
        <div className="mb-6 flex items-center gap-2 text-gold">
          <BookOpen className="h-5 w-5" />
          <p className="eyebrow">سرفصل‌ها</p>
        </div>
        <h2 className="mb-6 text-2xl font-extrabold">هر موضوع، یک دریچه</h2>
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
                مقالات این سرفصل
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Practice */}
      {practice.length > 0 && (
        <section className="mb-20 sm:mb-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold">
                <Dumbbell className="h-5 w-5" />
                <p className="eyebrow">کارگاه عملی</p>
              </div>
              <h2 className="text-2xl font-extrabold">خواندن فقط شروع ماجراست</h2>
            </div>
            <Link
              href="/practice"
              className="shrink-0 text-sm font-semibold text-gold hover:underline"
            >
              همهٔ تمرین‌ها ←
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
            این تمرین‌های کوتاه خوانده‌ها را به عمل می‌رسانند — کمی نوشتن، کمی
            بازنگری. هر وقت آماده بودی، یک قدم بردار.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {practice.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Final CTA */}
      <section className="border-t border-border pt-12 text-center sm:pt-16">
        <p className="eyebrow eyebrow-centered mb-3">گام بعدی</p>
        <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl">
          قدم بعدی را تو انتخاب می‌کنی
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted">
          با یک درس کوتاه شروع کن یا اول کل نقشه را ببین. هر مقاله یک ایدهٔ کاربردی
          برای گفت‌وگوهای واقعی توست.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
          >
            شروع مسیر یادگیری
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50"
          >
            کاوش کتابخانه
          </Link>
        </div>
        <p className="mt-8 text-xs text-muted">
          دوست داری ایده‌هایت را در گفت‌وگوی واقعی امتحان کنی؟{" "}
          <Link href="/club" className="font-semibold text-accent hover:underline">
            نگاهی به بحث‌کلاب بینداز
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
