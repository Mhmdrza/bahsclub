"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLesson } from "@/lib/admin-actions";
import { FormField, PageHeader, SubmitButton, SectionHeading } from "@/components/admin/ui";

export default function NewLessonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    status: "draft",
    level: "beginner",
    audience: "beginner",
    featured: "false",
    sequential: "false",
    order: "0",
    milestone: "",
    steps: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);

  function updateField(name: string, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && autoSlug) {
        updated.slug = value
          .replace(/[^\w\s\-آ-ی]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase();
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }
      await createLesson(formData);
      router.push("/admin/lessons");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ایجاد درس");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="درس جدید" backHref="/admin/lessons" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="اطلاعات اصلی" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="عنوان"
              name="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
            <FormField
              label="نامک (slug)"
              name="slug"
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                updateField("slug", e.target.value);
              }}
              required
            />
          </div>
          <FormField
            label="توضیحات"
            name="description"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            as="textarea"
            rows={3}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="تنظیمات" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="وضعیت"
              name="status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              as="select"
              options={[
                { value: "draft", label: "پیش‌نویس" },
                { value: "published", label: "منتشر شده" },
                { value: "archived", label: "بایگانی" },
              ]}
            />
            <FormField
              label="سطح"
              name="level"
              value={form.level}
              onChange={(e) => updateField("level", e.target.value)}
              as="select"
              options={[
                { value: "beginner", label: "مبتدی" },
                { value: "intermediate", label: "متوسط" },
                { value: "advanced", label: "پیشرفته" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="مخاطب"
              name="audience"
              value={form.audience}
              onChange={(e) => updateField("audience", e.target.value)}
            />
            <FormField
              label="ترتیب"
              name="order"
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">ویژه</label>
              <input
                type="checkbox"
                checked={form.featured === "true"}
                onChange={(e) => updateField("featured", e.target.checked ? "true" : "false")}
                className="rounded"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">ترتیبی</label>
              <input
                type="checkbox"
                checked={form.sequential === "true"}
                onChange={(e) => updateField("sequential", e.target.checked ? "true" : "false")}
                className="rounded"
              />
            </div>
          </div>
          <FormField
            label="دستاورد (milestone)"
            name="milestone"
            value={form.milestone}
            onChange={(e) => updateField("milestone", e.target.value)}
            as="textarea"
            rows={2}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="گام‌های درس" />
          <FormField
            label="اسلاگ مقاله‌ها (با کاما جدا کنید)"
            name="steps"
            value={form.steps}
            onChange={(e) => updateField("steps", e.target.value)}
            as="textarea"
            rows={3}
            hint="اسلاگ مقاله‌ها را به ترتیب وارد کنید: what-is-debate, structure-of-argument, ..."
          />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            انصراف
          </button>
          <SubmitButton loading={loading} label="ایجاد درس" />
        </div>
      </form>
    </div>
  );
}