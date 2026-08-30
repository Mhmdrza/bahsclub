"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteConfig } from "@/lib/admin-actions";
import { load } from "js-yaml";
import { FormField, SubmitButton, SectionHeading } from "@/components/admin/ui";

interface NavItem {
  label: string;
  href: string;
}

interface HomeSlot {
  type: string;
  label: string;
  articleSlug?: string;
}

interface Principle {
  title: string;
  description: string;
}

interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  featuredLessonSlug?: string;
  nav: NavItem[];
  homeSlots: HomeSlot[];
  principles: Principle[];
  livePractice: { title: string; description: string; href: string };
}

function defaultConfig(): SiteConfig {
  return {
    title: "",
    tagline: "",
    description: "",
    nav: [],
    homeSlots: [],
    principles: [],
    livePractice: { title: "", description: "", href: "" },
  };
}

export function SiteConfigForm({
  initialYaml,
  sha,
}: {
  initialYaml: string;
  sha: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [yamlSource, setYamlSource] = useState(initialYaml);
  const [mode, setMode] = useState<"form" | "raw">("form");

  function parseConfig(): SiteConfig {
    try {
      const parsed = load(yamlSource) as SiteConfig;
      return { ...defaultConfig(), ...parsed };
    } catch {
      return defaultConfig();
    }
  }

  const config = parseConfig();

  function updateYaml(updater: (prev: string) => string) {
    setYamlSource(updater(yamlSource));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSiteConfig(sha, yamlSource);
      router.refresh();
      alert("تنظیمات با موفقیت ذخیره شد");
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ذخیره تنظیمات");
    } finally {
      setLoading(false);
    }
  }

  // For simplicity, let's just use the raw YAML editor mode

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("form")}
          className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
            mode === "form"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          فرم
        </button>
        <button
          type="button"
          onClick={() => setMode("raw")}
          className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
            mode === "raw"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ویرایش مستقیم YAML
        </button>
      </div>

      {mode === "raw" ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeading title="تنظیمات سایت (YAML)" />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              محتوای site.yaml
            </label>
            <textarea
              value={yamlSource}
              onChange={(e) => setYamlSource(e.target.value)}
              rows={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              dir="ltr"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <SectionHeading title="اطلاعات پایه" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="عنوان سایت"
                name="yaml-title"
                value={config.title}
                onChange={(e) => updateYaml((prev) => prev.replace(/^title:.*$/m, `title: "${e.target.value}"`))}
              />
              <FormField
                label="زیرعنوان"
                name="yaml-tagline"
                value={config.tagline}
                onChange={(e) => updateYaml((prev) => prev.replace(/^tagline:.*$/m, `tagline: "${e.target.value}"`))}
              />
            </div>
            <FormField
              label="توضیحات"
              name="yaml-desc"
              value={config.description}
              onChange={(e) => updateYaml((prev) => prev.replace(/^description:.*$/m, `description: "${e.target.value}"`))}
              as="textarea"
              rows={3}
            />
            <FormField
              label="درس برگزیده (اسلاگ)"
              name="yaml-featured"
              value={config.featuredLessonSlug || ""}
              onChange={(e) => updateYaml((prev) => {
                if (config.featuredLessonSlug)
                  return prev.replace(/^featuredLessonSlug:.*$/m, `featuredLessonSlug: "${e.target.value}"`);
                return prev.replace(/(^principles:)/m, `featuredLessonSlug: "${e.target.value}"\n$1`);
              })}
            />
          </div>

          {/* Reminder to use raw mode for complex edits */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
            برای ویرایش منو، اسلات‌های صفحه اصلی، اصول و بخش تمرین زنده از حالت
            ویرایش مستقیم YAML استفاده کنید.
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          انصراف
        </button>
        <SubmitButton loading={loading} label="ذخیره تنظیمات" />
      </div>
    </form>
  );
}