import { getDebatesWithVotes } from "@/lib/queries";
import { DebateCard } from "@/components/debate/DebateCard";
import { Flame } from "lucide-react";

export default async function DebatesPage() {
  const { debates } = await getDebatesWithVotes();
  const liveDebates = debates.filter((d) => d.debate.status === "in_progress");
  const closedDebates = debates.filter((d) => d.debate.status === "closed");
  const otherDebates = debates.filter((d) => d.debate.status !== "in_progress" && d.debate.status !== "closed");

  return (
    <div className="space-y-8" dir="rtl">
      <div className="border-b border-border pb-4">
        <div className="eyebrow mb-1">آرشیو گفتگوها</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">مناظره‌ها</h1>
        <p className="text-xs text-muted mt-1">مناظره‌های دوطرفه، ساختاریافته و ثبت‌شده در تاریخچه باشگاه</p>
      </div>

      {debates.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
          هنوز بحثی ثبت نشده است
        </div>
      ) : (
        <div className="space-y-8">
          {liveDebates.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Flame size={16} className="text-accent" />
                <span>در جریان</span>
                <span className="text-xs font-normal text-muted font-mono">({liveDebates.length})</span>
              </h2>
              <div className="flex flex-col gap-3">
                {liveDebates.map((d) => (
                  <DebateCard key={d.debate.id} debate={d} />
                ))}
              </div>
            </section>
          )}

          {otherDebates.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span>در انتظار هماورد و داوری</span>
                <span className="text-xs font-normal text-muted font-mono">({otherDebates.length})</span>
              </h2>
              <div className="flex flex-col gap-3">
                {otherDebates.map((d) => (
                  <DebateCard key={d.debate.id} debate={d} />
                ))}
              </div>
            </section>
          )}

          {closedDebates.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span>پایان‌یافته و ثبت تاریخچه</span>
                <span className="text-xs font-normal text-muted font-mono">({closedDebates.length})</span>
              </h2>
              <div className="flex flex-col gap-3">
                {closedDebates.map((d) => (
                  <DebateCard key={d.debate.id} debate={d} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}