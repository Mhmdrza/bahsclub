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
    eyebrow: "یک مهارتِ تمرین‌کردنی",
    heading: "حرف زدن را بلدیم؛ گفت‌وگو تمرین می‌خواهد",
    body: "حرف زدن را در کودکی یاد گرفتیم، اما شنیدن، پرسیدن و مخالفت کردن بدون شکستن رابطه را کمتر جایی یاد داده‌اند. اینجا مسیرهای قدم‌به‌قدم هست تا جدل را به تفاهم نزدیک کنی — بدون پیش‌نیاز، با انتخاب خودت.",
    bodyStrong: "از هر نقطه‌ای که کنجکاوی شروع کن — انتخاب با توست.",
  },
  {
    eyebrow: "یک دعوت ساده",
    heading: "چه می‌شود اگر طرف مقابل واقعاً بشنود؟",
    body: "خیلی از اختلاف‌ها از این می‌آید که فقط منتظر نوبت حرف زدن خودمان هستیم. اینجا ابزارهای ساده‌ای هست برای سؤال بهتر پرسیدن، بهتر فهمیدن حرف طرف مقابل و بررسی اختلاف بدون تحقیر.",
    bodyStrong: "هر درس، یک ابزار واقعی برای گفت‌وگوی بعدی توست.",
  },
  {
    eyebrow: "یک نگاه دیگر",
    heading: "بیشتر ما گفت‌وگو را در فضاهای پرتنش یاد گرفته‌ایم",
    body: "جایی که هدف «بردن» بود، نه فهمیدن. این فضا برای این ساخته شده که طور دیگری هم می‌شود حرف زد: با کنجکاوی و احترام. از ساده‌ترین ایده‌ها تا لایه‌های عمیق‌تر، همه قدم‌به‌قدم و بدون پیش‌فرض کنار هم چیده شده‌اند.",
    bodyStrong: "همراه شو و با سرعت خودت پیش برو.",
  },
  {
    eyebrow: "از هر جا که راحتی",
    heading: "هر گفت‌وگوی بهتر، گاهی با یک جملهٔ بهتر شروع می‌شود",
    body: "تازه رسیده‌ای یا باتجربه — می‌توانی از ابتدا شروع کنی یا فقط یک مقاله بخوانی. دربارهٔ روشن حرف زدن، سؤال درست و نگه داشتن رابطه در اختلاف.",
    bodyStrong: "یک درس در هر بار — تو ترتیب و سرعت را انتخاب می‌کنی.",
  },
  {
    eyebrow: "یک انتخاب آزادانه",
    heading: "در گفت‌وگو، بردن مهم‌تر است یا فهمیدن؟",
    body: "این دو مسیر به جاهای کاملاً متفاوتی می‌رسند. اینجا ایده‌هایی هست برای فهمیدن قوی‌ترین نسخهٔ حرف طرف مقابل، جدا کردن احساس از ادعا، و برگشتن آرام به مسیر وقتی گفت‌وگو منحرف می‌شود.",
    bodyStrong: "قدم اول را تو انتخاب می‌کنی.",
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
          شروع مسیر یادگیری
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          <MessageSquare className="h-4 w-4 text-accent" />
          کاوش کتابخانهٔ مهارت‌ها
        </Link>
      </div>
    </section>
  );
}