"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateArticle } from "@/lib/admin-actions";
import { FormField, PageHeader, SubmitButton, SectionHeading } from "@/components/admin/ui";
import matter from "gray-matter";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sha, setSha] = useState("");
  const [error, setError] = useState("");

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
    publishedAt: "",
    body: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/articles/${slug}`);
        if (!res.ok) throw new Error("مقاله یافت نشد");
        const data = await res.json();

        // Parse frontmatter
        const parsed = matter(data.content);
        const fm = parsed.data as Record<string, unknown>;

        setSha(data.sha);
        setForm({
          title: (fm.title as string) || "",
          slug: (fm.slug as string) || slug,
          description: (fm.description as string) || "",
          status: (fm.status as string) || "draft",
          category: (fm.category as string) || "",
          level: (fm.level as string) || "beginner",
          readingTime: String(fm.readingTime || "5"),
          order: String(fm.order || "0"),
          tags: Array.isArray(fm.tags) ? (fm.tags as string[]).join(", ") : "",
          topics: Array.isArray(fm.topics) ? (fm.topics as string[]).join(", ") : "",
          type: (fm.type as string) || "article",
          publishedAt: (fm.publishedAt as string) || "",
          body: parsed.content.trim(),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "خطا در بارگذاری مقاله");
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [slug]);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }
      await updateArticle(slug, sha, formData);
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ویرایش مقاله");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="text-center py-12 text-gray-500">در حال بارگذاری...</div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="خطا" backHref="/admin/articles" />
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`ویرایش: ${form.title || slug}`}
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
              onChange={(e) => updateField("slug", e.target.value)}
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
            />
            <FormField
              label="موضوعات (با کاما جدا کنید)"
              name="topics"
              value={form.topics}
              onChange={(e) => updateField("topics", e.target.value)}
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
          <SubmitButton loading={loading} label="ذخیره تغییرات" />
        </div>
      </form>
    </div>
  );
}