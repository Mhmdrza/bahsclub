import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass } from "lucide-react";

const HERO = {
  eyebrow: "همه چیز رو همگان دانند",
  heading:
    "جایی برای شفاف اندیشیدن؛ کنار هم ادعاها را می‌سنجیم تا حقیقت روشن‌تر شود",
  body: "بحث‌کلاب فضایی برای سنجش عیار فکرهاست، دور از هیاهو و قضاوت‌های شتاب‌زده. ادعایت را با شواهد مطرح می‌کنی، مغالطه‌ها را با هم می‌بینیم و سخن را گام‌به‌گام شفاف‌تر می‌کنیم. فرد روبه‌روی میز، همراه تو در جست‌وجوی حقیقت است.",
  bodyStrong:
    "موضوع، اشخاص نیستند؛ ادعا روی میز می‌ماند تا شفاف‌تر شود و با هم به حقیقت نزدیک‌تر شویم.",
  primary: { label: "ورود به باشگاه", href: "/club" },
  secondary: { label: "قوانین گفت‌وگو در باشگاه", href: "/club/rules" },
};

export default function HeroSection() {
  return (
    <section className="relative mb-20 overflow-hidden rounded-3xl border border-border/80 bg-surface/60 px-6 py-12 text-center shadow-sm sm:mb-24 sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="گفت‌وگوی فیلسوفان"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="scale-105 object-cover object-center opacity-80 blur-[2px] filter transition-all dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <p className="eyebrow eyebrow-centered mb-4">{HERO.eyebrow}</p>
      <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-[1.4] sm:text-5xl sm:leading-[1.4]">
        {HERO.heading}
      </h1>
      <div
        aria-hidden
        className="mx-auto mb-6 flex items-center justify-center gap-2"
      >
        <span className="w-12 border-t border-gold/60" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
        <span className="w-12 border-t border-gold/60" />
      </div>
      <p className="mx-auto mb-10 max-w-2xl text-lg leading-loose text-muted">
        {HERO.body}{" "}
        <strong className="font-semibold text-foreground">
          {HERO.bodyStrong}
        </strong>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={HERO.primary.href}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          <Compass className="h-4 w-4" />
          {HERO.primary.label}
        </Link>
        <Link
          href={HERO.secondary.href}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          {HERO.secondary.label}
          <ArrowLeft className="h-4 w-4 text-accent" />
        </Link>
      </div>
    </section>
  );
}
