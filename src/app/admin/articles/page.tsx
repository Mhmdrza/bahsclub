import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { listContentFiles } from "@/lib/github";
import { DeleteArticleButton } from "./delete-button";

export const dynamic = "force-dynamic";

interface ArticleFile {
  slug: string;
  title: string;
  status: string;
  type: string;
  category: string;
  order: number;
  sha: string;
  path: string;
}

export default async function ArticlesPage() {
  await requireAuth();

  let articles: ArticleFile[] = [];
  let error: string | null = null;

  try {
    const files = await listContentFiles();
    const articleFiles = files.filter((f) =>
      f.path.startsWith("content/articles/") && f.path.endsWith(".mdx")
    );

    // Fetch frontmatter for each article
    const { getFile } = await import("@/lib/github");
    const { load: loadYaml } = await import("js-yaml");

    articles = await Promise.all(
      articleFiles.map(async (file) => {
        try {
          const { content, sha } = await getFile(file.path);
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          const frontmatter = frontmatterMatch
            ? (loadYaml(frontmatterMatch[1]) as Record<string, unknown>)
            : {};

          return {
            slug: (frontmatter.slug as string) || file.path.replace(/^content\/articles\//, "").replace(/\.mdx$/, ""),
            title: (frontmatter.title as string) || "بدون عنوان",
            status: (frontmatter.status as string) || "draft",
            type: (frontmatter.type as string) || "article",
            category: (frontmatter.category as string) || "",
            order: Number(frontmatter.order) || 0,
            sha,
            path: file.path,
          };
        } catch {
          return {
            slug: file.path.replace(/^content\/articles\//, "").replace(/\.mdx$/, ""),
            title: "خطا در خواندن",
            status: "unknown",
            type: "article",
            category: "",
            order: 0,
            sha: "",
            path: file.path,
          };
        }
      })
    );

    articles.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug, "fa"));
  } catch (e) {
    error = e instanceof Error ? e.message : "خطا در دریافت مقاله‌ها";
  }

  return (
    <div>
      <PageHeader
        title="مدیریت مقاله‌ها"
        actions={
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            مقاله جدید
          </Link>
        }
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 mb-4">
          {error}
        </div>
      )}

      {articles.length === 0 && !error ? (
        <EmptyState
          title="هنوز مقاله‌ای وجود ندارد"
          description="اولین مقاله را ایجاد کنید."
          action={
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              مقاله جدید
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right px-4 py-3 font-medium text-gray-600">عنوان</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">نوع</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">دسته</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ترتیب</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.slug}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <TypeBadge type={article.type} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                    {article.category}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-left">
                    {article.order}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/articles/${article.slug}/edit`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="ویرایش"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteArticleButton
                        slug={article.slug}
                        sha={article.sha}
                      />
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-600",
  };

  const labels: Record<string, string> = {
    published: "منتشر شده",
    draft: "پیش‌نویس",
    archived: "بایگانی",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    article: "bg-blue-100 text-blue-800",
    tactic: "bg-purple-100 text-purple-800",
    practice: "bg-orange-100 text-orange-800",
  };

  const labels: Record<string, string> = {
    article: "مقاله",
    tactic: "تاکتیک",
    practice: "تمرین",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        colors[type] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[type] || type}
    </span>
  );
}