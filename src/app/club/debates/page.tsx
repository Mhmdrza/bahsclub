import { getDebatesWithVotes } from "@/lib/queries";
import { DebateCard } from "@/components/debate/DebateCard";

export default async function DebatesPage() {
  const debates = await getDebatesWithVotes();

  return (
    <div>
      <div className="mb-6 border-b border-border pb-4">
        <div className="eyebrow mb-1">آرشیو گفتگوها</div>
        <h1 className="text-2xl font-bold tracking-tight">همه بحث‌ها</h1>
      </div>

      {debates.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
          هنوز بحثی وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {debates.map((d) => (
            <DebateCard key={d.debate.id} debate={d} />
          ))}
        </div>
      )}
    </div>
  );
}