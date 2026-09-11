import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, GraduationCap, Layers } from "lucide-react";
import { LADDER } from "@/lib/ladder";
import { getLessonBySlug, getPublishedArticles } from "@/lib/content";
import { LadderAssessment } from "@/components/LadderAssessment";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatPersianNumber, levelLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "نردبان یادگیری",
  description:
    "کجای مسیر یادگیری گفت‌وگو ایستاده‌اید؟ سه مرحله — پایه، مقاومت، تسلط — و این که قدم بعدی شما چیست.",
};

export default function LadderPage() {
  const bySlug = new Map(getPublishedArticles().map((a) => [a.slug, a]));
  const lessonTitles = Object.fromEntries(
    LADDER.flatMap((r) => r.lessonSlugs).map((slug) => [
      slug,
      getLessonBySlug(slug)?.title ?? "شروع مسیر این مرحله",
    ])
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "نردبان یادگیری" }]}
      />

      {/* Header */}
      <section className="mb-12 rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <div className="flex items-center gap-2 text-accent">
          <Layers className="h-5 w-5" />
          <p className="eyebrow">نقشهٔ رشد</p>
        </div>
        <h1 className="mt-3 mb-4 text-3xl font-extrabold sm:text-4xl">
          نردبان یادگیری: هر سطح زیربنای سطح بعدی
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          گفت‌وگو یک مهارت یکپارچه نیست؛ سه لایه دارد که روی هم ساخته می‌شوند. اول یاد
          می‌گیری خوب حرف بزنی، بعد یاد می‌گیری در تعارض و نفوذ گم نشوی، و آخر سر یاد
          می‌گیری چهارچوب و روایت را ببینی و خنثی کنی. با آزمون کوتاه زیر بفهم کجای
          نردبان ایستاده‌ای و قدم بعدی‌ات چیست.
        </p>
      </section>

      <div className="mb-16">
        <LadderAssessment lessonTitles={lessonTitles} />
      </div>

      {/* Rungs */}
      <div className="space-y-16">
        {LADDER.map((rung, index) => (
          <section
            key={rung.id}
            id={`rung-${rung.id}`}
            className="scroll-mt-24"
          >
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-light text-sm font-bold text-accent">
                {formatPersianNumber(index + 1)}
              </span>
              <div>
                <p className="eyebrow mb-1">{rung.step}</p>
                <h2 className="text-2xl font-extrabold sm:text-3xl">{rung.title}</h2>
                <p className="mt-1 text-sm font-medium text-muted">
                  {rung.subtitle}
                </p>
              </div>
            </div>

            <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted">
              {rung.description}
            </p>

            {/* Competencies */}
            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              {rung.competencies.map((c) => (
                <div
                  key={c}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{c}</span>
                </div>
              ))}
            </div>

            {/* Lessons */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2 text-accent">
                <GraduationCap className="h-4 w-4" />
                <p className="eyebrow">مسیرهای گام‌به‌گام این مرحله</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {rung.lessonSlugs.map((slug) => {
                  const lesson = getLessonBySlug(slug);
                  if (!lesson) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/learn/${slug}`}
                      className="group rounded-xl border border-accent/30 bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow"
                    >
                      <h3 className="mb-1.5 font-bold group-hover:text-accent">
                        {lesson.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted">
                        {lesson.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                        {formatPersianNumber(lesson.resolvedSteps.length)} درس
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-6">
              {rung.modules.map((module) => (
                <div key={module.label}>
                  <h3 className="mb-3 text-sm font-bold text-foreground">
                    {module.label}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {module.slugs.map((slug) => {
                      const article = bySlug.get(slug);
                      if (!article) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/articles/${slug}`}
                          className="group flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-accent/40"
                        >
                          <span className="truncate text-sm group-hover:text-accent">
                            {article.title}
                          </span>
                          <span className="shrink-0 text-xs text-muted">
                            {levelLabel(article.level)} ·{" "}
                            {formatPersianNumber(article.readingTime)}د
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="mt-16 border-t border-border pt-12 text-center">
        <h2 className="mb-3 text-2xl font-extrabold">
          هنوز مطمئن نیستی از کجا شروع کنی؟
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-muted">
          از مسیر پیشنهادی «سواد قضاوت» شروع کن؛ بعد از آن، نردبان خودش راه را نشان
          می‌دهد.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          مشاهده همهٔ مسیرها
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
