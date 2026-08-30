import type { Metadata } from "next";
import { getPublishedLessons } from "@/lib/content";
import { LessonCard } from "@/components/LessonCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "مسیر یادگیری",
  description: "مسیرهای یادگیری بحث‌کلاب برای شروع و ادامهٔ آموزش.",
};

export default function LearnPage() {
  const lessons = getPublishedLessons();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "مسیر یادگیری" }]}
      />
      <h1 className="mb-2 text-3xl font-bold">مسیر یادگیری</h1>
      <p className="mb-8 max-w-2xl text-muted">
        هر مسیر مجموعه‌ای از درس‌های مرتبط است. می‌توانید چند مسیر را هم‌زمان
        دنبال کنید.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
