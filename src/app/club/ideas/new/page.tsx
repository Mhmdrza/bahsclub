import { getTags } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { IdeaComposer } from "@/components/debate/IdeaComposer";
import { AuthGate } from "@/components/club/AuthGate";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function NewIdeaPage() {
  const [availableTags, session] = await Promise.all([getTags(), getSession()]);

  return (
    <div className="max-w-xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به باشگاه</span>
        </Link>
      </div>

      {!session ? (
        <AuthGate
          next="/club/ideas/new"
          title="برای ثبت اندیشه وارد شو"
          message="اندیشه‌ات اینجا منتظر می‌ماند. بعد از ورود، دقیقاً همین صفحه باز می‌شود و بدون معطلی موضعت را ثبت می‌کنی."
        />
      ) : (
        <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
            <Sparkles size={13} />
            <span>اندیشهٔ تازه</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">اندیشه‌ات را ثبت کن</h1>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            موضعت را روشن و با دلیل بنویس و بگو چقدر مطمئنی. بعداً می‌توانی ویرایشش کنی؛
            همهٔ نسخه‌ها می‌مانند تا مسیر تغییر فکرت دیده شود.
          </p>

          <IdeaComposer availableTags={availableTags} />
        </div>
      )}
    </div>
  );
}
