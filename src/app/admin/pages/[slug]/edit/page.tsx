"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updatePage } from "@/lib/admin-actions";
import { FormField, PageHeader, SubmitButton, SectionHeading } from "@/components/admin/ui";
import matter from "gray-matter";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sha, setSha] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", description: "", status: "draft", order: "0", body: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/pages/${slug}`);
        if (!res.ok) throw new Error("برگه یافت نشد");
        const data = await res.json();
        const parsed = matter(data.content);
        const fm = parsed.data as Record<string, unknown>;
        setSha(data.sha);
        setForm({
          title: (fm.title as string) || "",
          slug: (fm.slug as string) || slug,
          description: (fm.description as string) || "",
          status: (fm.status as string) || "draft",
          order: String(fm.order || "0"),
          body: parsed.content.trim(),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "خطا در بارگذاری برگه");
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [slug]);

  function updateField(name: string, value: string) { setForm((prev) => ({ ...prev, [name]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) formData.append(key, value);
      await updatePage(slug, sha, formData);
      router.push("/admin/pages");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ویرایش برگه");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="text-center py-12 text-gray-500">در حال بارگذاری...</div>;
  if (error) return <div><PageHeader title="خطا" backHref="/admin/pages" /><div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">{error}</div></div>;

  return (
    <div>
      <PageHeader title={`ویرایش: ${form.title || slug}`} backHref="/admin/pages" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="اطلاعات برگه" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="عنوان" name="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
            <FormField label="نامک (slug)" name="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
          </div>
          <FormField label="توضیحات" name="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} as="textarea" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="وضعیت" name="status" value={form.status} onChange={(e) => updateField("status", e.target.value)} as="select"
              options={[{ value: "draft", label: "پیش‌نویس" }, { value: "published", label: "منتشر شده" }, { value: "archived", label: "بایگانی" }]} />
            <FormField label="ترتیب" name="order" type="number" value={form.order} onChange={(e) => updateField("order", e.target.value)} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="محتوا" />
          <FormField label="متن (Markdown)" name="body" value={form.body} onChange={(e) => updateField("body", e.target.value)} as="textarea" rows={15} />
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">انصراف</button>
          <SubmitButton loading={loading} label="ذخیره تغییرات" />
        </div>
      </form>
    </div>
  );
}