import { getStatements, getDebatesWithVotes } from "@/lib/queries";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { StatementCard } from "@/components/debate/StatementCard";
import { DebateCard } from "@/components/debate/DebateCard";
import { Plus, Sparkles, MessageSquareQuote, Flame } from "lucide-react";

export default async function ClubHome() {
  const [session, { statements }, { debates }] = await Promise.all([
    getSession(),
    getStatements(),
    getDebatesWithVotes(),
  ]);

  const liveDebates = debates.filter((d) => d.debate.status === "in_progress").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Manifesto / Creator Prompt Banner */}
      <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
            <Sparkles size={13} />
            <span>شناسنامه فکری تو</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            باورهایت را ثبت کن و در محک نقد بسنج
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-6">
            در باشگاه اندیشه، هر کاربر با بیانیه‌ها و دیدگاه‌های مستدلش شناخته می‌شود. باوری که داری را تبیین کن، دلایلت را بیاور و بگذار منطق آزموده شود.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/club/statements/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity shadow-xs"
            >
              <Plus size={16} />
              <span>ثبت دیدگاه جدید</span>
            </Link>
            {session && (
              <Link
                href={`/club/users/${session.user.username}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground hover:border-accent/40 transition-colors"
              >
                <span>دیدگاه‌های ثبت‌شده من</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Feed Grid (Feed of Statements + Live Debates Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 columns: Feed of Statements / Thoughts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquareQuote size={18} className="text-accent" />
              <span>جریان اندیشه‌ها و بیانیه‌ها</span>
            </h2>
            <span className="text-xs text-muted font-mono">{statements.length} دیدگاه</span>
          </div>

          {statements.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl text-sm text-muted">
              هنوز باوری ثبت نشده است. اولین نفری باشید که دیدگاه خود را مطرح می‌کند!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {statements.map((s) => (
                <StatementCard key={s.id} statement={s} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 column: Live & Featured Debates */}
        <div className="space-y-6">
          {/* Live Debates */}
          <div className="border border-border bg-surface rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Flame size={16} className="text-accent" />
                <span>مباحثه‌های داغ و فعال</span>
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

          {/* Guidelines & Thought Identity box */}
          <div className="border border-gold/30 bg-gold/5 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-gold">قاعده باشگاه</h4>
            <p className="text-muted leading-relaxed">
              ادعا را نقد کن، نه شخص را. استدلال‌ها باید مستدل، روشن و پذیرای پاسخ‌های ساختارمند باشند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}