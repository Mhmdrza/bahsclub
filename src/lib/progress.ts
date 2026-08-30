"use client";

const COMPLETED_KEY = "bahsclub:completed";
const LAST_LESSON_KEY = "bahsclub:last-lesson";
const LAST_ARTICLE_KEY = "bahsclub:last-article";

export function getCompletedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isArticleCompleted(slug: string): boolean {
  return getCompletedSlugs().includes(slug);
}

export function markArticleComplete(slug: string): void {
  const current = getCompletedSlugs();
  if (!current.includes(slug)) {
    localStorage.setItem(
      COMPLETED_KEY,
      JSON.stringify([...current, slug])
    );
  }
}

export function unmarkArticleComplete(slug: string): void {
  const current = getCompletedSlugs().filter((s) => s !== slug);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(current));
}

export function getLessonProgress(
  stepSlugs: string[],
  validSlugs: Set<string>
): { completed: number; total: number } {
  const completedSlugs = getCompletedSlugs().filter((slug) =>
    validSlugs.has(slug)
  );
  const total = stepSlugs.filter((slug) => validSlugs.has(slug)).length;
  const completed = stepSlugs.filter((slug) => completedSlugs.includes(slug))
    .length;
  return { completed, total };
}

export function setLastPosition(lessonSlug: string, articleSlug: string): void {
  localStorage.setItem(LAST_LESSON_KEY, lessonSlug);
  localStorage.setItem(LAST_ARTICLE_KEY, articleSlug);
}

export function getLastPosition(): {
  lessonSlug?: string;
  articleSlug?: string;
} {
  if (typeof window === "undefined") return {};
  return {
    lessonSlug: localStorage.getItem(LAST_LESSON_KEY) ?? undefined,
    articleSlug: localStorage.getItem(LAST_ARTICLE_KEY) ?? undefined,
  };
}
