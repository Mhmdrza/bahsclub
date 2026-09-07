"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useCompletedSlugs } from "@/hooks/useCompletedSlugs";
import { getLastPosition } from "@/lib/progress";

interface HomeStartSectionProps {
  lesson: Lesson;
}

export function HomeStartSection({ lesson }: HomeStartSectionProps) {
  const stepSlugs = lesson.steps;
  const validSlugs = new Set(lesson.resolvedSteps.map((a) => a.slug));
  const { completed, total } = useLessonProgress(stepSlugs, validSlugs);
  const completedSlugs = useCompletedSlugs();

  const last = typeof window !== "undefined" ? getLastPosition() : {};

  const hasProgress = completed > 0 && completed < total;
  const firstIncomplete =
    lesson.resolvedSteps.find((a) => !completedSlugs.has(a.slug)) ??
    lesson.resolvedSteps[0];
  const targetSlug = hasProgress
    ? last.lessonSlug === lesson.slug && last.articleSlug
      ? last.articleSlug
      : firstIncomplete?.slug
    : lesson.resolvedSteps[0]?.slug;

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10">
      <p className="eyebrow mb-2">نقطهٔ شروع</p>
      <h2 className="mb-3 text-2xl font-extrabold">
        {hasProgress ? "ادامه بده" : "از اینجا شروع کن"}
      </h2>
      <p className="mb-6 max-w-2xl leading-relaxed text-muted">
        {hasProgress
          ? `در مسیر «${lesson.title}» هستید. می‌توانید از جایی که مانده‌اید ادامه دهید.`
          : "با مسیر سواد قضاوت، یاد بگیر چطور باورهایت را محک بزنی، استدلالت را قوی‌تر کنی، و بدون دشمنی مخالفت کنی."}
      </p>
      <ProgressBar completed={completed} total={total} className="mb-6" />
      {targetSlug && (
        <Link
          href={`/articles/${targetSlug}?lesson=${lesson.slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          {hasProgress ? "ادامه مسیر یادگیری" : "شروع مسیر یادگیری"}
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </section>
  );
}
