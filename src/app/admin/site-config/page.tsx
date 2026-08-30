import { requireAuth } from "@/lib/auth";
import { getFile } from "@/lib/github";
import { PageHeader } from "@/components/admin/ui";
import { SiteConfigForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SiteConfigPage() {
  await requireAuth();

  let yamlContent = "";
  let sha = "";
  let error: string | null = null;

  try {
    const file = await getFile("content/site.yaml");
    yamlContent = file.content;
    sha = file.sha;
  } catch (e) {
    error = e instanceof Error ? e.message : "خطا در بارگذاری تنظیمات";
  }

  return (
    <div>
      <PageHeader title="تنظیمات سایت" />
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 mb-4">
          {error}
        </div>
      )}
      <SiteConfigForm initialYaml={yamlContent} sha={sha} />
    </div>
  );
}