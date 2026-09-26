import { getTags } from "@/lib/queries";
import { ChallengeComposer } from "@/components/debate/ChallengeComposer";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function CreateChallengePage() {
  const availableTags = await getTags();

  return (
    <div className="max-w-xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به باشگاه</span>
        </Link>
      </div>

      <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
          <Sparkles size={13} />
          <span>شروع چالش</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">شروع چالش</h1>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          موضع و استدلالت را شفاف بنویس؛ دیگران می‌توانند هم‌آوردی کنند و مباحثه را شروع کنند.
        </p>

        <ChallengeComposer availableTags={availableTags} />
      </div>
    </div>
  );
}
