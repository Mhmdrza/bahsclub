import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  ROOT,
  loadArticles,
  bySlug,
  splitIdea,
} from "./lib/video-content.mjs";

const LESSONS_DIR = path.join(ROOT, "content", "lessons");
const VIDEO_DIR = path.join(ROOT, "video");

// Scene durations in seconds. Override later with measured VO lengths.
export const DEFAULT_SCENE_DURATIONS = { hook: 5, idea: 6, points: 12, takeaway: 6, next: 5 };

function loadLessons() {
  return fs
    .readdirSync(LESSONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(LESSONS_DIR, file), "utf8"));
      return {
        slug: data.slug ?? file.replace(/\.md$/, ""),
        title: data.title,
        description: data.description,
        order: data.order ?? 99,
        steps: data.steps ?? [],
      };
    })
    .sort((a, b) => a.order - b.order);
}

function buildScenes(article, membership, durations) {
  const [head] = splitIdea(article.keyIdea ?? "");
  const tldr = article.tldr;
  const line = tldr?.line ?? article.keyIdea ?? null;
  const points = tldr?.points ?? [];
  const takeaway = tldr?.takeaway ?? null;

  const next = membership?.next;
  const nextTitle = next?.data?.title ?? next?.title ?? null;
  const scenes = [
    {
      kind: "hook",
      duration: durations.hook,
      eyebrow: `حرف‌کلاب · ${membership?.seriesTitle ?? article.data.category ?? "آموزش"}`,
      title: article.data.title,
      body: article.data.description ?? "",
      meta: [
        article.data.category,
        article.data.readingTime ? `${article.data.readingTime} دقیقه مطالعه` : null,
      ].filter(Boolean),
      narration: `${article.data.title}. ${article.data.description ?? ""}`.trim(),
    },
    {
      kind: "idea",
      duration: durations.idea,
      eyebrow: "در یک خط",
      title: line ?? head,
      body: "",
      narration: line ?? article.keyIdea,
    },
    {
      kind: "points",
      duration: durations.points,
      eyebrow: "نکته‌های کلیدی",
      title: "نکته‌های کلیدی",
      bullets: points,
      narration: `نکته‌های کلیدی: ${points.join("؛ ")}`,
    },
    {
      kind: "takeaway",
      duration: durations.takeaway,
      eyebrow: "ته‌خط",
      title: takeaway ?? "",
      body: "",
      narration: takeaway ? `ته‌خط: ${takeaway}` : "",
    },
    {
      kind: "next",
      duration: durations.next,
      eyebrow: nextTitle ? "قسمت بعدی" : "پایان این مسیر",
      title: nextTitle ?? "ممنون که همراه بودی",
      body: nextTitle
        ? `ادامه در «${membership.seriesTitle}»`
        : "بقیهٔ مسیرهای حرف‌کلاب در کانال",
      cta: "حرف‌کلاب · جایی برای تجربهٔ قدرت گفت‌وگو",
      narration: nextTitle
        ? `قسمت بعدی: ${nextTitle}.`
        : "به پایان این مسیر رسیدیم. مسیرهای دیگر را در کانال ببینید.",
    },
  ];
  return scenes;
}

function youtubeMeta(video, membership) {
  const seriesTitle = membership.seriesTitle;
  const idx = membership.index + 1;
  const title = `${idx}. ${video.data.title} | ${seriesTitle}`;
  const nextLine = membership.next
    ? `\n\n🎬 قسمت بعدی: ${membership.next.data.title}\n${membership.nextUrl}`
    : `\n\n✅ این آخرین قسمت از «${seriesTitle}» بود.`;
  const description =
    `${video.data.description}\n\n` +
    `📚 پلی‌لیست «${seriesTitle}»:\n${membership.playlistUrl}` +
    nextLine +
    `\n\n🌐 وب‌سایت: ${membership.siteUrl}/articles/${video.slug}` +
    `\n#حرف‌کلاب #تفکرنقاد #گفت‌وگو`;
  const tags = [
    ...(video.data.tags ?? []),
    seriesTitle,
    "حرف‌کلاب",
    "تفکر نقاد",
    "گفت‌وگوی سازنده",
  ];
  return { title, description, tags };
}

