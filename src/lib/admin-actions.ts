"use server";

import { revalidatePath } from "next/cache";
import {
  createOrUpdateFile,
  deleteFile,
  buildCommitMessage,
} from "@/lib/github";
import { requireAuth } from "@/lib/auth";

// ─── Article Actions ───

export async function createArticle(formData: FormData) {
  await requireAuth();

  const slug = formData.get("slug") as string;
  if (!slug) throw new Error("Slug is required");

  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    category: formData.get("category") || "",
    level: formData.get("level") || "beginner",
    readingTime: Number(formData.get("readingTime")) || 5,
    order: Number(formData.get("order")) || 0,
    tags: parseList(formData.get("tags")),
    topics: parseList(formData.get("topics")),
    type: formData.get("type") || "article",
    publishedAt: formData.get("publishedAt") || new Date().toISOString().split("T")[0],
  };

  const body = formData.get("body") as string || "";

  const mdxContent = buildFrontmatter(frontmatter) + "\n" + body;

  const path = `content/articles/${slug}.mdx`;

  await createOrUpdateFile(
    path,
    mdxContent,
    await buildCommitMessage("create", "article", slug)
  );

  revalidatePath("/admin/articles");
}

export async function updateArticle(
  slug: string,
  prevSha: string,
  formData: FormData
) {
  await requireAuth();

  const newSlug = formData.get("slug") as string;
  const path = `content/articles/${slug}.mdx`;

  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug: newSlug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    category: formData.get("category") || "",
    level: formData.get("level") || "beginner",
    readingTime: Number(formData.get("readingTime")) || 5,
    order: Number(formData.get("order")) || 0,
    tags: parseList(formData.get("tags")),
    topics: parseList(formData.get("topics")),
    type: formData.get("type") || "article",
    publishedAt: formData.get("publishedAt") || "",
    updatedAt: new Date().toISOString().split("T")[0],
  };

  const body = formData.get("body") as string || "";
  const mdxContent = buildFrontmatter(frontmatter) + "\n" + body;

  await createOrUpdateFile(
    path,
    mdxContent,
    await buildCommitMessage("update", "article", slug),
    prevSha
  );

  revalidatePath("/admin/articles");
}

export async function deleteArticle(slug: string, sha: string) {
  await requireAuth();
  const path = `content/articles/${slug}.mdx`;
  await deleteFile(path, await buildCommitMessage("delete", "article", slug), sha);
  revalidatePath("/admin/articles");
}

// ─── Lesson Actions ───

export async function createLesson(formData: FormData) {
  await requireAuth();

  const slug = formData.get("slug") as string;
  const stepsStr = formData.get("steps") as string;
  const steps = stepsStr ? stepsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    level: formData.get("level") || "beginner",
    audience: formData.get("audience") || "beginner",
    featured: formData.get("featured") === "true",
    sequential: formData.get("sequential") === "true",
    order: Number(formData.get("order")) || 0,
    milestone: formData.get("milestone") || "",
    steps,
  };

  const mdContent = buildFrontmatter(frontmatter);
  const path = `content/lessons/${slug}.md`;

  await createOrUpdateFile(
    path,
    mdContent,
    await buildCommitMessage("create", "lesson", slug)
  );

  revalidatePath("/admin/lessons");
}

export async function updateLesson(slug: string, prevSha: string, formData: FormData) {
  await requireAuth();

  const stepsStr = formData.get("steps") as string;
  const steps = stepsStr ? stepsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    level: formData.get("level") || "beginner",
    audience: formData.get("audience") || "beginner",
    featured: formData.get("featured") === "true",
    sequential: formData.get("sequential") === "true",
    order: Number(formData.get("order")) || 0,
    milestone: formData.get("milestone") || "",
    steps,
  };

  const mdContent = buildFrontmatter(frontmatter);
  const path = `content/lessons/${slug}.md`;

  await createOrUpdateFile(
    path,
    mdContent,
    await buildCommitMessage("update", "lesson", slug),
    prevSha
  );

  revalidatePath("/admin/lessons");
}

