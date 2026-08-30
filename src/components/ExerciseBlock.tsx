"use client";

import { useState } from "react";
import { Lightbulb, Eye, EyeOff } from "lucide-react";
import type { ExerciseData } from "@/lib/types";

export function ExerciseBlock({ exercise }: { exercise: ExerciseData }) {
  const [showHints, setShowHints] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <section
      aria-label="تمرین"
      className="my-8 rounded-lg border border-border bg-surface p-5"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Lightbulb className="h-5 w-5 text-accent" aria-hidden />
        تمرین
      </h2>
      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-1 font-medium text-muted">سناریو</p>
          <p>{exercise.scenario}</p>
        </div>
        <div>
          <p className="mb-1 font-medium text-muted">سؤال</p>
          <p>{exercise.question}</p>
        </div>
        {exercise.hints && exercise.hints.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-accent hover:underline"
            >
              {showHints ? "پنهان کردن راهنما" : "نمایش راهنما"}
            </button>
            {showHints && (
              <ul className="mt-2 list-disc pr-5 text-muted">
                {exercise.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div>
          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent/40"
            aria-expanded={showAnswer}
          >
            {showAnswer ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
            {showAnswer ? "پنهان کردن پاسخ" : "نمایش پاسخ"}
          </button>
          {showAnswer && (
            <div className="mt-4 space-y-3 rounded-md bg-background p-4">
              <div>
                <p className="mb-1 font-medium text-muted">پاسخ</p>
                <p>{exercise.answer}</p>
              </div>
              <div>
                <p className="mb-1 font-medium text-muted">توضیح</p>
                <p>{exercise.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
