import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Scale, CheckCircle2, ShieldCheck } from "lucide-react";
import { JudgeApplicationForm } from "./form";

export const metadata: Metadata = {
  title: "درخواست داوری در باشگاه بحث",
  description: "عضویت در هیئت داوران باشگاه بحث برای سنجش استدلال‌ها، تشخیص مغالطات و نظارت بر گفت‌وگوهای سازنده.",
};

export default function JudgesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12" dir="rtl">
      <Breadcrumbs
        items={[{ label: "خانه", href: "/" }, { label: "داوران باشگاه" }]}
      />

      <header className="mb-10 text-center sm:text-right">
        <div className="eyebrow mb-2 inline-flex items-center gap-1.5">
          <Scale size={14} />
          <span>هیئت داوران و نظارت بر استدلال</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
          داوری در باشگاه بحث
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          داوران، حافظان استاندارد فکری باشگاه هستند. وظیفه داور نه تحمیل عقیده یا اعلام برنده احساسی، بلکه سنجش ساختار منطقی، شناسایی مغالطات و اطمینان از پایبندی به اصول اخلاقی گفت‌وگو است.
        </p>
      </header>

      {/* Qualifications Grid */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-accent font-bold text-sm">
            <ShieldCheck size={18} />
            <span>تسلط بر مغالطات و منطق کاربردی</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            توانایی تفکیک ادعا از شواهد، شناخت مغالطات رایج (حمله شخصی، پهلوان‌پنبه، مصادره به مطلوب و...) و بررسی اعتبار گزاره‌ها.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-accent font-bold text-sm">
            <CheckCircle2 size={18} />
            <span>بی‌طرفی و نقد فکری منصفانه</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            توانایی سنجش استدلال مستقل از گرایش یا تعصب شخصی، و قضاوت بر مبنای مرام‌نامه و اصول گفت‌وگوی عقلانی.
          </p>
        </div>
      </section>

      {/* Application Form Box */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-border/60">
          <h2 className="text-xl font-bold text-foreground mb-1">فرم درخواست داوری</h2>
          <p className="text-xs text-muted">
            اگر علاقه‌مند به همکاری به عنوان داور هستید، اطلاعات زیر را تکمیل فرمایید.
          </p>
        </div>

        <JudgeApplicationForm />
      </section>
    </div>
  );
}