export async function deleteLesson(slug: string, sha: string) {
  await requireAuth();
  const path = `content/lessons/${slug}.md`;
  await deleteFile(path, await buildCommitMessage("delete", "lesson", slug), sha);
  revalidatePath("/admin/lessons");
}

// ─── Topic Actions ───

export async function createTopic(formData: FormData) {
  await requireAuth();

  const slug = formData.get("slug") as string;
  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    order: Number(formData.get("order")) || 0,
  };

  const mdContent = buildFrontmatter(frontmatter);
  const path = `content/topics/${slug}.md`;

  await createOrUpdateFile(
    path,
    mdContent,
    await buildCommitMessage("create", "topic", slug)
  );

  revalidatePath("/admin/topics");
}

export async function updateTopic(slug: string, prevSha: string, formData: FormData) {
  await requireAuth();

  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    order: Number(formData.get("order")) || 0,
  };

  const mdContent = buildFrontmatter(frontmatter);
  const path = `content/topics/${slug}.md`;

  await createOrUpdateFile(
    path,
    mdContent,
    await buildCommitMessage("update", "topic", slug),
    prevSha
  );

  revalidatePath("/admin/topics");
}

export async function deleteTopic(slug: string, sha: string) {
  await requireAuth();
  const path = `content/topics/${slug}.md`;
  await deleteFile(path, await buildCommitMessage("delete", "topic", slug), sha);
  revalidatePath("/admin/topics");
}

// ─── Page Actions ───

export async function createPage(formData: FormData) {
  await requireAuth();

  const slug = formData.get("slug") as string;
  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    order: Number(formData.get("order")) || 0,
  };

  const body = formData.get("body") as string || "";
  const mdContent = buildFrontmatter(frontmatter) + "\n" + body;
  const path = `content/pages/${slug}.md`;

  await createOrUpdateFile(
    path,
    mdContent,
    await buildCommitMessage("create", "page", slug)
  );

  revalidatePath("/admin/pages");
}

export async function updatePage(slug: string, prevSha: string, formData: FormData) {
  await requireAuth();

  const frontmatter: Record<string, unknown> = {
    title: formData.get("title"),
    slug,
    description: formData.get("description"),
    status: formData.get("status") || "draft",
    order: Number(formData.get("order")) || 0,
  };

  const body = formData.get("body") as string || "";
  const mdContent = buildFrontmatter(frontmatter) + "\n" + body;
  const path = `content/pages/${slug}.md`;

  await createOrUpdateFile(
    path,
    mdContent,
    await buildCommitMessage("update", "page", slug),
    prevSha
  );

  revalidatePath("/admin/pages");
}

export async function deletePage(slug: string, sha: string) {
  await requireAuth();
  const path = `content/pages/${slug}.md`;
  await deleteFile(path, await buildCommitMessage("delete", "page", slug), sha);
  revalidatePath("/admin/pages");
}

// ─── Site Config Actions ───

export async function updateSiteConfig(prevSha: string, yamlContent: string) {
  await requireAuth();
  const path = "content/site.yaml";

  await createOrUpdateFile(
    path,
    yamlContent,
    await buildCommitMessage("update", "site config", ""),
    prevSha
  );

  revalidatePath("/admin/site-config");
}

// ─── Helpers ───

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildFrontmatter(data: Record<string, unknown>): string {
  let yaml = "---\n";
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${key}: []\n`;
      } else {
        yaml += `${key}:\n`;
        for (const item of value) {
          yaml += `  - ${item}\n`;
        }
      }
    } else if (typeof value === "boolean") {
      yaml += `${key}: ${value}\n`;
    } else if (typeof value === "number") {
      yaml += `${key}: "${value}"\n`;
    } else if (typeof value === "string") {
      // Quote strings that contain special characters
      if (value.includes(":") || value.includes("#") || value.includes('"')) {
        yaml += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
      } else {
        yaml += `${key}: "${value}"\n`;
      }
    }
  }
  yaml += "---\n";
  return yaml;
}