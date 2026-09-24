import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTopics } from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "موضوع‌ها",
  description: "موضوعات آموزشی بحث‌کلاب.",
};

export default function TopicsPage() {
  const topics = getPublishedTopics();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "موضوع‌ها" }]}
      />
      <h1 className="mb-2 text-3xl font-bold">موضوع‌ها</h1>
      <p className="mb-8 text-muted">
        مقالات را بر اساس موضوع مرور کنید.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="rounded-lg border border-border bg-surface p-5 hover:border-accent/40"
          >
            <h2 className="mb-2 text-lg font-semibold">{topic.title}</h2>
            <p className="text-sm text-muted">{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
