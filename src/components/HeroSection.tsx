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
    eyebrow: "باشگاه مبارزهٔ کلام — بدون مشت، با استدلال",
    heading: "قانون اول بحث‌کلاب: حرف بزن. قانون دوم: با ساختار حرف بزن",
    body: "اینجا مثل فایت‌کلاب است؛ اما به‌جای مشت، کلام روبه‌روی کلام می‌ایستد. نبردی بدون هیاهو و تعارف: ایده‌ات را وسط می‌گذاری تا زیر ضربهٔ استدلال‌ها چکش‌کاری شود؛ نه برای تحقیر، بلکه تا عیار واقعی فکر معلوم شود.",
    bodyStrong: "قوانین رینگ مشخص است؛ بدون ساختار، هر مناظره‌ای به هیاهو ختم می‌شود.",
    primary: { label: "ورود به باشگاه", href: "/club" },
    secondary: { label: "قوانین رینگ", href: "/club/rules" },
  },
  {
    eyebrow: "منطق در برابر منطق — مثل شطرنج",
    heading: "بحث، شطرنج است؛ حرکت با استدلال، نه با صدای بلند",
    body: "در شطرنج هر حرکت پاسخی دارد و هیچ مهره‌ای بی‌قاعده جابه‌جا نمی‌شود. بحث ساختاریافته هم همین است: ادعا، شواهد، پاسخ. ما قواعد بازی را گذاشته‌ایم تا معلوم شود کدام ادعا واقعاً روی پای خودش می‌ایستد و کدام فقط ادعاست.",
    bodyStrong: "بدون منطق و نوبت، شطرنج به تختهٔ شکسته‌شده تبدیل می‌شود.",
    primary: { label: "دیدن قوانین", href: "/club/rules" },
    secondary: { label: "کاوش کتابخانه", href: "/articles" },
  },
  {
    eyebrow: "تست فشار ایده‌ها",
    heading: "ایده‌ات را به اتاق تست فشار بیاور",
    body: "هیچ سازه‌ای بدون تست استرس به کار نمی‌آید؛ فکر هم همین است. بحث‌کلاب آزمایشگاه فشار برای باورهاست: ادعایت را روی میز می‌گذاری تا از هر زاویه نقد شود. اگر دوام آورد، استوارتر می‌شوی؛ اگر فروریخت، از یک باور غلط نجات پیدا کرده‌ای.",
    bodyStrong: "هدف، شکست دادن تو نیست؛ آزمودن تاب‌آوری استدلال است.",
    primary: { label: "طرح یک چالش", href: "/club/challenges/new" },
    secondary: { label: "آشنایی با مأموریت", href: "/mission" },
  },
  {
    eyebrow: "سالن تمرین — نردبان قدرت کلام",
    heading: "پیش از ورود به رینگ، گارد گرفتن را یاد بگیر",
    body: "نردبان قدرت کلام، سالن تمرین است: سطح ۱ گارد و ایستادن در طوفان است؛ سطوح ۲ و ۳ (تکنیک نبرد و قدرت کلام) دقیقاً همان مهارت‌های استدلال و فنون دفاع‌اند که در رینگ مناظره به کار می‌آیند.",
    bodyStrong: "اول در سالن عرق بریز، بعد سر میز بحث بنشین.",
    primary: { label: "سنجش سطح در نردبان", href: "/ladder#assessment" },
    secondary: { label: "دیدن هر سه سطح", href: "/ladder" },
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
