import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { listContentFiles, getFile } from "@/lib/github";
import { DeleteTopicButton } from "./delete-button";
import { load } from "js-yaml";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  await requireAuth();

  let topics: { slug: string; title: string; status: string; order: number; sha: string }[] = [];
  let error: string | null = null;

  try {
    const files = await listContentFiles();
    const topicFiles = files.filter((f) =>
      f.path.startsWith("content/topics/") && f.path.endsWith(".md")
    );

    topics = await Promise.all(
      topicFiles.map(async (file) => {
        try {
          const { content, sha } = await getFile(file.path);
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          const fm = frontmatterMatch
            ? (load(frontmatterMatch[1]) as Record<string, unknown>)
            : {};

          return {
            slug: (fm.slug as string) || file.path.replace(/^content\/topics\//, "").replace(/\.md$/, ""),
            title: (fm.title as string) || "بدون عنوان",
            status: (fm.status as string) || "draft",
            order: Number(fm.order) || 0,
            sha,
          };
        } catch {
          return {
            slug: file.path.replace(/^content\/topics\//, "").replace(/\.md$/, ""),
            title: "خطا",
            status: "unknown",
            order: 0,
            sha: "",
          };
        }
      })
    );

    topics.sort((a, b) => a.order - b.order);
  } catch (e) {
    error = e instanceof Error ? e.message : "خطا در دریافت موضوعات";
  }

  return (
    <div>
      <PageHeader
        title="مدیریت موضوعات"
        actions={
          <Link
            href="/admin/topics/new"
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            موضوع جدید
          </Link>
        }
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 mb-4">{error}</div>
      )}

      {topics.length === 0 && !error ? (
        <EmptyState
          title="هنوز موضوعی وجود ندارد"
          description="اولین موضوع را ایجاد کنید."
          action={
            <Link href="/admin/topics/new" className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              <Plus size={16} />
              موضوع جدید
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right px-4 py-3 font-medium text-gray-600">عنوان</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">نامک</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">وضعیت</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ترتیب</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.slug} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/topics/${topic.slug}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {topic.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{topic.slug}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      topic.status === "published" ? "bg-green-100 text-green-800" :
                      topic.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {topic.status === "published" ? "منتشر شده" : topic.status === "draft" ? "پیش‌نویس" : topic.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-left">{topic.order}</td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/topics/${topic.slug}/edit`} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="ویرایش">
                        <Pencil size={16} />
                      </Link>
                      <DeleteTopicButton slug={topic.slug} sha={topic.sha} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}