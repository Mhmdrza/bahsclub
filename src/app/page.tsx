import Link from "next/link";
import Image from "next/image";
import {
  XCircle,
  CheckCircle2,
  ArrowLeft,
  LifeBuoy,
  MessageSquare,
  Sparkles,
  Search,
  BookOpen,
} from "lucide-react";
import { getSiteConfig } from "@/lib/content";

export default function HomePage() {
  const config = getSiteConfig();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      {/* 1. Hero Section: The Invitation & Mission */}
      <section className="relative mb-20 overflow-hidden rounded-3xl border border-border/80 bg-surface/60 px-6 py-12 text-center shadow-sm sm:mb-24 sm:px-12 sm:py-20">
        {/* Background Artwork */}
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

        <p className="eyebrow eyebrow-centered mb-4">{config.tagline}</p>
        <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-[1.4] sm:text-5xl sm:leading-[1.4]">  
          جایی که برای رشد کردن، دنبال منطقی‌ترین مخالفت‌ها میگردی
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
          دلت برای گفت‌وگوهای متمدنانه تنگ نشده؟ جایی که اختلاف‌نظر به تحقیر و برچسب‌زنی ختم نشود، دو طرف به حرف هم گوش بدهند و هدف، بردن به هر قیمتی نباشد.{" "}
          <strong className="font-semibold text-foreground">
            بحث‌کلاب برای بازسازی همین حس و مهارت است:
          </strong>{" "}
          تمرین گفت‌وگو روی عمیق‌ترین اختلاف‌ها، با ذهن باز، استدلال شفاف و شوق کشف حقیقت.
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

      {/* 2. Side-by-Side Contrast: Bad vs Good Debate */}
      <section className="mb-20 sm:mb-24">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-centered mb-2">تفاوت بنیادین</p>
          <h2 className="text-3xl font-extrabold">گفت‌وگوی مخرب در برابر بحث ایده‌آل</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">
            تفاوت بین یک بحث سازنده و یک جدل فرساینده در نیت و ابزارهای ما نهفته است:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Destructive Debate Column */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <XCircle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">بحث‌های روزمره و فرساینده</h3>
                <p className="text-xs text-muted">جدل‌های بی‌حاصل و قطبی‌شده</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm leading-relaxed text-muted">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  <strong className="text-foreground">هدف بردن است:</strong> شکست دادن حریف و تحمیل عقیده به هر قیمتی.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  <strong className="text-foreground">حمله به شخص:</strong> نیت‌خوانی، برچسب زدن و تخریب شخصیت به‌جای نقد استدلال.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  <strong className="text-foreground">حالت تدافعی:</strong> ترس از اعتراف به اشتباه و پناه بردن به توجیه و مغالطه.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span>
                  <strong className="text-foreground">سرانجام:</strong> عصبانیت، تخریب رابطه، تعمیق شکاف و صفر درصد پیشرفت.
                </span>
              </li>
            </ul>
          </div>

          {/* Healthy Debate Column */}
          <div className="rounded-2xl border border-gold/40 bg-surface p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">بحث ایده‌آل در بحث‌کلاب</h3>
                <p className="text-xs text-muted">گفت‌وگوی سنجش‌گر و همکارانه</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm leading-relaxed text-muted">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong className="text-foreground">هدف فهمیدن است:</strong> ادعا را وسط می‌گذاریم و با همکاری هم عیارش را می‌سنجیم.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong className="text-foreground">قوی‌ترین روایت (Steelman):</strong> قبل از نقد، حرف طرف مقابل را در بهترین شکلش بازگو می‌کنیم.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong className="text-foreground">استقبال از بازنگری:</strong> تغییر نظر یا گفتن «هنوز نمی‌دانم» امتیاز و افتخار است، نه باخت.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  <strong className="text-foreground">سرانجام:</strong> شفافیت ذهنی، احترام متقابل، اصلاح خطاها و کشف حقیقت.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. De-escalation & Rescue Toolkit */}
      <section className="mb-20 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:mb-24 sm:p-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">جعبه‌ابزار اضطراری</p>
            <h2 className="text-2xl font-extrabold sm:text-3xl">وقتی بحث منحرف شد، چطور نجاتش دهیم؟</h2>
          </div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            مشاهده همه تکنیک‌ها در آموزش
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted">
          وقتی گفت‌وگو به سمت لجبازی، برد/باخت یا دعوا می‌رود، لازم نیست تسلیم شوید یا با خشم پاسخ دهید. این چهار اصل ساده بلافاصله ترمز تنش را می‌کشند:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-5">
            <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
              <LifeBuoy className="h-4 w-4" />
            </span>
            <h3 className="mb-2 font-semibold">۱. نقد ادعا، نه نیت</h3>
            <p className="text-xs leading-relaxed text-muted">
              نیت‌خوانی و برچسب‌زنی را متوقف کنید. فقط جمله و گزارهٔ مطرح‌شده را ارزیابی کنید.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="mb-2 font-semibold">۲. بازگویی منصفانه</h3>
            <p className="text-xs leading-relaxed text-muted">
              پیش از پاسخ دادن بگویید: «اگر درست متوجه شده باشم، نکتهٔ شما این است...» تا گارد دفاعی شکسته شود.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
              <Search className="h-4 w-4" />
            </span>
            <h3 className="mb-2 font-semibold">۳. سؤال به‌جای حمله</h3>
            <p className="text-xs leading-relaxed text-muted">
              به‌جای «این حرفت بی‌معنیه»، بپرسید: «چه شواهدی می‌تواند این گزاره را تأیید یا ابطال کند؟»
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-5">
            <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light text-accent">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <h3 className="mb-2 font-semibold">۴. پذیرش «نمی‌دانم»</h3>
            <p className="text-xs leading-relaxed text-muted">
              با شجاعت مرز دانش خود را اعلام کنید. پذیرش عدم قطعیت، لجبازی طرف مقابل را خلع سلاح می‌کند.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Club Rules Preview Link */}
      <section className="mb-20 rounded-2xl border border-border bg-surface/50 p-6 sm:mb-24 sm:p-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="max-w-2xl text-right">
            <p className="eyebrow mb-2">مرام‌نامه و اصول</p>
            <h3 className="text-xl font-bold">مرام‌نامه و اصول ده‌گانهٔ بحث‌کلاب را خوانده‌اید؟</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              این ۱۰ اصل ساده تضمین می‌کنند که گفت‌وگوها از مسیر اخلاقی و سازنده خارج نشوند. پیش از هر بحث، نگاهی به آنها بیندازید.
            </p>
          </div>
          <Link
            href="/rules"
            className="shrink-0 rounded-lg border border-accent/40 bg-surface px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-fg"
          >
            مشاهده مرام‌نامه ده‌گانه ←
          </Link>
        </div>
      </section>

      {/* 5. Final CTA to Explore Learning Hub */}
      <section className="border-t border-border pt-12 text-center sm:pt-16">
        <p className="eyebrow eyebrow-centered mb-3">گام بعدی شما</p>
        <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl">
          آماده‌اید کیفیت گفت‌وگوهایتان را ارتقا دهید؟
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted">
          در بخش آموزش، مسیرهای گام‌به‌گام، کاتالوگ تاکتیک‌های انحرافی، مغالطه‌ها و تمرین‌های عملی را برای تسلط بر هنر بحث آماده کرده‌ایم.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-fg shadow-sm transition-colors hover:bg-accent/90"
          >
            ورود به بخش آموزش و یادگیری
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/club"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent/50"
          >
            مشاهده مباحثه‌های فعال
          </Link>
        </div>
      </section>
    </div>
  );
}
