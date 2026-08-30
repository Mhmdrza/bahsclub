"use client";

import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { formatPersianNumber } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";
import { useLessonProgress } from "@/hooks/useLessonProgress";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const stepSlugs = lesson.steps;
  const validSlugs = new Set(lesson.resolvedSteps.map((a) => a.slug));
  const { completed, total } = useLessonProgress(stepSlugs, validSlugs);

  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="group block rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs text-muted">
          {formatPersianNumber(lesson.resolvedSteps.length)} درس
        </span>
        {lesson.featured && (
          <span className="rounded-md bg-accent-light px-2 py-0.5 text-xs text-accent">
            پیشنهادی
          </span>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold group-hover:text-accent">
        {lesson.title}
      </h3>
      <p className="mb-4 text-sm text-muted">{lesson.description}</p>
      <ProgressBar completed={completed} total={total} />
    </Link>
  );
}
