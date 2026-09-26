import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLessonBySlug,
  getLessonSlugs,
} from "@/lib/content";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LessonStepsList } from "@/components/LessonStepsList";
import { LessonProgressDisplay } from "@/components/LessonProgressDisplay";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, courseJsonLd, pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lessonSlug: string }>;
}

export async function generateStaticParams() {
  return getLessonSlugs().map((lessonSlug) => ({ lessonSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) return {};
  return pageMetadata({
    path: `/learn/${lessonSlug}`,
    title: lesson.title,
    description: lesson.description,
  });
}

export default async function LessonPage({ params }: Props) {
  const { lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) notFound();

  const breadcrumbs = [
    { label: "خانه", href: "/" },
    { label: "مسیر یادگیری", href: "/learn" },
    { label: lesson.title },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <JsonLd data={courseJsonLd(lesson)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mb-2 text-3xl font-bold">{lesson.title}</h1>
      <p className="mb-6 text-muted">{lesson.description}</p>
      <LessonProgressDisplay
        stepSlugs={lesson.steps}
        validSlugs={lesson.resolvedSteps.map((a) => a.slug)}
        className="mb-8"
      />
      <LessonStepsList lesson={lesson} />
    </div>
  );
}
