"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Compass } from "lucide-react";
import { LADDER, type LadderRung } from "@/lib/ladder";

export function LadderAssessment({
  lessonTitles = {},
}: {
  lessonTitles?: Record<string, string>;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const result = useMemo(() => {
    for (const rung of LADDER) {
      const score = rung.selfCheck.filter(
        (_, i) => checked[`${rung.id}-${i}`]
      ).length;
      if (score < 2) return rung;
    }
    return null;
  }, [checked]);

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section
      id="assessment"
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10"
    >
      <div className="mb-6 flex items-center gap-2 text-accent">
        <Compass className="h-5 w-5" />
        <p className="eyebrow">کجای مسیری؟</p>
      </div>
      <h2 className="mb-3 text-2xl font-extrabold">آزمون کوتاه: خودت را بسنج</h2>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        هر جمله را اگر در مورد خودت درست است تیک بزن. صادقانه پاسخ بده — هدف پیدا کردن
        نقطهٔ شروع، نه قضاوت. نتیجه زیر همین‌جا به‌روز می‌شود.
      </p>

      <div className="space-y-8">
        {LADDER.map((rung) => (
          <div key={rung.id}>
            <p className="eyebrow mb-3">
              {rung.step} — {rung.title}
            </p>
            <ul className="space-y-3">
              {rung.selfCheck.map((statement, i) => {
                const key = `${rung.id}-${i}`;
                const active = Boolean(checked[key]);
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={active}
                      className="flex w-full items-start gap-3 rounded-xl border border-border bg-background p-4 text-right text-sm leading-relaxed transition-colors hover:border-accent/40"
                    >
                      {active ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                      )}
                      <span className={active ? "text-foreground" : "text-muted"}>
                        {statement}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <ResultPanel result={result} lessonTitles={lessonTitles} />
    </section>
  );
}

function ResultPanel({
  result,
  lessonTitles,
}: {
  result: LadderRung | null;
  lessonTitles: Record<string, string>;
}) {
  if (!result) {
    return (
      <div className="mt-8 rounded-xl border border-gold/40 bg-gold-light/40 p-5 sm:p-6">
        <p className="eyebrow mb-1">نتیجه</p>
        <h3 className="mb-2 font-bold">پایه‌های هر سه مرحله را داری</h3>
        <p className="text-sm leading-relaxed text-muted">
          وقتش رسیده عمیق‌تر شوی: باورهایت را از چند زاویه محک بزن و تمرین‌های میانی و
          پیشرفته را جدی بگیر.
        </p>
        <Link
          href="/practice"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          تمرین‌های عمیق‌تر
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-accent/40 bg-accent-light/40 p-5 sm:p-6">
      <p className="eyebrow mb-1">نقطهٔ شروع تو</p>
      <h3 className="mb-2 text-lg font-bold">
        {result.step} — {result.title}
      </h3>
      <p className="mb-4 text-sm font-medium text-muted">{result.subtitle}</p>
      <p className="mb-4 text-sm leading-relaxed text-muted">{result.description}</p>
      <div className="flex flex-wrap gap-3">
        {result.lessonSlugs.map((slug) => (
          <Link
            key={slug}
            href={`/learn/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent/90"
          >
            {lessonTitles[slug] ?? "شروع مسیر این مرحله"}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        ))}
        <a
          href={`#rung-${result.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/50"
        >
          دیدن مرحله در نردبان
        </a>
      </div>
    </div>
  );
}
