import { requireAuth } from "@/lib/auth";
import { PageHeader, SectionHeading } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAuth();

  const owner = process.env.GITHUB_OWNER || "";
  const repo = process.env.GITHUB_REPO || "";
  const branch = process.env.GITHUB_BRANCH || "main";

  return (
    <div>
      <PageHeader title="تنظیمات" />

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeading title="مخزن گیت‌هاب" />
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">صاحب مخزن:</span>
              <span className="text-gray-900">{owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">مخزن:</span>
              <span className="text-gray-900">{repo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">شاخه:</span>
              <span className="text-gray-900">{branch}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            این تنظیمات از طریق متغیرهای محیطی پیکربندی می‌شوند.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeading title="راهنما" />
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              هر تغییری که در پنل مدیریت ایجاد کنید، مستقیم روی مخزن گیت‌هاب commit می‌شود.
              پس از commit، اگر مخزن شما به Vercel متصل باشد، Vercel به‌طور خودکار تغییرات
              را تشخیص داده و سایت را بازسازی (build) می‌کند.
            </p>
            <p>
              برای راه‌اندازی اولیه، مطمئن شوید که متغیرهای محیطی زیر تنظیم شده‌اند:
            </p>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-800" dir="ltr">
              GITHUB_TOKEN=ghp_...{'\n'}
              GITHUB_OWNER=your-username{'\n'}
              GITHUB_REPO=bahsclub{'\n'}
              GITHUB_BRANCH=main{'\n'}
              ADMIN_PASSWORD_HASH=&lt;sha256-of-password&gt;{'\n'}
              SESSION_SECRET=&lt;random-string&gt;
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeading title="محاسبه هش رمز عبور" />
          <p className="text-sm text-gray-700 mb-3">
            برای تولید هش رمز عبور، می‌توانید از دستور زیر استفاده کنید:
          </p>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-800" dir="ltr">
            echo -n &quot;your-password&quot; | shasum -a 256 | cut -d&apos; &apos; -f1
          </pre>
        </div>
      </div>
    </div>
  );
}