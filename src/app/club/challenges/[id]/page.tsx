import { getChallengeDetail } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { ResponseCard } from "@/components/debate/ResponseCard";
import { ResponseForm } from "@/components/debate/ResponseForm";
import Link from "next/link";
import { VoteButton } from "@/components/debate/VoteButton";
import { FlagButton } from "@/components/debate/FlagButton";
import { MessageSquareQuote, Flame, ArrowRight } from "lucide-react";

async function debateAction(fd: FormData) {
  "use server";
  const { startDebateFromResponseAction } = await import("@/lib/debate-actions");
  await startDebateFromResponseAction(null, fd);
}

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challengeId = parseInt(id);
  if (isNaN(challengeId)) notFound();

  const [data, session] = await Promise.all([getChallengeDetail(challengeId), getSession()]);
  if (!data) notFound();

  const s = data.challenge;
  const isAuthor = !!session && session.user.id === s.userId;
  const covered = s.moderationState === "covered";
  const initial = (s.username || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted mb-2">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به چالش‌ها</span>
        </Link>
      </div>

      {/* Main Challenge Card */}
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
                این چالش توسط داور پوشانده شده است
              </div>
            ) : (
              <div className="bg-background/80 border border-border/80 rounded-xl p-5 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-normal">
                {s.content}
              </div>
            )}

            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {data.tags.map((t: unknown) => {
                  const tag = t as { id: number; slug: string; name: string };
                  return (
                    <Link
                      key={tag.id}
                      href={`/club/tags/${tag.slug}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-border bg-background text-muted hover:text-accent hover:border-accent/40 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <VoteButton
              voteableType="challenge"
              voteableId={s.id}
              initialCount={data.challengeVoteCount}
              initialVoted={data.challengeVoted}
            />
            <FlagButton
              flaggableType="challenge"
              flaggableId={s.id}
              disabled={!session || isAuthor}
            />
          </div>
        </div>
      </div>

      {/* Debates spawned from this challenge */}
      {data.debates.length > 0 && (
        <section className="border border-border bg-surface rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Flame size={16} className="text-accent" />
            <span>مباحثه‌های این چالش</span>
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

      {/* Responses section */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MessageSquareQuote size={18} className="text-accent" />
            <span>نقدها و هم‌آوردی‌های ثبت‌شده</span>
          </h2>
          <span className="text-xs text-muted font-mono">({data.responses.length})</span>
        </div>

        {data.responses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
            هنوز نقدی به این چالش ثبت نشده است.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
{data.responses.map((response: any) => (
              <ResponseCard
                key={response.id}
                response={response}
                isAuthor={isAuthor}
                challengeId={challengeId}
                debateAction={debateAction}
              />
            ))}
          </div>
        )}
      </section>

      {/* One composer for non-author logged-in users: file a critique or start a debate */}
      {session && !isAuthor && (
        <div className="mt-8 border border-accent/30 bg-accent/5 rounded-lg p-5 shadow-xs">
          <div className="eyebrow mb-1.5">پاسخ به این چالش</div>
          <h2 className="text-lg font-bold text-foreground mb-2">موضع خود را بنویس</h2>
          <p className="text-xs text-muted mb-4">
            می‌توانی فقط نقدت را ثبت کنی تا نویسنده درباره‌اش تصمیم بگیرد، یا همین حالا مباحثه را شروع کنی.
          </p>
          <ResponseForm challengeId={challengeId} allowResponse />
        </div>
      )}

      {/* No session prompt */}
      {!session && (
        <div className="text-center py-6 text-xs text-muted border border-dashed border-border rounded-xl bg-surface/50">
          برای ارسال نقد یا رأی دادن به این چالش،{" "}
          <Link href="/club/login" className="text-accent underline font-medium">
            وارد حساب خود شوید
          </Link>
          .
        </div>
      )}
    </div>
  );
}