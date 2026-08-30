"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/admin-actions";
import { FormField, PageHeader, SubmitButton, SectionHeading } from "@/components/admin/ui";

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    status: "draft",
    category: "",
    level: "beginner",
    readingTime: "5",
    order: "0",
    tags: "",
    topics: "",
    type: "article",
    publishedAt: new Date().toISOString().split("T")[0],
    body: "",
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
      await createArticle(formData);
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ایجاد مقاله");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="مقاله جدید"
        backHref="/admin/articles"
      />

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
              hint="به‌صورت خودکار از عنوان پر می‌شود"
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
          <SectionHeading title="دسته‌بندی و وضعیت" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="نوع"
              name="type"
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              as="select"
              options={[
                { value: "article", label: "مقاله" },
                { value: "tactic", label: "تاکتیک" },
                { value: "practice", label: "تمرین" },
              ]}
            />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="دسته"
              name="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
            <FormField
              label="مدت مطالعه (دقیقه)"
              name="readingTime"
              type="number"
              value={form.readingTime}
              onChange={(e) => updateField("readingTime", e.target.value)}
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
            <FormField
              label="برچسب‌ها (با کاما جدا کنید)"
              name="tags"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              hint="مثال: مغالطه,تاکتیک,حمله شخصی"
            />
            <FormField
              label="موضوعات (با کاما جدا کنید)"
              name="topics"
              value={form.topics}
              onChange={(e) => updateField("topics", e.target.value)}
              hint="اسلاگ موضوعات: fallacies, tactics, foundations, practice"
            />
          </div>

          <FormField
            label="تاریخ انتشار"
            name="publishedAt"
            type="date"
            value={form.publishedAt}
            onChange={(e) => updateField("publishedAt", e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="محتوا" />
          <FormField
            label="متن مقاله (Markdown)"
            name="body"
            value={form.body}
            onChange={(e) => updateField("body", e.target.value)}
            as="textarea"
            rows={20}
            placeholder="محتوای مقاله را با فرمت Markdown وارد کنید..."
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
          <SubmitButton loading={loading} label="ایجاد مقاله" />
        </div>
      </form>
    </div>
  );
}