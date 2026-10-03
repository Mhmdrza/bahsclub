import { getDebatesWithVotes, getIdeas } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { DebateCard } from "@/components/debate/DebateCard";
import { IdeaCard } from "@/components/debate/IdeaCard";
import { ResponseForm } from "@/components/debate/ResponseForm";
import { AuthGate } from "@/components/club/AuthGate";
import { Flame, MessageSquareQuote } from "lucide-react";

export default async function DebatesPage() {
  const [session, { debates }, { ideas }] = await Promise.all([
    getSession(),
    getDebatesWithVotes(),
    getIdeas(),
  ]);

  const liveDebates = debates.filter((d) => d.debate.status === "in_progress");
  const closedDebates = debates.filter((d) => d.debate.status === "closed");

  // Ideas still open to a challenge, with no active debate yet.
  const openIdeas = ideas.filter(
    (s) => s.activeDebateCount === 0 && s.openToResponse && (!session || s.userId !== session.user.id)
  );

  return (
    <div className="space-y-8" dir="rtl">
      <div className="border-b border-border pb-4">
        <div className="eyebrow mb-1">آرشیو گفتگوها</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">مباحثه‌ها</h1>
        <p className="text-xs text-muted mt-1">مباحثه‌های دوطرفه، ساختارمند و ثبت‌شده در تاریخچه باشگاه</p>
      </div>

      {openIdeas.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <MessageSquareQuote size={16} className="text-accent" />
            <span>اندیشه‌های آمادهٔ نقد</span>
            <span className="text-xs font-normal text-muted font-mono">({openIdeas.length})</span>
          </h2>
          <div className="flex flex-col gap-4">
            {openIdeas.map((s) => (
              <div key={s.id}>
                <IdeaCard idea={s} />
                {session ? (
                  <details className="border border-border border-t-0 bg-surface rounded-b-2xl -mt-1 px-5 py-3">
                    <summary className="text-xs font-semibold text-accent cursor-pointer">
                      پاسخ دادن یا ساخت چالش
                    </summary>
                    <div className="pt-3">
                      <ResponseForm ideaId={s.id} compact />
                    </div>
                  </details>
                ) : (
                  <div className="-mt-1">
                    <AuthGate
                      compact
                      next="/club/debates"
                      title="برای پاسخ دادن وارد شو"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

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
