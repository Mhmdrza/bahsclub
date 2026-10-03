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
import { getArticleBySlug, getSiteConfig } from "@/lib/content";
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
    line: "شنیدن فعال، پرسش دقیق و شفاف‌سازی ادعا؛ بدون این پایه، سخن به هم می‌ریزد و سوءتفاهم‌ها تکرار می‌شوند.",
  },
  {
    id: "nabard",
    icon: Swords,
    warrior: "تشخیص مغالطه و تاکتیک (تیزبینی)",
    line: "شناخت مغالطه‌ها و تاکتیک‌های انحرافی زیر فشار؛ تا کمتر در دام فریب، انحراف و فشار روانی بیفتی.",
  },
  {
    id: "ghodrat-kalam",
    icon: Crown,
    warrior: "ذهن و میدان معنا (قدرت کلام)",
    line: "دیدن چارچوب‌بندی و روایت، و اینکه معنا چگونه ساخته می‌شود؛ تا حقیقت را از پشت قالب‌ها ببینی.",
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
    title: "یادگیری مبانی سواد قضاوت",
    line: "اصول بنیادین را مرور کن: تفکیک ادعا از تفسیر، شناخت ساختار استدلال و بررسی منصفانه در تالار آموزش — بدون پیش‌نیاز.",
    href: "/learn/judgment-literacy",
    cta: "شروع دورهٔ سواد قضاوت",
  },
  {
    n: "۳",
    icon: Flame,
    title: "ورود به باشگاه",
    line: "ادعایت را برای بررسی به اشتراک بگذار یا در گفت‌وگوهای جاری همراه شو؛ اندیشه‌ها روی میز سنجیده می‌شوند، بدون اجبار به توافق.",
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
  "فروتنی در نقطهٔ آغاز: پذیرش این‌که ممکن است اشتباه کنیم؛ نقد بر ادعا و شواهد وارد می‌شود، نه بر هویت و انگیزهٔ گوینده.",
  "آزادی و استقلال اندیشه: هیچ اجباری برای تغییر باور وجود ندارد و توافق ساختگی هدف نیست؛ تغییر دیدگاه تنها به انتخاب خود فرد رخ می‌دهد.",
  "دعوت به‌جای تقابل: دیگری را همکار خود در شناخت واقعیت می‌دانیم، نه مانعی در برابر خود؛ درهای گفت‌وگو همواره گشوده‌اند.",
  "معیار یگانه برای سنجش: همان استانداردی را که برای ارزیابی نظر دیگران به کار می‌گیریم، برای باورهای خود نیز نگه می‌داریم.",
];

export default function HomePage() {
  const levels = LADDER.map((rung) => ({
    ...rung,
    meta: LADDER_META.find((m) => m.id === rung.id)!,
  }));

  const taste = QUICK_TASTE.map((slug) => getArticleBySlug(slug)).filter(
    (a) => a !== undefined
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <HeroSection />

      {/* 2. Three-level ladder: پایه / تیزبینی / قدرت کلام */}
      <section className="mb-20 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">
            تالار آموزش — از پایه تا قدرت کلام
          </p>
          <h2 className="text-3xl font-extrabold">
            سه پلهٔ مهارت: پایه، تیزبینی، قدرت کلام
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            نردبان قدرت کلام یک تفنن گذرا نیست؛ ابزاری برای شفاف اندیشیدن و بیان
            رساست که هزینه‌های روزمرهٔ سوءتفاهم را کم می‌کند. در پایه می‌آموزی
            دقیق بشنوی و روشن بگویی، در تیزبینی مغالطه و تاکتیک را می‌بینی، و در
            قدرت کلام چارچوب و میدان معنا را می‌شناسی.
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
          <h2 className="text-3xl font-extrabold">از تالار آموزش تا باشگاه</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            آموزش و سنجش دو بخش جداناپذیرند؛ در تالار آموزش مفاهیم و فنون را فرا
            می‌گیری و در باشگاه، با دیگران ادعاها را روی میز می‌سنجی.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {STEPS.map((s) => {
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
            <p className="eyebrow mb-1">فلسفه و ارزش‌های ما</p>
            <h3 className="text-lg font-bold">
              تئوری بدون گفت‌وگو خام می‌ماند و گفت‌وگو بدون تئوری به آشفتگی می‌رسد
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
        <p className="eyebrow eyebrow-centered mb-3">آغاز مسیر</p>
        <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl">
          در تالار آموزش یاد بگیر، در باشگاه تجربه کن
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted">
          با ارزیابی جایگاهت در نردبان قدرت کلام، مهارت‌های تفکر روشن را از پایه
          فرا بگیر. هر زمان خواستی به جمع باشگاه بپیوند تا ادعاها را در
          فضایی منصفانه و قاعده‌مند با دیگران به سنجش بگذاری.
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
            ورود به باشگاه
            <ArrowLeft className="h-4 w-4 text-accent" />
          </Link>
        </div>
        <p className="mt-8 text-xs text-muted">
          تمام گفت‌وگوها بر پایهٔ فروتنی، آزادی اندیشه و با احترام کامل به استقلال
          نظر برگزار می‌شوند.
        </p>
      </section>
    </div>
  );
}
