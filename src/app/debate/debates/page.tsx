import { getDebatesWithVotes } from "@/lib/queries";
import { DebateCard } from "@/components/debate/DebateCard";

export default async function DebatesPage() {
  const debates = await getDebatesWithVotes();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#1A1A1D" }}>همه بحث‌ها</h1>
      {debates.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#5C5C63" }}>
          هنوز بحثی وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {debates.map((d) => (
            <DebateCard
              key={d.debate.id}
              debate={d}
              statusColor={
                d.debate.status === "in_progress" ? "#2D8B6E" :
                ["open", "challengers"].includes(d.debate.status) ? "#C7883D" : "#7B7B82"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}