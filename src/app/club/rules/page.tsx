import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPageBySlug } from "@/lib/content";
import { MarkdownContent } from "@/components/MarkdownContent";

export const metadata: Metadata = {
  title: "مرام‌نامهٔ باشگاه",
  description:
    "ده اصلی که فرهنگ باشگاه را می‌سازند — اصولی برای بحث‌هایی که هدفشان فهمیدن است، نه برنده شدن.",
};

export default function ClubRulesPage() {
  const page = getPageBySlug("rules");
  if (!page) notFound();

  return (
    <article>
      <header className="mb-8">
        <p className="eyebrow mb-2">باشگاه</p>
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.description && <p className="mt-2 text-muted">{page.description}</p>}
      </header>

      <MarkdownContent content={page.content} />

      <div className="mt-10 border-t border-border pt-6">
        <Link
          href="/club"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          بازگشت به باشگاه
        </Link>
      </div>
    </article>
  );
}
