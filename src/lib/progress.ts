"use client";

const COMPLETED_KEY = "bahsclub:completed";
const LAST_LESSON_KEY = "bahsclub:last-lesson";
const LAST_ARTICLE_KEY = "bahsclub:last-article";

// ponytail: one-time read-migration from old harfclub:* keys.
function readKey(key: string): string | null {
  if (typeof window === "undefined") return null;
  const oldKey = "harfclub:" + key.slice("bahsclub:".length);
  const existing = localStorage.getItem(key);
  if (existing === null) {
    const old = localStorage.getItem(oldKey);
    if (old !== null) {
      localStorage.setItem(key, old);
      localStorage.removeItem(oldKey);
      return old;
    }
  } else {
    localStorage.removeItem(oldKey);
  }
  return existing;
}

export function getCompletedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = readKey(COMPLETED_KEY);
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
    lessonSlug: readKey(LAST_LESSON_KEY) ?? undefined,
    articleSlug: readKey(LAST_ARTICLE_KEY) ?? undefined,
  };
}
