import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import { ContentMapClient } from "./client";

export const metadata: Metadata = {
  title: "نقشه محتوا",
  description: "نمای کامل کتابخانهٔ محتوای بحث‌کلاب",
};

interface ManifestArticle {
  slug: string;
  title: string;
  type: string;
  category: string;
  level: string;
  readingTime: number;
  order: number;
  tags: string[];
  topics: string[];
  family: string;
  status: string;
  lessons: string[];
  inboundLinks: string[];
  file: string;
}

interface ManifestLesson {
  slug: string;
  title: string;
  steps: string[];
  order: number;
}

interface ManifestFamily {
  [familyName: string]: string[];
}

interface ManifestGaps {
  orphans: string[];
  noFamily: string[];
  unreferenced: string[];
  sparseTags: string[];
  sparseTopics: string[];
}

interface Manifest {
  generatedAt: string;
  counts: { articles: number; lessons: number; families: number };
  articles: ManifestArticle[];
  lessons: ManifestLesson[];
  families: ManifestFamily;
  gaps: ManifestGaps;
}

export default function ContentMapPage() {
  const manifestPath = path.join(process.cwd(), "content", "manifest.yaml");
  let manifest: Manifest | null = null;
  let manifestError: string | null = null;

  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    manifest = loadYaml(raw) as Manifest;
  } catch {
    manifestError =
      "فایل manifest.yaml پیدا نشد. لطفاً ابتدا `pnpm run content:index` را اجرا کنید.";
  }

  if (manifestError || !manifest) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">نقشه محتوا</h1>
        <p className="text-red-500">{manifestError}</p>
        <pre className="mt-4 rounded bg-surface p-4 text-left text-sm">
          pnpm run content:index
        </pre>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">نقشه محتوا</h1>
          <p className="mt-1 text-sm text-muted">
            {manifest.counts.articles} مقاله، {manifest.counts.lessons} درس،
            {manifest.counts.families} خانواده
            {" · "}
            آخرین به‌روزرسانی:{" "}
            {new Date(manifest.generatedAt).toLocaleString("fa-IR")}
          </p>
        </div>
      </div>
      <ContentMapClient manifest={manifest} />
    </div>
  );
}