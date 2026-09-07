import { getDebatesWithVotes } from "@/lib/queries";
import Link from "next/link";
import { DebateCard } from "@/components/debate/DebateCard";

export default async function DebateHome() {
  const debates = await getDebatesWithVotes();
  const openDebates = debates.filter((d) => ["open", "challengers"].includes(d.debate.status));
  const liveDebates = debates.filter((d) => d.debate.status === "in_progress");
  const recentClosed = debates.filter((d) => d.debate.status === "closed").slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "#1A1A1D" }}>باشگاه بحث</h1>
        <p className="text-sm" style={{ color: "#5C5C63" }}>
          بستری برای مناظره‌های ساختاریافته — موضوعی را مطرح کنید، چالشگر پیدا کنید، و گفتگو کنید
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <Link
          href="/debate/debates/new"
          className="px-4 py-2 text-sm rounded-sm"
          style={{ background: "#D93B3B", color: "#FFFFFF" }}
        >
          ایجاد بحث جدید
        </Link>
        <Link
          href="/debate/debates"
          className="px-4 py-2 text-sm rounded-sm border"
          style={{ borderColor: "#E5E5EA", color: "#5C5C63", background: "#FFFFFF" }}
        >
          همه بحث‌ها
        </Link>
      </div>

      {liveDebates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#1A1A1D" }}>بحث‌های در جریان</h2>
          <div className="flex flex-col gap-3">
            {liveDebates.map((d) => <DebateCard key={d.debate.id} debate={d} statusColor="#2D8B6E" />)}
          </div>
        </section>
      )}

      {openDebates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3" style={{ color: "#1A1A1D" }}>در انتظار چالشگر</h2>
          <div className="flex flex-col gap-3">
            {openDebates.map((d) => <DebateCard key={d.debate.id} debate={d} statusColor="#C7883D" />)}
          </div>
        </section>
      )}

      {recentClosed.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: "#1A1A1D" }}>بحث‌های اخیر</h2>
          <div className="flex flex-col gap-3">
            {recentClosed.map((d) => <DebateCard key={d.debate.id} debate={d} statusColor="#7B7B82" />)}
          </div>
        </section>
      )}

      {debates.length === 0 && (
        <div className="text-center py-16" style={{ color: "#5C5C63" }}>
          <p className="mb-4">هنوز بحثی ایجاد نشده است</p>
          <Link
            href="/debate/debates/new"
            className="px-4 py-2 text-sm rounded-sm"
            style={{ background: "#D93B3B", color: "#FFFFFF" }}
          >
            اولین بحث را ایجاد کنید
          </Link>
        </div>
      )}
    </div>
  );
}