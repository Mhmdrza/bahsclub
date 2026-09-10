"use client";

import { useEffect, useState } from "react";
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
    eyebrow: "یک دعوت متفاوت",
    heading: "جایی که می‌شود بی‌پرده گفت: «نمی‌دانم»",
    body: "بیشتر جمع‌ها جایی برای ابراز تردید باقی نمی‌گذارند. اینجا برعکس است: تغییر نظر نشانهٔ بلوغ فکری است، «نمی‌دانم» ارزشمندتر از «بردم» و هر مخالفت فرصتی برای دیدن زاویه‌ای تازه. این آزمایشگاه فکر کردن است، نه میدانِ جنگ.",
    bodyStrong: "وقتی همه چیز قطبی شده، گفت‌وگوی واقعی کمیاب‌ترین چیز است.",
  },
  {
    eyebrow: "دعوت به یک تجربهٔ نادر",
    heading: "بحثی که در آن هیچ‌کس بازنده نیست",
    body: "اینجا اجماع ارزش کمتری از اختلاف دارد. هر چه مخالفت عمیق‌تر باشد، سرمایهٔ جمعی بیشتر. به‌جای «بردن»، دنبالِ فهمیدن می‌گردیم — با ذهنی باز و ادعایی که روی میز است، نه هویتی که در خطر.",
    bodyStrong: "یک باشگاه برای کسانی که از جدل خسته شده‌اند و به دنبال گفت‌وگو هستند.",
  },
  {
    eyebrow: "یک اعتراف کوچک",
    heading: "ما هم بلد نبودیم. برای همین اینجا را ساختیم.",
    body: "بحث‌کلاب توسط آدم‌هایی ساخته شده که از بحث‌های فرساینده خسته بودند. جایی که برچسب‌زدن و نیت‌خوانی جایی ندارد و استدلال جایگزین فحاشی می‌شود. اینجا کسی ادعای دانایی مطلق ندارد — همه با هم تمرین می‌کنیم.",
    bodyStrong: "با هم یاد می‌گیریم، نه با هم می‌جنگیم.",
  },
  {
    eyebrow: "یک پیشنهاد: قواعد بازی را عوض کنیم؟",
    heading: "مخالف پیدا کن، نه هم‌عقیده",
    body: "هرچه اختلاف عمیق‌تر باشد، گفت‌وگوی ارزشمندتری در انتظار است. اینجا هدف این نیست که کسی را قانع کنیم — ادعا را روی میز می‌گذاریم و با هم عیارش را می‌سنجیم. جزم‌اندیشی جایش اینجا نیست؛ تردید و کنجکاوی خوش‌آمد می‌گویند.",
    bodyStrong: "کشف حقیقت کار گروهی است، نه مسابقهٔ انفرادی.",
  },
  {
    eyebrow: "یک راز کوچک",
    heading: "همه ما گاهی وسط بحث متوجه می‌شویم حق با طرف مقابل است — و سکوت می‌کنیم",
    body: "این یک عادت ذهنی است، نه نقص اخلاقی. همه کرده‌ایم. بحث‌کلاب جایی برای شکستن این عادت است: فضایی امن برای گفتن «به نظرت درست می‌آید» و «راستش من الان مطمئن نیستم». بیایید با هم تمرین کنیم که شجاعتِ بازبینی عقاید را جدی بگیریم.",
    bodyStrong: "به جست‌وجوی حقیقت خوش آمدی، نه به مسابقهٔ بردن.",
  },
];

function pickVariant(): HeroVariant {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

export default function HeroSection({ tagline }: { tagline: string }) {
  const [v, setV] = useState<HeroVariant | null>(null);

  useEffect(() => {
    setV(pickVariant());
  }, []);

  if (!v) return null;

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
          شروع یادگیری و آموزش‌ها
        </Link>
        <Link
          href="/club"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          <MessageSquare className="h-4 w-4 text-accent" />
          ورود به باشگاه
        </Link>
      </div>
    </section>
  );
}