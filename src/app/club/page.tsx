import { getIdeas, getDebatesWithVotes } from "@/lib/queries";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { IdeaCard } from "@/components/debate/IdeaCard";
import { DebateCard } from "@/components/debate/DebateCard";
import { Plus, Sparkles, MessageSquareQuote, Flame } from "lucide-react";

export default async function ClubHome() {
  const session = await getSession();
  const [{ ideas }, { debates }] = await Promise.all([
    getIdeas(session ? { feed: "home" } : undefined),
    getDebatesWithVotes(),
  ]);

  const liveDebates = debates.filter((d) => d.debate.status === "in_progress").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
            <Sparkles size={13} />
            <span>باشگاه</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            اندیشه‌ات را ثبت کن و به نقد بگذار
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-6">
            موضعت را با دلیل بنویس و بگو چقدر مطمئنی. دیگران پاسخ می‌دهند یا چالش
            می‌سازند. اینجا کسی برنده نمی‌شود؛ فکرت را با هم محک می‌زنیم.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/club/ideas/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity shadow-xs"
            >
              <Plus size={16} />
              <span>ثبت اندیشه</span>
            </Link>
            <Link
              href="#ideas"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground hover:border-accent/40 transition-colors"
            >
              <span>مشاهدهٔ اندیشه‌ها</span>
            </Link>
          </div>
        </div>
        <video
          className="w-full rounded-xl border border-border shadow-xs"
          src="/club-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Feed + live debates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div id="ideas" className="lg:col-span-2 space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquareQuote size={18} className="text-accent" />
              <span>اندیشه‌های باشگاه</span>
            </h2>
            <div className="flex items-center gap-3 text-xs">
              {session && (
                <Link href={`/club/users/${session.user.username}`} className="text-accent hover:underline">
                  اندیشه‌های من
                </Link>
              )}
              <span className="text-muted font-mono">{ideas.length} اندیشه</span>
            </div>
          </div>

          {ideas.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl text-sm text-muted">
              هنوز اندیشه‌ای ثبت نشده — اولین فکرت را تو ثبت کن.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ideas.map((s) => (
                <IdeaCard key={s.id} idea={s} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border border-border bg-surface rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Flame size={16} className="text-accent" />
                <span>گفت‌وگوهای در جریان</span>
              </h3>
              <Link href="/club/debates" className="text-xs text-accent hover:underline">
                همه ({debates.length})
              </Link>
            </div>

            {liveDebates.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {liveDebates.map((d) => (
                  <DebateCard key={d.debate.id} debate={d} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted text-center py-4">
                در حال حاضر مباحثه فعالی وجود ندارد.
              </p>
            )}
          </div>

          <div className="border border-gold/30 bg-gold/5 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-gold">حال‌وهوای باشگاه</h4>
            <p className="text-muted leading-relaxed">
              استقلال رأی محترم است. اینجا برای تغییر باور کسی یا توافق اجباری
              جمع نمی‌شویم؛ ادعا را در ساختاری منصفانه نقد می‌کنیم و تاب‌آوری فکر را
              می‌سنجیم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
