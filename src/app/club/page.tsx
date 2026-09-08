import { getStatements, getDebatesWithVotes } from "@/lib/queries";
import Link from "next/link";
import { StatementCard } from "@/components/debate/StatementCard";
import { DebateCard } from "@/components/debate/DebateCard";

export default async function ClubHome() {
  const [{ statements }, { debates }] = await Promise.all([getStatements(), getDebatesWithVotes()]);
  const liveDebates = debates.filter((d) => d.debate.status === "in_progress");
  const recentClosed = debates.filter((d) => d.debate.status === "closed").slice(0, 5);

  return (
    <div>
      <div className="mb-8 border-b border-border pb-6">
        <div className="eyebrow mb-2">گفتگو و مناظره</div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">باشگاه بحث</h1>
        <p className="text-sm text-muted max-w-xl leading-relaxed">
          بیانیه‌ای مطرح کنید، پاسخ دریافت کنید، و مناظره‌های ساختاریافته شکل دهید.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-10">
        <Link
          href="/club/statements/new"
          className="px-4 py-2 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          طرح بیانیه
        </Link>
        <Link
          href="/club/statements"
          className="px-4 py-2 text-sm rounded border border-border bg-surface text-foreground hover:border-muted/50 transition-colors"
        >
          همه بیانیه‌ها
        </Link>
      </div>

      {/* Statements feed */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-foreground mb-4">بیانیه‌های اخیر</h2>
        {statements.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg text-sm text-muted">
            هنوز بیانیه‌ای ثبت نشده
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {statements.slice(0, 8).map((s) => (
              <StatementCard key={s.id} statement={s} />
            ))}
          </div>
        )}
      </section>

      {/* Active debates */}
      {liveDebates.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-base font-bold text-foreground">مناظره‌های در جریان</h2>
          </div>
          <div className="flex flex-col gap-3">
            {liveDebates.map((d) => <DebateCard key={d.debate.id} debate={d} />)}
          </div>
        </section>
      )}

      {/* Recent closed */}
      {recentClosed.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">بحث‌های پایان‌یافته</h2>
          <div className="flex flex-col gap-3">
            {recentClosed.map((d) => <DebateCard key={d.debate.id} debate={d} />)}
          </div>
        </section>
      )}
    </div>
  );
}