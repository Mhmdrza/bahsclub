import { getDebatesWithVotes, getChallenges } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { DebateCard } from "@/components/debate/DebateCard";
import { ChallengeCard } from "@/components/debate/ChallengeCard";
import { ResponseForm } from "@/components/debate/ResponseForm";
import Link from "next/link";
import { Flame, Swords } from "lucide-react";

export default async function DebatesPage() {
  const [session, { debates }, { challenges }] = await Promise.all([
    getSession(),
    getDebatesWithVotes(),
    getChallenges(),
  ]);

  const liveDebates = debates.filter((d) => d.debate.status === "in_progress");
  const closedDebates = debates.filter((d) => d.debate.status === "closed");

  // Dangling challenges: no debate yet, so anyone can start one off them.
  const danglingChallenges = challenges.filter(
    (s) => s.activeDebateCount === 0 && (!session || s.userId !== session.user.id)
  );

  return (
    <div className="space-y-8" dir="rtl">
      <div className="border-b border-border pb-4">
        <div className="eyebrow mb-1">آرشیو گفتگوها</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">مباحثه‌ها</h1>
        <p className="text-xs text-muted mt-1">مباحثه‌های دوطرفه، ساختارمند و ثبت‌شده در تاریخچه باشگاه</p>
      </div>

      {/* Waiting for opposition — show the initial challenge so others can start a debate */}
      {danglingChallenges.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Swords size={16} className="text-accent" />
            <span>در انتظار هم‌آورد</span>
            <span className="text-xs font-normal text-muted font-mono">({danglingChallenges.length})</span>
          </h2>
          <div className="flex flex-col gap-4">
            {danglingChallenges.map((s) => (
              <div key={s.id}>
                <ChallengeCard challenge={s} />
                {session ? (
                  <details className="border border-border border-t-0 bg-surface rounded-b-2xl -mt-1 px-5 py-3">
                    <summary className="text-xs font-semibold text-accent cursor-pointer">
                      پذیرفتن این چالش
                    </summary>
                    <div className="pt-3">
                      <ResponseForm challengeId={s.id} compact />
                    </div>
                  </details>
                ) : (
                  <div className="text-center py-3 text-xs text-muted border border-border border-t-0 rounded-b-2xl bg-surface/50 -mt-1">
                    برای شروع مباحثه{" "}
                    <Link href="/club/login" className="text-accent underline font-medium">
                      وارد شوید
                    </Link>
                    .
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
