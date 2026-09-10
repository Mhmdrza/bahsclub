import { apiFetch } from "@/lib/api-client";
import { getSession, getTokenForAction } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ResolveForm } from "./resolve-form";
import { ShieldAlert, History } from "lucide-react";

const REASON_LABELS: Record<string, string> = {
  personal_attack: "حمله شخصی",
  insulting_question: "سؤال تحقیرآمیز",
  derailing: "انحراف عمدی",
  motive_guessing: "حدس نیت",
  pressure: "فشار روانی",
  spam: "هرزنامه",
  other: "سایر",
};

interface PendingFlag {
  flaggableType: string;
  flaggableId: number;
  flagCount: number;
  authorName: string;
  debateTitle?: string;
  contentPreview?: string;
  flaggers: { username: string; reason: string; details?: string }[];
}

interface ResolvedAction {
  id: number;
  user_action: string;
  target_username: string;
  judge_username: string;
  note?: string;
  duration_days?: number;
  rep_delta?: number;
  created_at: string;
}

export default async function JudgePage() {
  const session = await getSession();
  if (!session || session.user.role !== "judge") notFound();

  const token = await getTokenForAction();
  const data = await apiFetch<{
    pending: PendingFlag[];
    resolved: ResolvedAction[];
  }>("/api/flags", { token });

  return (
    <div className="space-y-8" dir="rtl">
      <div className="border-b border-border pb-4">
        <div className="eyebrow mb-1">پنل داوری و نظارت</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldAlert className="text-gold" />
          <span>بررسی گزارش‌ها و داوری</span>
        </h1>
        <p className="text-xs text-muted mt-1">بررسی تخلفات گزارش‌شده بر اساس اصول و مرام‌نامه باشگاه</p>
      </div>

      {(!data.pending || data.pending.length === 0) ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
          گزارش باز و در انتظار داوری وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.pending.map((item, i) => (
            <div key={i} className="border border-border bg-surface rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    item.flaggableType === "turn" ? "border-gold/40 bg-gold/10 text-gold" : "border-accent/40 bg-accent/10 text-accent"
                  }`}>
                    {item.flaggableType === "turn" ? "پیام / پیامک مباحثه" : "بیانیه / مباحثه"}
                  </span>
                  <span className="text-xs text-muted font-mono">{item.flagCount} گزارش تخلف</span>
                </div>

                <div className="text-xs text-muted font-medium">
                  نویسنده: <Link href={`/club/users/${item.authorName}`} className="text-foreground hover:text-accent font-bold">@{item.authorName}</Link>
                </div>
              </div>

              {item.debateTitle && (
                <p className="text-sm font-bold text-foreground">{item.debateTitle}</p>
              )}

              {item.contentPreview && (
                <div className="text-xs text-foreground/90 bg-background border border-border/80 rounded-xl p-4 leading-relaxed whitespace-pre-wrap font-normal">
                  {item.contentPreview}{item.contentPreview.length >= 300 ? "..." : ""}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-background/50 border border-border/60 text-xs">
                <div className="font-semibold text-muted mb-2">گزارش‌های ثبت‌شده:</div>
                <div className="flex flex-col gap-1.5">
                  {item.flaggers.map((flagger, j) => (
                    <div key={j} className="flex items-center gap-2 text-muted">
                      <span className="text-foreground font-medium">@{flagger.username}</span>
                      <span>•</span>
                      <span className="text-foreground/80">{REASON_LABELS[flagger.reason] || flagger.reason}</span>
                      {flagger.details && <span className="text-muted/70 italic">({flagger.details})</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <ResolveForm flaggableType={item.flaggableType} flaggableId={item.flaggableId} />
              </div>
            </div>
          ))}
        </div>
      )}

      {data.resolved && data.resolved.length > 0 && (
        <details className="mt-8 border border-border bg-surface rounded-2xl p-5 shadow-xs">
          <summary className="text-sm font-bold text-foreground cursor-pointer hover:text-accent transition-colors flex items-center gap-2">
            <History size={16} />
            <span>تاریخچه اقدامات داوری اخیر ({data.resolved.length})</span>
          </summary>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/60">
            {data.resolved.map((resolved) => (
              <div key={resolved.id} className="text-xs text-muted border border-border/70 bg-background rounded-xl p-3 flex flex-wrap gap-2 items-center">
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  resolved.user_action === "dismiss" ? "bg-muted/10 text-muted" : "bg-gold/15 text-gold border border-gold/30"
                }`}>
                  {resolved.user_action === "dismiss" ? "بلاموضوع" : resolved.user_action === "warn" ? "اخطار" : resolved.user_action === "temp_block" ? "مسدودیت" : resolved.user_action === "rep_adjust" ? "تغییر اعتبار" : "قفل اعتبار"}
                </span>
                <span>•</span>
                <span className="font-semibold text-foreground">@{resolved.target_username}</span>
                <span>•</span>
                <span className="text-muted/80">داور: @{resolved.judge_username}</span>
                {resolved.note && <span className="text-muted/70">({resolved.note})</span>}
                {resolved.duration_days && <span className="text-red-500 font-mono">{resolved.duration_days} روز</span>}
                {resolved.rep_delta && <span className={`font-mono ${resolved.rep_delta > 0 ? "text-green-600" : "text-red-500"}`}>{resolved.rep_delta > 0 ? "+" : ""}{resolved.rep_delta}</span>}
                <span className="text-muted/50 ml-auto font-mono">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(resolved.created_at))}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}