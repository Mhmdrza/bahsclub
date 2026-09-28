"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass } from "lucide-react";

type HeroVariant = {
  eyebrow: string;
  heading: string;
  body: string;
  bodyStrong: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const VARIANTS: HeroVariant[] = [
  {
    eyebrow: "نقشهٔ رشد — پایه · نبرد · قدرت کلام",
    heading: "گفت‌وگو مثل رزم است؛ با گارد شروع می‌شود، با تعیین میدان تمام",
    body: "حرف زدن را در کودکی یاد گرفتیم؛ گفت‌وگوی واقعی تمرین رزمنده می‌خواهد: اول ایستادن و شنیدن، بعد جا خالی دادن و برگرداندن ضربه در تعارض، و آخر دیدن زمین بازی و چهارچوب معنا.",
    bodyStrong: "سه سطح، بدون ادعا، از گارد پایه تا استراتژی.",
    primary: { label: "شروع از نردبان", href: "/ladder#assessment" },
    secondary: { label: "دیدن هر سه سطح", href: "/ladder" },
  },
  {
    eyebrow: "هنر دفاع و تسلط فکری",
    heading: "کسی که معنا را تعریف می‌کند، پیروز گفت‌وگوست",
    body: "بیشتر ما در بحث‌ها یا گیج می‌شویم یا فریاد می‌زنیم. اینجا ابزار رزمی کلام را یاد می‌گیری: تشخیص مغالطه زیر فشار، خنثی کردن فریب‌های روانی، و دفاع از حقیقت بدون خشونت.",
    bodyStrong: "نه برای تحقیر دیگران؛ برای اینکه دستکاری نشوی.",
    primary: { label: "آزمون نقطهٔ شروع", href: "/ladder#assessment" },
    secondary: { label: "کاوش کتابخانه", href: "/articles" },
  },
  {
    eyebrow: "تربیت ذهن و کلام",
    heading: "هیچ استادی با ضربهٔ آخر شروع نکرده است",
    body: "پایه: گوش دادن و شفافیت ادعا. نبرد: مدیریت تعارض و شناخت نفوذ. قدرت کلام: شکستن روایت و روایت‌سازی. برای ساختن کلامی که وزن دارد، اول باید بدانی روی کدام پله ایستاده‌ای.",
    bodyStrong: "جای خودت را در نردبان پیدا کن.",
    primary: { label: "سنجش سطح خود", href: "/ladder#assessment" },
    secondary: { label: "مسیر سواد قضاوت", href: "/learn/judgment-literacy" },
  },
  {
    eyebrow: "یک پرسش صادقانه",
    heading: "وقتی بحث داغ می‌شود، گاردت باز است یا آماده‌ای؟",
    body: "در فضای پرتنش، آدم‌ها استدلال نمی‌کنند، ضربه می‌زنند. ما سه لایهٔ تمرین ساخته‌ایم تا یاد بگیری آرام بمانی، تکنیک حریف را روی هوا بگیری، و زمین بازی را از جنگ به فهمیدن تغییر دهی.",
    bodyStrong: "از تمرین نفس و سکوت تا فنون معناداری.",
    primary: { label: "کجای نردبانی؟", href: "/ladder#assessment" },
    secondary: { label: "آشنایی با مأموریت", href: "/mission" },
  },
];

function pickVariant(): HeroVariant {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

export default function HeroSection() {
  const [v] = useState<HeroVariant>(pickVariant);

  return (
    <section className="relative mb-20 overflow-hidden rounded-3xl border border-border/80 bg-surface/60 px-6 py-12 text-center shadow-sm sm:mb-24 sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Old philosophers debating"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="scale-105 object-cover object-center opacity-80 blur-[2px] filter transition-all dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <p className="eyebrow eyebrow-centered mb-4">{v.eyebrow}</p>
      <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-[1.4] sm:text-5xl sm:leading-[1.4]">
        {v.heading}
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
        {v.body}{" "}
        <strong className="font-semibold text-foreground">
          {v.bodyStrong}
        </strong>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={v.primary.href}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          <Compass className="h-4 w-4" />
          {v.primary.label}
        </Link>
        <Link
          href={v.secondary.href}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          {v.secondary.label}
          <ArrowLeft className="h-4 w-4 text-accent" />
        </Link>
      </div>
    </section>
  );
}