function main() {
  const articles = loadArticles();
  const get = bySlug(articles);
  const lessons = loadLessons();

  const memberships = new Map();
  for (const lesson of lessons) {
    lesson.steps.forEach((slug, i) => {
      const video = get(slug);
      if (!video) {
        console.warn(`⚠ lesson ${lesson.slug}: unknown step ${slug}`);
        return;
      }
      const list = memberships.get(slug) ?? [];
      list.push({
        seriesSlug: lesson.slug,
        seriesTitle: lesson.title,
        index: i,
        total: lesson.steps.length,
        prev: lesson.steps[i - 1] ? get(lesson.steps[i - 1]) : null,
        next: lesson.steps[i + 1] ? get(lesson.steps[i + 1]) : null,
        nextSlug: lesson.steps[i + 1] ?? null,
      });
      memberships.set(slug, list);
    });
  }

  fs.mkdirSync(path.join(VIDEO_DIR, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(VIDEO_DIR, "srt"), { recursive: true });

  const plan = { generatedAt: new Date().toISOString(), series: [], videos: {} };

  for (const lesson of lessons) {
    const videos = [];
    lesson.steps.forEach((slug, i) => {
      const video = get(slug);
      if (!video) return;
      const membership = memberships.get(slug).find((m) => m.seriesSlug === lesson.slug);
      const enriched = {
        seriesSlug: lesson.slug,
        seriesTitle: lesson.title,
        index: i,
        total: lesson.steps.length,
        next: membership.next,
        nextSlug: membership.nextSlug,
        prevSlug: lesson.steps[i - 1] ?? null,
        siteUrl: "https://harfclub.ir",
        playlistUrl: `https://www.youtube.com/playlist?list=<PLAYLIST_${lesson.slug.toUpperCase().replace(/-/g, "_")}>`,
        nextUrl: membership.nextSlug ? `https://youtu.be/<VIDEO_${membership.nextSlug.toUpperCase().replace(/-/g, "_")}>` : null,
      };
      videos.push(slug);
      if (!plan.videos[slug]) {
        const scenes = buildScenes(video, enriched, DEFAULT_SCENE_DURATIONS);
        plan.videos[slug] = {
          slug,
          title: video.data.title,
          description: video.data.description,
          category: video.data.category,
          level: video.data.level,
          readingTime: video.data.readingTime,
          tags: video.data.tags ?? [],
          keyIdea: video.keyIdea,
          tldr: video.tldr,
          scenes,
          totalDuration: scenes.reduce((s, sc) => s + sc.duration, 0),
          memberships: [],
          youtube: youtubeMeta(video, enriched),
        };
      }
      plan.videos[slug].memberships.push({
        seriesSlug: lesson.slug,
        seriesTitle: lesson.title,
        index: i,
        total: lesson.steps.length,
        prevSlug: enriched.prevSlug,
        nextSlug: enriched.nextSlug,
      });
    });
    plan.series.push({
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      videos,
    });
  }

  fs.writeFileSync(path.join(VIDEO_DIR, "plan.json"), JSON.stringify(plan, null, 2), "utf8");

  // Per-video narration scripts (for recording VO) + scene-level SRT.
  for (const [slug, v] of Object.entries(plan.videos)) {
    const lines = [
      `# ${v.title}`,
      ``,
      `مدت هدف: ~${v.totalDuration.toFixed(0)} ثانیه`,
      ``,
    ];
    let t = 0;
    const srt = [];
    v.scenes.forEach((sc, i) => {
      lines.push(`## صحنه ${i + 1} (${sc.duration}s) — ${sc.eyebrow}`);
      lines.push(``);
      lines.push(sc.narration);
      lines.push(``);
      const start = t;
      const end = t + sc.duration;
      srt.push(
        `${i + 1}\n${fmtSrt(start)} --> ${fmtSrt(end)}\n${sc.narration}\n`
      );
      t = end;
    });
    fs.writeFileSync(path.join(VIDEO_DIR, "scripts", `${slug}.md`), lines.join("\n"), "utf8");
    fs.writeFileSync(path.join(VIDEO_DIR, "srt", `${slug}.srt`), srt.join("\n"), "utf8");
  }

  const totalVideos = Object.keys(plan.videos).length;
  console.log(`✓ ${lessons.length} series, ${totalVideos} unique videos, plan written to video/plan.json`);
  for (const s of plan.series) console.log(`  • ${s.title} — ${s.videos.length} videos (${s.slug})`);
}

function fmtSrt(sec) {
  const ms = Math.floor((sec % 1) * 1000);
  const s = Math.floor(sec) % 60;
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

main();
