import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { listContentFiles, getRecentCommits } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAuth();

  let files: { path: string }[] = [];
  let commits: { sha: string; commit: { message: string; author: { name: string; date: string } } }[] = [];
  let error: string | null = null;

  try {
    files = await listContentFiles();
  } catch (e) {
    error = e instanceof Error ? e.message : "خطا در دریافت اطلاعات";
  }

  try {
    commits = await getRecentCommits(5);
  } catch {
    // silent
  }

  const articles = files.filter((f) => f.path.startsWith("content/articles/"));
  const lessons = files.filter((f) => f.path.startsWith("content/lessons/"));
  const topics = files.filter((f) => f.path.startsWith("content/topics/"));
  const pages = files.filter((f) => f.path.startsWith("content/pages/"));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="مقاله‌ها"
          count={articles.length}
          href="/admin/articles"
          color="blue"
        />
        <StatCard
          label="درس‌ها"
          count={lessons.length}
          href="/admin/lessons"
          color="green"
        />
        <StatCard
          label="موضوعات"
          count={topics.length}
          href="/admin/topics"
          color="purple"
        />
        <StatCard
          label="برگه‌ها"
          count={pages.length}
          href="/admin/pages"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">اقدامات سریع</h2>
        <div className="flex flex-wrap gap-3">
          <QuickAction href="/admin/articles/new" label="مقاله جدید" />
          <QuickAction href="/admin/lessons/new" label="درس جدید" />
          <QuickAction href="/admin/topics/new" label="موضوع جدید" />
          <QuickAction href="/admin/site-config" label="ویرایش تنظیمات سایت" />
        </div>
      </div>

      {/* Recent Commits */}
      {commits.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            آخرین تغییرات
          </h2>
          <div className="space-y-3">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="flex items-start gap-3 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-900">{commit.commit.message}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {commit.commit.author?.name} —{" "}
                    {new Date(commit.commit.author?.date).toLocaleDateString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  count,
  href,
  color,
}: {
  label: string;
  count: number;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <Link
      href={href}
      className={`rounded-xl border p-5 ${colors[color]} hover:shadow-md transition-shadow`}
    >
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </Link>
  );
}

function QuickAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      {label}
    </Link>
  );
}