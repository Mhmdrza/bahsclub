import { getDebatesWithVotes } from "@/lib/queries";
import Link from "next/link";
import { DebateCard } from "@/components/debate/DebateCard";

export default async function DebateHome() {
  const { debates } = await getDebatesWithVotes();
  const openDebates = debates.filter((d) => ["open", "challengers"].includes(d.debate.status));
  const liveDebates = debates.filter((d) => d.debate.status === "in_progress");
  const recentClosed = debates.filter((d) => d.debate.status === "closed").slice(0, 5);

  return (
    <div>
      <div className="mb-8 border-b border-border pb-6">
        <div className="eyebrow mb-2">دیالوگ و گفتگو</div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">باشگاه بحث</h1>
        <p className="text-sm text-muted max-w-xl leading-relaxed">
          بستری برای مناظره‌های ساختاریافته — موضوعی را مطرح کنید، چالشگر پیدا کنید، و استدلال‌های خود را بسنجید.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-10">
        <Link
          href="/club/debates/new"
          className="px-4 py-2 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          ایجاد بحث جدید
        </Link>
        <Link
          href="/club/debates"
          className="px-4 py-2 text-sm rounded border border-border bg-surface text-foreground hover:border-muted/50 transition-colors"
        >
          همه بحث‌ها
        </Link>
      </div>

      {liveDebates.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-base font-bold text-foreground">بحث‌های در جریان</h2>
          </div>
          <div className="flex flex-col gap-3">
            {liveDebates.map((d) => <DebateCard key={d.debate.id} debate={d} />)}
          </div>
        </section>
      )}

      {openDebates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-foreground mb-4">در انتظار چالشگر</h2>
          <div className="flex flex-col gap-3">
            {openDebates.map((d) => <DebateCard key={d.debate.id} debate={d} />)}
          </div>
        </section>
      )}

      {recentClosed.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">بحث‌های پایان‌یافته</h2>
          <div className="flex flex-col gap-3">
            {recentClosed.map((d) => <DebateCard key={d.debate.id} debate={d} />)}
          </div>
        </section>
      )}

      {debates.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-lg bg-surface/50 text-muted">
          <p className="mb-4 text-sm">هنوز بحثی ایجاد نشده است</p>
          <Link
            href="/club/debates/new"
            className="inline-block px-4 py-2 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 transition-opacity"
          >
            اولین بحث را ایجاد کنید
          </Link>
        </div>
      )}
    </div>
  );
}