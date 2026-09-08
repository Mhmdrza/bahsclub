import { getStatementDetail } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { CounterCard } from "@/components/debate/CounterCard";
import { CounterForm } from "@/components/debate/CounterForm";
import Link from "next/link";
import { VoteButton } from "@/components/debate/VoteButton";
import { FlagButton } from "@/components/debate/FlagButton";
import { MessageSquareQuote, Flame, ArrowRight } from "lucide-react";

async function acceptAction(fd: FormData) {
  "use server";
  const { acceptCounterAction } = await import("@/lib/debate-actions");
  await acceptCounterAction(null, fd);
}

export default async function StatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const statementId = parseInt(id);
  if (isNaN(statementId)) notFound();

  const [data, session] = await Promise.all([getStatementDetail(statementId), getSession()]);
  if (!data) notFound();

  const s = data.statement;
  const isAuthor = !!session && session.user.id === s.user_id;
  const covered = s.moderationState === "covered";
  const initial = (s.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به جریان باورها</span>
        </Link>
      </div>

      {/* Main Statement Card */}
      <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/club/users/${s.username}`}
                className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent font-mono"
              >
                {initial}
              </Link>
              <div>
                <Link
                  href={`/club/users/${s.username}`}
                  className="font-bold text-sm text-foreground hover:text-accent transition-colors block"
                >
                  @{s.username}
                </Link>
                <span className="text-[11px] text-muted font-mono">
                  {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(s.createdAt))}
                </span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-foreground leading-snug">
              {s.title}
            </h1>

            {covered ? (
              <div className="border border-gold/30 bg-gold/5 px-4 py-3 rounded-xl my-4 text-xs text-gold font-medium">
                این بیانیه توسط داور پوشانده شده است
              </div>
            ) : (
              <div className="bg-background/80 border border-border/80 rounded-xl p-5 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
                {s.content}
              </div>
            )}

            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {data.tags.map((t: any) => (
                  <Link
                    key={t.id}
                    href={`/club/tags/${t.slug}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-border bg-background text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <VoteButton
              voteableType="statement"
              voteableId={s.id}
              initialCount={data.statementVoteCount}
              initialVoted={data.statementVoted}
            />
            <FlagButton
              flaggableType="statement"
              flaggableId={s.id}
              disabled={!session || isAuthor}
            />
          </div>
        </div>
      </div>

      {/* Debates spawned from this statement */}
      {data.debates.length > 0 && (
        <section className="border border-border bg-surface rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Flame size={16} className="text-accent" />
            <span>مباحثه‌های شکل‌گرفته از این باور</span>
            <span className="text-xs font-normal text-muted font-mono">({data.debates.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.debates.map((d: any) => (
              <Link
                key={d.id}
                href={`/club/debates/${d.id}`}
                className="border border-border bg-background rounded-xl p-4 hover:border-accent/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-sm text-foreground group-hover:text-accent transition-colors block line-clamp-1">
                    {d.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted mt-1.5">
                    <span>در برابر @{d.opponent_username || "؟"}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      d.status === "in_progress" ? "bg-accent/10 text-accent border border-accent/20" : "bg-muted/10 text-muted"
                    }`}>
                      {d.status === "in_progress" ? "در جریان" : "پایان یافته"}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-accent font-medium mr-2">مشاهده →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Counters section */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MessageSquareQuote size={18} className="text-accent" />
            <span>پاسخ‌ها و نقدهای ثبت‌شده</span>
          </h2>
          <span className="text-xs text-muted font-mono">({data.counters.length})</span>
        </div>

        {data.counters.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
            هنوز پاسخی به این باور ثبت نشده است.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.counters.map((c: any) => (
              <CounterCard
                key={c.id}
                counter={c}
                isAuthor={isAuthor}
                statementId={statementId}
                acceptAction={acceptAction}
              />
            ))}
          </div>
        )}
      </section>

      {/* Counter form for non-author logged-in users */}
      {session && !isAuthor && (
        <CounterForm statementId={statementId} />
      )}

      {/* No session prompt */}
      {!session && (
        <div className="text-center py-6 text-xs text-muted border border-dashed border-border rounded-xl bg-surface/50">
          برای ارسال پاسخ یا رأی دادن به این بیانیه،{" "}
          <Link href="/club/login" className="text-accent underline font-medium">
            وارد حساب خود شوید
          </Link>
          .
        </div>
      )}
    </div>
  );
}