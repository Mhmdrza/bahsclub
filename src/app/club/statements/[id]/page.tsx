import { getStatementDetail } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { CounterCard } from "@/components/debate/CounterCard";
import { CounterForm } from "@/components/debate/CounterForm";
import Link from "next/link";
import { VoteButton } from "@/components/debate/VoteButton";
import { FlagButton } from "@/components/debate/FlagButton";

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
              {s.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-muted mb-4">
              <Link href={`/club/users/${s.username}`} className="font-semibold text-foreground hover:text-accent transition-colors">{s.username}</Link>
            </div>

            {covered ? (
              <div className="border border-gold/30 bg-gold/5 px-4 py-3 rounded-lg my-4 text-xs text-gold font-medium">
                این بیانیه توسط داور پوشانده شده است
              </div>
            ) : (
              <div className="border-r-2 border-accent bg-surface px-4 py-3 rounded-l-md text-sm my-4 text-foreground/90 leading-relaxed shadow-xs">
                <div className="text-xs font-semibold text-accent mb-1">بیانیه:</div>
                <p className="whitespace-pre-wrap">{s.content}</p>
              </div>
            )}

            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {data.tags.map((t: any) => (
                  <Link key={t.id} href={`/club/tags/${t.slug}`} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border border-border bg-surface text-muted hover:text-accent hover:border-accent/40 transition-colors">
                    #{t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
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

      {/* Counters section */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-foreground mb-4">پاسخ‌ها ({data.counters.length})</h2>
        {data.counters.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg text-sm text-muted">
            هنوز پاسخی ثبت نشده است
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* ponytail: no pagination on counters, loads all. Add pagination if statements routinely get 50+ counters */}
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
      </div>

      {/* Counter form for non-author logged-in users */}
      {session && !isAuthor && (
        <CounterForm statementId={statementId} />
      )}

      {/* Debates spawned from this statement */}
      {data.debates.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-base font-bold text-foreground mb-4">مناظره‌های این بیانیه</h2>
          <div className="flex flex-col gap-2">
            {data.debates.map((d: any) => (
              <Link
                key={d.id}
                href={`/club/debates/${d.id}`}
                className="border border-border bg-surface rounded-lg p-4 hover:border-accent/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-foreground">{d.title}</span>
                  <div className="flex items-center gap-2 text-xs text-muted mt-1">
                    <span>در برابر {d.opponent_username || "؟"}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${d.status === "in_progress" ? "bg-accent/10 text-accent" : "bg-muted/10 text-muted"}`}>
                      {d.status === "in_progress" ? "در جریان" : "پایان یافته"}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-accent font-medium">مشاهده مناظره →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No session prompt */}
      {!session && (
        <div className="text-center py-6 text-xs text-muted mt-6 border border-dashed border-border rounded-lg bg-surface/50">
          برای ارسال پاسخ یا رأی،{" "}
          <Link href="/club/login" className="text-accent underline font-medium">
            وارد حساب خود شوید
          </Link>
          .
        </div>
      )}
    </div>
  );
}