"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import {
  isArticleCompleted,
  markArticleComplete,
  unmarkArticleComplete,
  setLastPosition,
} from "@/lib/progress";

interface MarkCompleteButtonProps {
  slug: string;
  lessonSlug?: string;
}

export function MarkCompleteButton({
  slug,
  lessonSlug,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(() => isArticleCompleted(slug));

  const toggle = () => {
    if (completed) {
      unmarkArticleComplete(slug);
      setCompleted(false);
    } else {
      markArticleComplete(slug);
      if (lessonSlug) setLastPosition(lessonSlug, slug);
      setCompleted(true);
    }
    window.dispatchEvent(new Event("bahsclub:progress"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent/40"
      aria-pressed={completed}
    >
      {completed ? (
        <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden />
      ) : (
        <Circle className="h-4 w-4 text-muted" aria-hidden />
      )}
      {completed ? "تکمیل شده" : "علامت‌گذاری به‌عنوان تکمیل‌شده"}
    </button>
  );
}
