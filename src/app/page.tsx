import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Dumbbell,
  Ear,
  HelpCircle,
  Layers,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { LessonCard } from "@/components/LessonCard";
import { ArticleCard } from "@/components/ArticleCard";
import {
  getArticleBySlug,
  getPracticeArticles,
  getPublishedLessons,
  getPublishedTopics,
  getSiteConfig,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  description: getSiteConfig().description,
});

const CONVERSATION_SKILLS = [
  {
    slug: "asking-better-questions",
    icon: HelpCircle,
    label: "پرسیدن",
    line: "سؤال شفاف‌کننده، به‌جای حمله.",
  },
  {
    slug: "steelman-opponent",
    icon: Ear,
    label: "شنیدن",
    line: "اول قوی‌ترین نسخهٔ حرف طرف مقابل را بفهم.",
  },
  {
    slug: "emotional-persuasion",
    icon: Sparkles,
    label: "جدا کردن",
    line: "تفکیک احساس از ادعا و شناخت دستکاری.",
  },
  {
    slug: "responding-to-tactics",
    icon: MessageSquare,
    label: "برگرداندن",
    line: "بازگرداندن آرام گفت‌وگو به مسیر، وقتی منحرف می‌شود.",
  },
];

export default function HomePage() {
  const lessons = getPublishedLessons();
  const topics = getPublishedTopics();
  const practice = getPracticeArticles().slice(0, 4);

  const skills = CONVERSATION_SKILLS.map((skill) => ({
    ...skill,
    article: getArticleBySlug(skill.slug),
  })).filter((skill) => skill.article);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <HeroSection />

      {/* 2. Core talking skills */}
      <section className="mb-20 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">مهارت‌های پایه</p>
          <h2 className="text-3xl font-extrabold">چهار مهارت برای گفت‌وگوهایی که به جایی می‌رسند</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            حرف زدن را در کودکی یاد گرفتیم؛ گفت‌وگو تمرین می‌خواهد. این چهار مهارت،
            پایهٔ گفت‌وگوهای سازنده‌اند — از هر کدام که برایت جالب‌تر است شروع کن.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map(({ slug, icon: Icon, label, line, article }) => (
            <Link
              key={slug}
              href={`/articles/${slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow"
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <span className="eyebrow mb-1">{label}</span>
              <h3 className="mb-2 font-semibold leading-snug group-hover:text-accent">
                {article!.title}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-muted">{line}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
                مطالعه مقاله
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
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

            {/* 1b. Learning ladder */}
      <section className="mb-20 sm:mb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-accent/30 bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow mb-1">نقشهٔ رشد</p>
              <h3 className="text-lg font-bold">
                نردبان یادگیری: سه مرحله، یک مسیر روشن
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                ببین کجای مسیری و قدم بعدی‌ات چیست — با چند سؤال کوتاه، نقطهٔ شروع
                خودت را پیدا کن.
              </p>
            </div>
          </div>
          <Link
            href="/ladder"
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
