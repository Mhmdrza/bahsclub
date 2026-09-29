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
    eyebrow: "باشگاه مبارزه، بدون مشت — فقط با استدلال",
    heading: "اینجا مثل فایت‌کلاب است؛ فقط به‌جای مشت، با کلام روبه‌رو می‌شوی",
    body: "بحث‌کلاب جای گپ‌های بی‌حاصل و تعارفات روزمره نیست؛ رینگ به چالش کشیدن اندیشه‌هاست. بدون داد زدن، بدون تلاش برای تحمیل عقیده و بدون اصرار بر رسیدن به توافق. یک ایده می‌آوری، در چارچوب قوانینی سفت‌وسخت با منطق نقدش می‌کنند، و در پایان عیار واقعی‌اش آشکار می‌شود.",
    bodyStrong: "قرار نیست نظر کسی عوض شود؛ قرار است استدلال‌ها زیر بار فشار محک بخورند.",
    primary: { label: "ورود به رینگ بحث", href: "/club" },
    secondary: { label: "قوانین رینگ", href: "/club/rules" },
  },
  {
    eyebrow: "منطق در برابر منطق — با قواعد دقیق",
    heading: "بحث تصادفی نیست؛ مثل شطرنج، حرکت به حرکت با منطق است",
    body: "در شطرنج کسی داد نمی‌زند و مهره پرت نمی‌کند؛ نوبت هست، ساختار هست، و منطق مقابل منطق می‌ایستد. بحث‌کلاب رینگی با قوانین مشخص برای مناظره است تا گفت‌وگو به لجن‌پراکنی کشیده نشود. نه برای اینکه کسی تسلیم شود یا به توافق برسیم؛ فقط برای اینکه معلوم شود کدام ایده روی صفحهٔ استدلال دوام می‌آورد.",
    bodyStrong: "استقلال رأی تو محفوظ است؛ اینجا صفحهٔ بازی است، نه کارخانهٔ اجماع.",
    primary: { label: "دیدن قوانین بازی", href: "/club/rules" },
    secondary: { label: "کاوش چالش‌ها", href: "/club" },
  },
  {
    eyebrow: "تست استرس برای باورها",
    heading: "ایده‌ات را به اتاق تست فشار بیاور؛ ببین چقدر تاب می‌آورد",
    body: "هیچ سازه‌ای بدون تست فشار وارد دنیای واقعی نمی‌شود؛ چرا باورهات بدون آزمون بمانند؟ در بحث‌کلاب، ادعایت را روی میز می‌گذاری تا از هر زاویه نقد شود. نه کسی می‌خواهد مجبورت کند نظرت را عوض کنی، و نه دنبال توافق فرمایشی هستیم. اگر استدلالت ایستاد، ریشه دارد؛ اگر لرزید، ترک‌هایش را شناخته‌ای.",
    bodyStrong: "هدف قانع کردن کسی نیست؛ سنجش تاب‌آوری ایده زیر آتش نقد است.",
    primary: { label: "طرح یک چالش", href: "/club/challenges/new" },
    secondary: { label: "دربارهٔ مأموریت ما", href: "/mission" },
  },
  {
    eyebrow: "نردبان قدرت کلام — سالن تمرین برای رینگ",
    heading: "سر میز مناظره، آرام، محکم و بدون تعصب بایست",
    body: "مناظره شجاعت می‌خواهد، اما بدون فن به فاجعه می‌رسد. نردبان قدرت کلام سالن تمرین قبل از رینگ است: در پلهٔ اول گارد و شنیدن را می‌آموزی، و در پله‌های ۲ و ۳ فنون نبرد در تعارض، مهار مغالطه‌ها و مدیریت میدان معنا را یاد می‌گیری — مهارت‌هایی که سر میز مناظره به کار می‌آیند تا بدون آسیب زدن به استقلال رأی دیگران، از ادعایت دفاع کنی.",
    bodyStrong: "تمرین کن و بدون هراس از شکست وارد رینگ شو.",
    primary: { label: "شروع تمرین در نردبان", href: "/ladder#assessment" },
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
