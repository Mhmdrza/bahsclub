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
    eyebrow: "باشگاه مناظره — بدون مشت، فقط با استدلال",
    heading: "مثل فایت‌کلاب؛ فقط به‌جای مشت، با منطق روبه‌رو می‌شوی",
    body: "بحث‌کلاب جای گپ‌های بی‌حاصل نیست؛ باشگاهی است برای به چالش کشیدن اندیشه‌ها. بدون بی‌احترامی، بدون تلاش برای تحمیل عقیده و بدون اصرار بر رسیدن به توافق. یک ایده می‌آوری، در چارچوب قوانینی مشخص با استدلال نقدش می‌کنند و عیار واقعی‌اش آشکار می‌شود.",
    bodyStrong: "قرار نیست نظر کسی عوض شود؛ قرار است استدلال‌ها زیر بار فشار محک بخورند.",
    primary: { label: "ورود به باشگاه", href: "/club" },
    secondary: { label: "قوانین باشگاه", href: "/club/rules" },
  },
  {
    eyebrow: "تالار آموزش و باشگاه مناظره — تئوری در کنار عمل",
    heading: "در تالار آموزش فن می‌آموزی، در باشگاه مناظره می‌کنی",
    body: "بحث‌کلاب دو بخش به‌هم‌پیوسته دارد: تالار آموزش (نردبان و مقالات) برای فراگیری ساختار استدلال و فنون دفاع در تعارض، و باشگاه مناظره برای تست واقعی ایده‌ها در برابر دیگران. اول در تالار آموزش تئوری را صیقل می‌دهی، بعد در باشگاه سر میز بحث می‌نشینی.",
    bodyStrong: "نه تئوریِ بدون عمل، نه مناظرهٔ بدون مهارت.",
    primary: { label: "ورود به باشگاه مناظره", href: "/club" },
    secondary: { label: "رفتن به تالار آموزش", href: "/ladder" },
  },
  {
    eyebrow: "منطق در برابر منطق — مثل شطرنج",
    heading: "بحث تصادفی نیست؛ مثل شطرنج، حرکت به حرکت با منطق است",
    body: "در شطرنج کسی داد نمی‌زند و مهره پرت نمی‌کند؛ نوبت هست، ساختار هست، و منطق مقابل منطق می‌ایستد. باشگاه جایی است با قوانین مشخص تا مناظره به هیاهو کشیده نشود؛ نه برای اینکه کسی تسلیم شود، بلکه برای اینکه معلوم شود کدام ایده روی صفحهٔ استدلال دوام می‌آورد.",
    bodyStrong: "استقلال رأی تو محترم است؛ اینجا صفحهٔ تفکر است، نه کارخانهٔ اجماع.",
    primary: { label: "دیدن قوانین باشگاه", href: "/club/rules" },
    secondary: { label: "کاوش چالش‌ها", href: "/club" },
  },
  {
    eyebrow: "تست استرس برای باورها",
    heading: "ایده‌ات را به اتاق تست فشار بیاور؛ ببین چقدر تاب می‌آورد",
    body: "هیچ سازه‌ای بدون تست فشار وارد دنیای واقعی نمی‌شود؛ چرا باورهایت بدون آزمون بمانند؟ در باشگاه، ادعایت را مطرح می‌کنی تا از زوایای گوناگون نقد شود. نه کسی می‌خواهد مجبورت کند نظرت را عوض کنی و نه به دنبال توافق ساختگی هستیم. اگر استدلالت استوار ماند، ریشه دارد؛ اگر لرزید، ترک‌هایش را شناخته‌ای.",
    bodyStrong: "هدف قانع کردن دیگری نیست؛ سنجش تاب‌آوری ایده زیر آتش نقد است.",
    primary: { label: "طرح یک چالش در باشگاه", href: "/club/challenges/new" },
    secondary: { label: "دربارهٔ مأموریت ما", href: "/mission" },
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
