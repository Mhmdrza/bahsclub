"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateLesson } from "@/lib/admin-actions";
import { FormField, PageHeader, SubmitButton, SectionHeading } from "@/components/admin/ui";
import matter from "gray-matter";

export default function EditLessonPage() {
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
    level: "beginner",
    audience: "beginner",
    featured: "false",
    sequential: "false",
    order: "0",
    milestone: "",
    steps: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/lessons/${slug}`);
        if (!res.ok) throw new Error("درس یافت نشد");
        const data = await res.json();
        const parsed = matter(data.content);
        const fm = parsed.data as Record<string, unknown>;

        setSha(data.sha);
        setForm({
          title: (fm.title as string) || "",
          slug: (fm.slug as string) || slug,
          description: (fm.description as string) || "",
          status: (fm.status as string) || "draft",
          level: (fm.level as string) || "beginner",
          audience: (fm.audience as string) || "beginner",
          featured: fm.featured ? "true" : "false",
          sequential: fm.sequential ? "true" : "false",
          order: String(fm.order || "0"),
          milestone: (fm.milestone as string) || "",
          steps: Array.isArray(fm.steps) ? (fm.steps as string[]).join(", ") : "",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "خطا در بارگذاری درس");
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
      await updateLesson(slug, sha, formData);
      router.push("/admin/lessons");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ویرایش درس");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <div className="text-center py-12 text-muted">در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div>
        <PageHeader title="خطا" backHref="/admin/lessons" />
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`ویرایش: ${form.title || slug}`} backHref="/admin/lessons" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <SectionHeading title="اطلاعات اصلی" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="عنوان" name="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
            <FormField label="نامک (slug)" name="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
          </div>
          <FormField label="توضیحات" name="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} as="textarea" rows={3} />
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <SectionHeading title="تنظیمات" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="وضعیت" name="status" value={form.status} onChange={(e) => updateField("status", e.target.value)} as="select"
              options={[{ value: "draft", label: "پیش‌نویس" }, { value: "published", label: "منتشر شده" }, { value: "archived", label: "بایگانی" }]} />
            <FormField label="سطح" name="level" value={form.level} onChange={(e) => updateField("level", e.target.value)} as="select"
              options={[{ value: "beginner", label: "مبتدی" }, { value: "intermediate", label: "متوسط" }, { value: "advanced", label: "پیشرفته" }]} />
            <FormField label="ترتیب" name="order" type="number" value={form.order} onChange={(e) => updateField("order", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="مخاطب" name="audience" value={form.audience} onChange={(e) => updateField("audience", e.target.value)} />
            <FormField label="دستاورد (milestone)" name="milestone" value={form.milestone} onChange={(e) => updateField("milestone", e.target.value)} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.featured === "true"} onChange={(e) => updateField("featured", e.target.checked ? "true" : "false")} />
              ویژه
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.sequential === "true"} onChange={(e) => updateField("sequential", e.target.checked ? "true" : "false")} />
              ترتیبی
            </label>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <SectionHeading title="گام‌های درس" />
          <FormField label="اسلاگ مقاله‌ها (با کاما جدا کنید)" name="steps" value={form.steps} onChange={(e) => updateField("steps", e.target.value)} as="textarea" rows={4} />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">انصراف</button>
          <SubmitButton loading={loading} label="ذخیره تغییرات" />
        </div>
      </form>
    </div>
  );
}