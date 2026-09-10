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
    heading: "مهارتی که در هیچ مدرسه‌ای یاد نمی‌دهند: هنر گفت‌وگوی نقادانه",
    body: "بیشتر ما بحث کردن را از محیط‌های پرتنش یاد گرفته‌ایم — جایی که هدف «بردن» است. اینجا روش دیگری هست: مسیرهای آموزشی گام‌به‌گام برای یادگیری سواد قضاوت، تشخیص مغالطه‌ها، و تبدیل مشاجره به گفت‌وگو. نیازی به پیش‌نیاز نیست؛ فقط کافی است بخواهی متفاوت بحث کنی.",
    bodyStrong: "آموزش ببین، تمرین کن، و گفت‌وگوهایت را متحول کن.",
  },
  {
    eyebrow: "دعوت به یک تجربهٔ نادر",
    heading: "قضاوت عادلانه را می‌توان یاد گرفت — مثل هر مهارت دیگری",
    body: "سواد قضاوت یک استعداد ذاتی نیست؛ یک مهارت اکتسابی است. اینجا بسته‌های آموزشی را از پایه تا پیشرفته آماده کرده‌ایم: از ساختار استدلال و پرسشگری گرفته تا خنثی‌سازی تاکتیک‌های انحرافی و تمرین‌های عملی. هر قدم، یک گام به سمت گفت‌وگوی بهتر.",
    bodyStrong: "یک کارگاه آموزشی برای ذهن‌های کنجکاو.",
  },
  {
    eyebrow: "یک اعتراف کوچک",
    heading: "ما هم اولش بلد نبودیم. برای همین این آموزش‌ها را نوشتیم.",
    body: "بحث‌کلاب با این باور شروع شد که «نقدپذیری» و «قضاوت منصفانه» مهارت‌هایی قابل یادگیری هستند — نه ویژگی‌های ذاتی. تمام مسیرهای آموزشی، مقالات و تمرین‌های این سایت حاصل سال‌ها تجربه در بحث‌های واقعی است. از ساده‌ترین مفاهیم تا عمیق‌ترین لایه‌ها، همه را قدم‌به‌قدم توضیح داده‌ایم.",
    bodyStrong: "با هم یاد می‌گیریم، نه با هم می‌جنگیم.",
  },
  {
    eyebrow: "یک پیشنهاد: مسیر یادگیری را عوض کنیم؟",
    heading: "از مشاجره تا مکاشفه: یک قدم فاصله است",
    body: "فرقی نمی‌کند مبتدی باشی یا حرفه‌ای — مسیرهای آموزشی ما از سطح صفر شروع می‌شوند. بیا یاد بگیریم چطور ادعاها را عیار بزنیم، مغالطه‌ها را بشناسیم، و بدون تخریب رابطه، عمیق‌ترین اختلافات را بررسی کنیم. هر مقاله، هر درس، یک ابزار جدید برای جعبه‌ابزار ذهنی توست.",
    bodyStrong: "کشف حقیقت کار گروهی است، نه مسابقهٔ انفرادی.",
  },
  {
    eyebrow: "یک راز کوچک",
    heading: "همه ما گاهی فکر می‌کنیم «حق با ماست» — و این همان جایی است که یادگیری متوقف می‌شود",
    body: "اینجا جایی برای تمرین فروتنی فکری است. آموزش‌های ما به تو کمک می‌کنند مرز دانسته‌هایت را بشناسی، از مغالطه‌های رایج دوری کنی، و با اعتمادبه‌نفس بگویی «نمی‌دانم». هر مبحث یک قدم به سمت شفافیت ذهنی بیشتر.",
    bodyStrong: "به جست‌وجوی حقیقت خوش آمدی — یک درس در هر بار.",
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