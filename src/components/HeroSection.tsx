"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, MessageSquare } from "lucide-react";

type HeroVariant = {
  eyebrow: string;
  heading: string;
  body: string;
  bodyStrong: string;
};

const VARIANTS: HeroVariant[] = [
  {
    eyebrow: "یک مهارت، نه یک استعداد",
    heading: "حرف زدن را بلدیم؛ گفت‌وگو کردن را باید یاد بگیریم",
    body: "حرف زدن را در کودکی یاد گرفتیم، اما شنیدن، پرسیدن، و مخالفت کردن بدون شکستن رابطه را هیچ‌کس به ما یاد نداد. اینجا مسیرهای آموزشی گام‌به‌گام داریم تا گفت‌وگوهای روزمره‌ات را از جدل به تفاهم ببری. پیش‌نیازی نیست؛ فقط کافی است بخواهی بهتر حرف بزنی.",
    bodyStrong: "یاد بگیر، تمرین کن، و گفت‌وگوهایت را عوض کن.",
  },
  {
    eyebrow: "یک شروع تازه",
    heading: "چطور طوری حرف بزنیم که طرف مقابل هم بخواهد بشنود؟",
    body: "خیلی از اختلاف‌ها از این می‌آید که فقط منتظر نوبت حرف زدن خودمان هستیم. اینجا قدم‌به‌قدم یاد می‌گیری چطور سؤال بهتر بپرسی، حرف طرف مقابل را درست بفهمی، و بدون تحقیر اختلاف را بررسی کنی. هر درس، یک ابزار تازه برای گفت‌وگوی بعدی‌ات.",
    bodyStrong: "گفت‌وگوی خوب یک مهارت است — و قابل یادگیری.",
  },
  {
    eyebrow: "یک اعتراف کوچک",
    heading: "بیشتر ما گفت‌وگو کردن را از محیط‌های پرتنش یاد گرفته‌ایم",
    body: "جایی که هدف «بردن» بود، نه فهمیدن. این سایت با این باور ساخته شده که می‌شود طور دیگری حرف زد: با کنجکاوی، با فروتنی، و با احترام. از ساده‌ترین مفاهیم تا عمیق‌ترین لایه‌ها، همه را قدم‌به‌قدم و بدون پیش‌فرض توضیح داده‌ایم.",
    bodyStrong: "با هم یاد می‌گیریم، نه با هم می‌جنگیم.",
  },
  {
    eyebrow: "از کجا شروع کنم؟",
    heading: "هر گفت‌وگوی بهتر، با یک جملهٔ بهتر شروع می‌شود",
    body: "فرقی نمی‌کند مبتدی باشی یا حرفه‌ای — مسیرها از سطح صفر شروع می‌شوند. بیا یاد بگیریم چطور روشن حرف بزنیم، سؤال درست بپرسیم، و وقتی اختلاف داریم هم رابطه را نگه داریم. هر مقاله یک قدم به سمت گفت‌وگویی است که به جایی می‌رسد.",
    bodyStrong: "یک درس در هر بار — همین امروز شروع کن.",
  },
  {
    eyebrow: "یک انتخاب روزمره",
    heading: "می‌خواهی در گفت‌وگو برنده شوی، یا بفهمی؟",
    body: "این دو مسیر به جاهای کاملاً متفاوتی می‌رسند. آموزش‌های ما کمکت می‌کنند قوی‌ترین نسخهٔ حرف طرف مقابل را بفهمی، احساس را از ادعا جدا کنی، و وقتی گفت‌وگو منحرف شد آرام به مسیر برگردانی. هر مبحث، یک قدم به سمت گفت‌وگویی شفاف‌تر و صادقانه‌تر.",
    bodyStrong: "گفت‌وگوی خوب، تمرین می‌خواهد — از همین‌جا شروع کن.",
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
          href="/learn"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
        >
          <BookOpen className="h-4 w-4" />
          شروع یادگیری گفت‌وگو
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          <MessageSquare className="h-4 w-4 text-accent" />
          کتابخانهٔ مهارت‌ها
        </Link>
      </div>
    </section>
  );
}