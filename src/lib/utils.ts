export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function levelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: "مبتدی",
    intermediate: "متوسط",
    advanced: "پیشرفته",
  };
  return labels[level] ?? level;
}

export function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    article: "مقاله",
    tactic: "تاکتیک",
    practice: "تمرین",
  };
  return labels[type] ?? type;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
