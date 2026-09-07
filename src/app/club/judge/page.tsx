import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api-client";
import { getTokenForAction } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ResolveForm } from "./resolve-form";

const REASON_LABELS: Record<string, string> = {
  personal_attack: "حمله شخصی",
  insulting_question: "سؤال تحقیرآمیز",
  derailing: "انحراف عمدی",
  motive_guessing: "حدس نیت",
  pressure: "فشار روانی",
  spam: "هرزنامه",
  other: "سایر",
};

export default async function JudgePage() {
  const session = await getSession();
  if (!session || session.user.role !== "judge") notFound();

  const token = await getTokenForAction();
  const data = await apiFetch<{
    pending: any[];
    resolved: any[];
  }>("/api/flags", { token });

  return (
    <div dir="rtl">
      <div className="mb-6 border-b border-border pb-4">
        <div className="eyebrow mb-1">داوری</div>
        <h1 className="text-2xl font-bold tracking-tight">بررسی گزارش‌ها</h1>
      </div>

      {(!data.pending || data.pending.length === 0) ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg text-sm text-muted">
          گزارش باز و در انتظار بررسی وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-6 mb-12">
          {data.pending.map((item, i) => (
            <div key={i} className="border border-border bg-surface rounded-lg p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  item.flaggableType === "turn" ? "border-gold/30 text-gold" : "border-accent/30 text-accent"
                }`}>
                  {item.flaggableType === "turn" ? "پیام" : "بحث"}
                </span>
                <span className="text-xs text-muted font-mono">{item.flagCount} گزارش</span>
              </div>

              {item.debateTitle && (
                <p className="text-sm font-bold text-foreground mb-1">{item.debateTitle}</p>
              )}

              <p className="text-xs text-muted mb-2 font-medium">
                نویسنده: <Link href={`/club/users/${item.authorName}`} className="text-foreground hover:text-accent">{item.authorName}</Link>
              </p>

              {item.contentPreview && (
                <div className="text-xs text-foreground/80 bg-background border border-border/60 rounded p-3 mb-3 leading-relaxed whitespace-pre-wrap">
                  {item.contentPreview}{item.contentPreview.length >= 300 ? "..." : ""}
                </div>
              )}

              <div className="mb-4">
                <div className="text-xs font-semibold text-muted mb-1.5">گزارش‌دهندگان:</div>
                <div className="flex flex-col gap-1">
                  {item.flaggers.map((f: any, j: number) => (
                    <div key={j} className="text-xs flex items-center gap-2">
                      <span className="text-foreground font-medium">{f.username}</span>
                      <span className="text-muted">•</span>
                      <span className="text-muted">{REASON_LABELS[f.reason] || f.reason}</span>
                      {f.details && <span className="text-muted/60 italic">({f.details})</span>}
                    </div>
                  ))}
                </div>
              </div>

              <ResolveForm flaggableType={item.flaggableType} flaggableId={item.flaggableId} />
            </div>
          ))}
        </div>
      )}

      {data.resolved && data.resolved.length > 0 && (
        <details className="mt-8">
          <summary className="text-sm font-semibold text-muted cursor-pointer hover:text-foreground transition-colors mb-4">
            تاریخچه اقدامات اخیر ({data.resolved.length})
          </summary>
          <div className="flex flex-col gap-2">
            {data.resolved.map((r: any) => (
              <div key={r.id} className="text-xs text-muted border border-border bg-surface rounded p-3 flex flex-wrap gap-2 items-center">
                <span className={`font-bold ${r.user_action === "dismiss" ? "text-muted" : "text-accent"}`}>
                  {r.user_action === "dismiss" ? "بلاموضوع" : r.user_action === "warn" ? "اخطار" : r.user_action === "temp_block" ? "مسدودیت" : r.user_action === "rep_adjust" ? "تغییر اعتبار" : "قفل اعتبار"}
                </span>
                <span>•</span>
                <span>{r.target_username}</span>
                <span>•</span>
                <span className="text-muted/60">{r.judge_username}</span>
                {r.note && <span className="text-muted/60">({r.note})</span>}
                {r.duration_days && <span className="text-red-500">{r.duration_days} روز</span>}
                {r.rep_delta && <span className={r.rep_delta > 0 ? "text-green-600" : "text-red-500"}>{r.rep_delta > 0 ? "+" : ""}{r.rep_delta}</span>}
                <span className="text-muted/40 ml-auto font-mono">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(r.created_at))}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}