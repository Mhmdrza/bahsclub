"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/lib/admin-actions";
import { FormField, PageHeader, SubmitButton, SectionHeading } from "@/components/admin/ui";

export default function NewPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", status: "draft", order: "0", body: "" });
  const [autoSlug, setAutoSlug] = useState(true);

  function updateField(name: string, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && autoSlug) {
        updated.slug = value.replace(/[^\w\s\-آ-ی]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) formData.append(key, value);
      await createPage(formData);
      router.push("/admin/pages");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در ایجاد برگه");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="برگه جدید" backHref="/admin/pages" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <SectionHeading title="اطلاعات برگه" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="عنوان" name="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
            <FormField label="نامک (slug)" name="slug" value={form.slug} onChange={(e) => { setAutoSlug(false); updateField("slug", e.target.value); }} required />
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
          <FormField label="متن (Markdown)" name="body" value={form.body} onChange={(e) => updateField("body", e.target.value)} as="textarea" rows={15} placeholder="محتوای برگه را با فرمت Markdown وارد کنید..." />
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">انصراف</button>
          <SubmitButton loading={loading} label="ایجاد برگه" />
        </div>
      </form>
    </div>
  );
}