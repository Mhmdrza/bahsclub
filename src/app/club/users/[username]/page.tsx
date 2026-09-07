import { getUserProfile } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TagBadge } from "@/components/debate/TagBadge";
import { DebateCard } from "@/components/debate/DebateCard";
import { EditBioForm } from "./edit-bio-form";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const [session, profile] = await Promise.all([getSession(), getUserProfile(username)]);
  if (!profile) notFound();

  const isSelf = !!session && session.user.username === username;
  const blocked = profile.blockedUntil && new Date(profile.blockedUntil) > new Date();

  const joined = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(profile.createdAt));

  return (
    <div dir="rtl">
      <div className="border border-border bg-surface rounded-lg p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
              {profile.role === "judge" && (
                <span className="text-xs px-2 py-0.5 rounded border border-gold/40 bg-gold/10 text-gold font-medium">داور</span>
              )}
              {profile.isTrusted && (
                <span className="text-xs px-2 py-0.5 rounded border border-accent/40 bg-accent/10 text-accent font-medium">معتمد</span>
              )}
            </div>
            <p className="text-xs text-muted font-mono mt-1">
              اعتبار: <span className="font-bold text-foreground">{profile.reputation}</span>
              <span className="mx-1.5 opacity-50">|</span>
              عضو از {joined}
            </p>
            {blocked && (
              <p className="text-xs text-red-500 mt-1">
                حساب مسدود تا {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(profile.blockedUntil))}
              </p>
            )}
          </div>
        </div>

        {isSelf ? (
          <EditBioForm initialBio={profile.bio} username={profile.username} />
        ) : (
          profile.bio && (
            <p className="text-sm text-muted leading-relaxed mt-2 bg-background p-3 rounded border border-border/60">{profile.bio}</p>
          )
        )}
      </div>

      {profile.tags && profile.tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-foreground mb-3">زمینه‌های بحث</h2>
          <div className="flex flex-wrap gap-1.5">
            {profile.tags.map((t: any) => (
              <TagBadge key={t.id} name={t.name} slug={t.slug} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-foreground mb-4">
          بحث‌ها ({profile.debates?.length || 0})
        </h2>
        {profile.debates && profile.debates.length > 0 ? (
          <div className="flex flex-col gap-3">
            {profile.debates.map((d: any) => (
              <div key={d.id} className="relative">
                <span className={`absolute top-3 right-3 z-10 text-xs px-1.5 py-0.5 rounded font-medium ${
                  d.creator_id === profile.id ? "bg-accent/10 text-accent" : "bg-surface border border-border text-muted"
                }`}>
                  {d.creator_id === profile.id ? "ایجادکننده" : "هماورد"}
                </span>
                <DebateCard
                  debate={{
                    debate: {
                      id: d.id,
                      title: d.title,
                      status: d.status,
                      currentTurn: d.current_turn ?? 0,
                      maxTurns: d.max_turns ?? 10,
                      createdAt: d.created_at,
                    },
                    creator: { username: d.creator_username },
                    voteCount: d.vote_count || 0,
                    turnCount: d.current_turn || 0,
                    tags: [],
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted border border-dashed border-border rounded-lg text-center py-8">
            هنوز بحثی ثبت نشده
          </p>
        )}
      </div>
    </div>
  );
}