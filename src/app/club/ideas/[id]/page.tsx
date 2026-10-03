import { getIdeaDetail } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { ResponseCard } from "@/components/debate/ResponseCard";
import { ResponseForm } from "@/components/debate/ResponseForm";
import { FollowButton } from "@/components/club/FollowButton";
import { AuthGate } from "@/components/club/AuthGate";
import { EditIdeaForm } from "./EditIdeaForm";
import Link from "next/link";
import { VoteButton } from "@/components/debate/VoteButton";
import { FlagButton } from "@/components/debate/FlagButton";
import { MessageSquareQuote, Flame, ArrowRight, Repeat2, Target, BookOpen } from "lucide-react";

async function debateAction(fd: FormData) {
  "use server";
  const { startDebateFromResponseAction } = await import("@/lib/debate-actions");
  await startDebateFromResponseAction(null, fd);
}

export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ideaId = parseInt(id);
  if (isNaN(ideaId)) notFound();

  const [data, session] = await Promise.all([getIdeaDetail(ideaId), getSession()]);
  if (!data) notFound();

  const s = data.idea;
  const isAuthor = !!session && session.user.id === s.userId;
  const covered = s.moderationState === "covered";
  const initial = (s.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به اندیشه‌ها</span>
        </Link>
      </div>

      {/* Main idea card */}
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
              <div className="flex-1 min-w-0">
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
              {!isAuthor && (
                <FollowButton username={s.username} initialFollowing={data.isFollowingAuthor} isAuthenticated={!!session} />
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 text-foreground leading-snug">
              {s.title}
            </h1>

            {covered ? (
              <div className="border border-gold/30 bg-gold/5 px-4 py-3 rounded-xl my-4 text-xs text-gold font-medium">
                این اندیشه توسط داور پوشانده شده است
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-background/80 border border-border/80 rounded-xl p-5 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
                  {s.reasoning}
                </div>
                {s.sources && (
                  <div className="flex items-start gap-2 text-xs text-muted bg-surface border border-border/60 rounded-xl p-3">
                    <BookOpen size={14} className="mt-0.5 shrink-0" />
                    <span><span className="font-semibold text-foreground">منابع: </span>{s.sources}</span>
                  </div>
                )}
                {s.falsifier && (
                  <div className="flex items-start gap-2 text-xs text-muted bg-surface border border-border/60 rounded-xl p-3">
                    <Target size={14} className="mt-0.5 shrink-0" />
                    <span><span className="font-semibold text-foreground">چه چیزی نظرم را عوض می‌کند: </span>{s.falsifier}</span>
                  </div>
                )}
              </div>
            )}

            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {data.tags.map((tag: { id: number; slug: string; name: string }) => (
                  <Link
                    key={tag.id}
                    href={`/club/tags/${tag.slug}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-border bg-background text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="flex flex-col items-center justify-center min-w-[3.25rem] py-2 px-2.5 rounded-lg border border-accent/30 bg-accent/5 text-accent" title="درصد اطمینان">
              <span className="text-sm font-bold font-mono">{s.confidence}٪</span>
              <span className="text-[10px] text-muted">اطمینان</span>
            </div>
            <VoteButton
              voteableType="idea"
              voteableId={s.id}
              initialCount={data.ideaVoteCount}
              initialVoted={data.ideaVoted}
              isAuthenticated={!!session}
            />
            <FlagButton
              flaggableType="idea"
              flaggableId={s.id}
              canFlag={!isAuthor}
              isAuthenticated={!!session}
            />
          </div>
        </div>
      </div>

      {/* Version history */}
      {data.versions.length > 0 && (
        <details className="border border-border bg-surface rounded-2xl p-5 shadow-xs">
          <summary className="cursor-pointer text-sm font-bold text-foreground flex items-center gap-2">
            <Repeat2 size={15} className="text-gold" />
            <span>تاریخچهٔ نسخه‌ها</span>
            <span className="text-xs font-normal text-muted font-mono">({data.versions.length})</span>
          </summary>
          <ol className="mt-4 space-y-3 border-r border-border/60 pr-4">
            {data.versions.map((v: any) => (
              <li key={v.id} className="text-xs">
                <div className="flex items-center gap-2 text-muted font-mono mb-1">
                  <span className="font-bold text-foreground">نسخهٔ {v.version}</span>
                  <span>•</span>
                  <span>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(v.createdAt))}</span>
                  <span>•</span>
                  <span className="text-accent">{v.confidence}٪</span>
                </div>
                <p className="text-foreground/80 leading-relaxed">{v.title}</p>
                {v.reasoning !== s.reasoning && (
                  <p className="text-muted leading-relaxed mt-1 line-clamp-3">{v.reasoning}</p>
                )}
              </li>
            ))}
          </ol>
        </details>
      )}

      {/* Author edit */}
      {isAuthor && (
        <details className="border border-border bg-surface rounded-2xl p-5 shadow-xs">
          <summary className="cursor-pointer text-sm font-bold text-foreground">ویرایش اندیشه</summary>
          <div className="pt-4">
            <EditIdeaForm idea={{ ...s, tags: data.tags.map((t: any) => ({ name: t.name })) }} />
          </div>
        </details>
      )}

      {/* Debates spawned from this idea */}
      {data.debates.length > 0 && (
        <section className="border border-border bg-surface rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Flame size={16} className="text-accent" />
            <span>مباحثه‌های این اندیشه</span>
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

      {/* Responses */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MessageSquareQuote size={18} className="text-accent" />
            <span>پاسخ‌ها و چالش‌ها</span>
          </h2>
          <span className="text-xs text-muted font-mono">({data.responses.length})</span>
        </div>

        {data.responses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
            هنوز پاسخی به این اندیشه ثبت نشده است.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.responses.map((response: any) => (
              <ResponseCard
                key={response.id}
                response={response}
                isAuthor={isAuthor}
                isAuthenticated={!!session}
                ideaId={ideaId}
                debateAction={debateAction}
              />
            ))}
          </div>
        )}
      </section>

      {/* Composer */}
      {session && !isAuthor && s.openToResponse && (
        <div className="mt-8 border border-accent/30 bg-accent/5 rounded-lg p-5 shadow-xs">
          <div className="eyebrow mb-1.5">پاسخ به این اندیشه</div>
          <h2 className="text-lg font-bold text-foreground mb-2">موضع خود را بنویس</h2>
          <p className="text-xs text-muted mb-4">
            می‌توانی پاسخی آزاد ثبت کنی، یا چالش ساختاریافته‌ای بفرستی که نویسنده دربارهٔ تبدیل آن به مباحثه تصمیم بگیرد.
          </p>
          <ResponseForm ideaId={ideaId} />
        </div>
      )}

      {session && !isAuthor && !s.openToResponse && (
        <div className="text-center py-6 text-xs text-muted border border-dashed border-border rounded-xl bg-surface/50">
          نویسنده فعلاً این اندیشه را برای پاسخ بسته است.
        </div>
      )}

      {!session && (
        <AuthGate
          next={`/club/ideas/${ideaId}`}
          title="برای پاسخ دادن یا تأیید، وارد شو"
          message="این اندیشه منتظر موضع توست. با یک ورود کوتاه، پاسخ یا چالشت را همین‌جا ثبت می‌کنی."
        />
      )}
    </div>
  );
}
