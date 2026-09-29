import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Shield,
  Swords,
  Flame,
  Dumbbell,
  BookOpen,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import {
  getArticleBySlug,
  getLessonBySlug,
  getSiteConfig,
} from "@/lib/content";
import { LADDER } from "@/lib/ladder";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  description: getSiteConfig().description,
});

const LADDER_META = [
  {
    id: "paye",
    icon: Shield,
    warrior: "ایستادن و وضوح (پایه)",
    line: "شنیدن فعال و شفاف‌سازی ادعا؛ بدون این پایهٔ استوار، با اولین ضربه مغالطه تعادلت را از دست می‌دهی.",
  },
  {
    id: "nabard",
    icon: Swords,
    warrior: "تکنیک در تعارض (نبرد)",
    line: "شناخت مغالطه‌ها و بدل زدن زیر فشار؛ همان سلاحی که سر میز مناظره مانع انحراف بحث می‌شود.",
  },
  {
    id: "ghodrat-kalam",
    icon: Crown,
    warrior: "ذهن و میدان معنا (تسلط)",
    line: "مدیریت صفحهٔ شطرنج کلام و افشای چارچوب‌بندی‌ها؛ کسی که میدان را می‌شناسد، مرزهای حقیقت را ترسیم می‌کند.",
  },
];

const STEPS = [
  {
    n: "۱",
    icon: Dumbbell,
    title: "سنجش سطح در تالار آموزش",
    line: "با آزمون نردبان قدرت کلام، جایگاهت را در تالار آموزش پیدا کن و مهارت‌های پایه تا پیشرفته را مرور کن.",
    href: "/ladder#assessment",
    cta: "سنجش سطح در نردبان",
  },
  {
    n: "۲",
    icon: BookOpen,
    title: "فراگیری تئوری «سواد قضاوت»",
    line: "مطالعهٔ مبانی: تفکیک ادعا از تفسیر، ساختار استدلال و نقد منصفانه در تالار آموزش — بدون پیش‌نیاز.",
    href: "/learn/judgment-literacy",
    cta: "شروع دوره",
  },
  {
    n: "۳",
    icon: Flame,
    title: "ورود به باشگاه مناظره",
    line: "ایده‌ات را به چالش بگذار یا در مناظره‌های در جریان شرکت کن؛ منطق در برابر منطق، بدون تحمیل عقیده.",
    href: "/club",
    cta: "ورود به باشگاه",
  },
];

const QUICK_TASTE = [
  "claim-vs-interpretation",
  "steelman-opponent",
  "confidence-and-uncertainty",
];

const WHY = [
  "دو بال یک پرواز: تالار آموزش برای یادگیری تئوری‌ها و فنون، باشگاه برای مناظره و آزمودن عملی استدلال.",
  "قوانین روشن: چارچوب باشگاه مانع از تبدیل مناظره به جدل و هیاهو می‌شود.",
  "استقلال کامل اندیشه: قرار نیست کسی نظرش را عوض کند یا به توافق اجباری برسیم؛ ارزش در وضوح استدلال است.",
  "محک واقعی باورها: در باشگاه باورها زیر بار نقد سنجیده می‌شوند تا استحکام منطقی‌شان معلوم شود.",
];

export default function HomePage() {
  const levels = LADDER.map((rung) => ({
    ...rung,
    meta: LADDER_META.find((m) => m.id === rung.id)!,
  }));

  const taste = QUICK_TASTE.map((slug) => getArticleBySlug(slug)).filter(
    (a) => a !== undefined
  );
  const flagship = getLessonBySlug("judgment-literacy");
  const steps = STEPS.map((s) =>
    s.href === "/learn/judgment-literacy" && flagship
      ? { ...s, title: `مسیر «${flagship.title}» را بگذران` }
      : s
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <HeroSection />

      {/* 2. Three-level ladder: پایه / نبرد / قدرت کلام */}
      <section className="mb-20 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">
            تالار آموزش — از تئوری تا تسلط
          </p>
          <h2 className="text-3xl font-extrabold">
            سه‌گانهٔ مهارت: پایه، نبرد، قدرت کلام
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            پیش از نشستن سر میز مناظره، مهارت‌ها را در تالار آموزش صیقل می‌دهی:
            در پایه ایستادن و شنیدن را یاد می‌گیری، در نبرد فنون مواجهه با مغالطه‌ها را می‌آموزی، و در قدرت کلام چارچوب استدلال را هدایت می‌کنی.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {levels.map(({ id, step, title, subtitle, meta }) => {
            const Icon = meta.icon;
            return (
              <Link
                key={id}
                href={`/ladder#rung-${id}`}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow"
              >
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="eyebrow mb-1">
                  {step} — {meta.warrior}
                </span>
                <h3 className="mb-1 font-semibold leading-snug group-hover:text-accent">
                  {title}
                </h3>
                <p className="mb-2 text-xs font-medium text-muted">{subtitle}</p>
                <p className="mb-4 text-xs leading-relaxed text-muted">
                  {meta.line}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  دیدن آموزش‌های این مرحله
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Start here: the unified loop (Training to Ring) */}
      <section id="start" className="mb-20 scroll-mt-24 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">پیوند تئوری و عمل</p>
          <h2 className="text-3xl font-extrabold">از تالار آموزش تا باشگاه مناظره</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            آموزش و مناظره دو بخش جداناپذیرند؛ در تالار آموزش مفاهیم و فنون را فرا می‌گیری و در باشگاه سر میز مناظره استدلال‌هایت را می‌آزمایی.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.n}
                href={s.href}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
                    {s.n}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border text-muted group-hover:text-accent group-hover:border-accent/30 transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mb-1 font-semibold leading-snug group-hover:text-accent">
                  {s.title}
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-muted">{s.line}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  {s.cta}
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {taste.length > 0 && (
          <p className="mt-6 text-center text-xs leading-relaxed text-muted">
            وقت کمی داری؟ یک طعم کوتاه:{" "}
            {taste.map((a, i) => (
              <span key={a.slug}>
                {i > 0 && " · "}
                <Link
                  href={`/articles/${a.slug}`}
                  className="font-semibold text-accent hover:underline"
                >
                  {a.title}
                </Link>
              </span>
            ))}
          </p>
        )}
      </section>

      {/* 4. Why: one line of mission */}
      <section className="mb-20 sm:mb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="eyebrow mb-1">فلسفهٔ بحث‌کلاب</p>
            <h3 className="text-lg font-bold">
              تئوری بدون مناظره ناقص است؛ مناظره بدون تئوری به هیاهو می‌رسد
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              {WHY.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/mission"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
          >
            خواندن مأموریت ما
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 5. Dual CTA: Study Hall + Club */}
      <section className="border-t border-border pt-12 text-center sm:pt-16">
        <p className="eyebrow eyebrow-centered mb-3">شروع مسیر</p>
        <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl">
          در تالار آموزش مهارت کسب کن، در باشگاه مناظره کن
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted">
          آزمون نردبان قدرت کلام مشخص می‌کند در کجای مسیر یادگیری ایستاده‌ای؛ از سطح پایه شروع کنی یا آماده‌ای سر میز مناظرهٔ باشگاه بنشینی.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/ladder#assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
          >
            شروع از تالار آموزش (نردبان)
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/club"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
          >
            ورود به باشگاه مناظره
            <ArrowLeft className="h-4 w-4 text-accent" />
          </Link>
        </div>
        <p className="mt-8 text-xs text-muted">
          همهٔ مناظره‌ها در چارچوب قوانین باشگاه و با احترام کامل به استقلال رأی طرفین برگزار می‌شود.
        </p>
      </section>
    </div>
  );
}
