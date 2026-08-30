"use client";

import { ProgressBar } from "./ProgressBar";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { cn } from "@/lib/utils";

interface LessonProgressDisplayProps {
  stepSlugs: string[];
  validSlugs: string[];
  className?: string;
}

export function LessonProgressDisplay({
  stepSlugs,
  validSlugs,
  className,
}: LessonProgressDisplayProps) {
  const validSet = new Set(validSlugs);
  const { completed, total } = useLessonProgress(stepSlugs, validSet);

  return (
    <ProgressBar
      completed={completed}
      total={total}
      className={cn(className)}
    />
  );
}
