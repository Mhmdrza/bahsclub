"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { useCompletedSlugs } from "@/hooks/useCompletedSlugs";

interface LessonStepsListProps {
  lesson: Lesson;
}

export function LessonStepsList({ lesson }: LessonStepsListProps) {
  const stepSlugs = lesson.steps;
  const validSlugs = new Set(lesson.resolvedSteps.map((a) => a.slug));
  const { completed, total } = useLessonProgress(stepSlugs, validSlugs);
  const completedSlugs = useCompletedSlugs();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-accent-light/30 p-4">
        <p className="text-sm font-medium text-accent">هدف این مسیر</p>
        <p className="mt-1 text-sm">{lesson.milestone}</p>
      </div>

      <ol className="space-y-3">
        {lesson.resolvedSteps.map((article, index) => {
          const done = completedSlugs.has(article.slug);
          return (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}?lesson=${lesson.slug}`}
                className="flex items-start gap-4 rounded-lg border border-border bg-surface p-4 hover:border-accent/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{article.title}</h3>
                    {done ? (
                      <CheckCircle2
                        className="h-4 w-4 text-accent"
                        aria-label="تکمیل شده"
                      />
                    ) : (
                      <Circle className="h-4 w-4 text-muted" aria-hidden />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">{article.description}</p>
                  <p className="mt-2 text-xs text-muted">
                    {article.readingTime} دقیقه مطالعه
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {completed === total && total > 0 && (
        <div className="rounded-lg border border-accent/30 bg-accent-light p-5 text-center">
          <p className="font-semibold text-accent">تبریک! این مسیر را کامل کردید.</p>
          <p className="mt-1 text-sm text-muted">{lesson.milestone}</p>
        </div>
      )}
    </div>
  );
}
