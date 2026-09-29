import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Shield,
  Swords,
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
    warrior: "گارد و ایستادن",
    line: "بدون این پایه، بحث از ثانیهٔ اول فرومی‌ریزد: خوب نشنوی، داری با خودت حرف می‌زنی.",
  },
  {
    id: "nabard",
    icon: Swords,
    warrior: "دفاع و ضدحمله",
    line: "سر میز مناظره، مغالطه و تاکتیک حریف را در هوا بگیر، بحث را به مسیر برگردان و جا نزن.",
  },
  {
    id: "ghodrat-kalam",
    icon: Crown,
    warrior: "ذهن و میدان",
    line: "کسی که زمین بازی و چارچوب معنا را تعریف می‌کند، نتیجهٔ مناظره را رقم می‌زند.",
  },
];

const STEPS = [
  {
    n: "۱",
    title: "بفهم کجای مسیری",
    line: "آزمون نردبان می‌گوید باید از گارد پایه شروع کنی یا آماده‌ای سر میز مناظره بنشینی.",
    href: "/ladder#assessment",
    cta: "رفتن به آزمون",
  },
  {
    n: "۲",
    title: "مسیر «سواد قضاوت» را بگذران",
    line: "پایهٔ مبارزهٔ کلامی: تفکیک ادعا از تفسیر و ساختن استدلال محکم — بدون پیش‌نیاز.",
    href: "/learn/judgment-literacy",
    cta: "شروع مسیر",
  },
  {
    n: "۳",
    title: "مهارتت را صیقل بده",
    line: "آموزش‌ها را به عمل تبدیل کن: تمرین‌های کوتاه برای آبدیده کردن استدلال.",
    href: "/practice",
    cta: "دیدن تمرین‌ها",
  },
];

const QUICK_TASTE = [
  "claim-vs-interpretation",
  "steelman-opponent",
  "confidence-and-uncertainty",
];

const WHY = [
  "ساختار داریم، نه هرج‌ومرج — قوانین رینگ را امن نگه می‌دارند",
  "استقلال رأی محترم است — نه تغییر نظر، نه توافق اجباری",
  "هدف سنجش استدلال است، نه بردن و باختن",
  "باشگاه است، نه تماشاخانه — بدون تمرین، مهارت نمی‌آید",
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
            سالن تمرین — سه پله
          </p>
          <h2 className="text-3xl font-extrabold">
            سه سطح: پایه، نبرد، قدرت کلام
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            پایه یعنی گارد گرفتن و شنیدن؛ مهارت‌های سطح ۲ و ۳ (نبرد و قدرت کلام)
            سلاح‌های اصلی تو سر میز مناظره‌اند. ببین کجای مسیری و قدم بعدی‌ات چیست.
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
                  دیدن مرحله در نردبان
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Start here: the only path */}
      <section id="start" className="mb-20 scroll-mt-24 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">از کجا شروع کنی؟</p>
          <h2 className="text-3xl font-extrabold">سه قدم تا اولین محکِ جدی</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            لازم نیست همه‌چیز را بخوانی؛ همین سه قدم کافی است.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((s) => (
            <Link
              key={s.n}
              href={s.href}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow"
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
                {s.n}
              </span>
              <h3 className="mb-1 font-semibold leading-snug group-hover:text-accent">
                {s.title}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-muted">{s.line}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
                {s.cta}
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
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
            <p className="eyebrow mb-1">چرا بحث‌کلاب؟</p>
            <h3 className="text-lg font-bold">
              گفت‌وگو استعداد نیست؛ مهارت است
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
              {WHY.map((w) => (
                <li key={w} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/70" />
                  {w}
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

      {/* 5. Single CTA */}
      <section className="border-t border-border pt-12 text-center sm:pt-16">
        <p className="eyebrow eyebrow-centered mb-3">قدم اول</p>
        <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl">
          بفهم کجای مسیری
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted">
          آزمون کوتاه نردبان می‌گوید از پایه شروع کنی، به نبرد بروی، یا وقتش
          رسیده به قدرت کلام فکر کنی. اول تمرین، بعد رینگ.
        </p>
        <Link
          href="/ladder#assessment"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          پیدا کردن نقطهٔ شروع
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <p className="mt-8 text-xs text-muted">
          آماده‌ای ایده‌ات را در یک مناظرهٔ ساختارمند محک بزنی؟{" "}
          <Link href="/club" className="font-semibold text-accent hover:underline">
            وارد رینگ باشگاه شو
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
