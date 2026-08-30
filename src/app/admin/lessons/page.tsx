import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { listContentFiles, getFile } from "@/lib/github";
import { DeleteLessonButton } from "./delete-button";
import { load } from "js-yaml";

export const dynamic = "force-dynamic";

interface LessonItem {
  slug: string;
  title: string;
  status: string;
  stepCount: number;
  order: number;
  sha: string;
}

export default async function LessonsPage() {
  await requireAuth();

  let lessons: LessonItem[] = [];
  let error: string | null = null;

  try {
    const files = await listContentFiles();
    const lessonFiles = files.filter((f) =>
      f.path.startsWith("content/lessons/") && f.path.endsWith(".md")
    );

    lessons = await Promise.all(
      lessonFiles.map(async (file) => {
        try {
          const { content, sha } = await getFile(file.path);
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          const fm = frontmatterMatch
            ? (load(frontmatterMatch[1]) as Record<string, unknown>)
            : {};

          return {
            slug: (fm.slug as string) || file.path.replace(/^content\/lessons\//, "").replace(/\.md$/, ""),
            title: (fm.title as string) || "بدون عنوان",
            status: (fm.status as string) || "draft",
            stepCount: Array.isArray(fm.steps) ? (fm.steps as string[]).length : 0,
            order: Number(fm.order) || 0,
            sha,
          };
        } catch {
          return {
            slug: file.path.replace(/^content\/lessons\//, "").replace(/\.md$/, ""),
            title: "خطا در خواندن",
            status: "unknown",
            stepCount: 0,
            order: 0,
            sha: "",
          };
        }
      })
    );

    lessons.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug, "fa"));
  } catch (e) {
    error = e instanceof Error ? e.message : "خطا در دریافت درس‌ها";
  }

  return (
    <div>
      <PageHeader
        title="مدیریت درس‌ها"
        actions={
          <Link
            href="/admin/lessons/new"
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            درس جدید
          </Link>
        }
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 mb-4">
          {error}
        </div>
      )}

      {lessons.length === 0 && !error ? (
        <EmptyState
          title="هنوز درسی وجود ندارد"
          description="اولین درس را ایجاد کنید."
          action={
            <Link
              href="/admin/lessons/new"
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              درس جدید
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.slug}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <Link
                  href={`/admin/lessons/${lesson.slug}/edit`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {lesson.title}
                </Link>
                <StatusBadgeSM status={lesson.status} />
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {lesson.stepCount} گام • ترتیب {lesson.order}
              </p>
              <div className="flex items-center gap-2 justify-end">
                <Link
                  href={`/admin/lessons/${lesson.slug}/edit`}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="ویرایش"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteLessonButton slug={lesson.slug} sha={lesson.sha} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadgeSM({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-600",
  };
  const labels: Record<string, string> = {
    published: "منتشر شده",
    draft: "پیش‌نویس",
    archived: "بایگانی",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}