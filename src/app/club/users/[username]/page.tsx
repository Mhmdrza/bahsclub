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
  const statementsCount = profile.statements?.length || 0;
  const debatesCount = profile.pagination?.total ?? (profile.debates?.length || 0);

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl font-bold font-mono">
              {profile.username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
                {profile.role === "judge" && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-gold/40 bg-gold/10 text-gold font-medium">
                    داور
                  </span>
                )}
                {profile.isTrusted && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-accent/40 bg-accent/10 text-accent font-medium">
                    معتمد
                  </span>
                )}
              </div>
              <p className="text-xs text-muted flex items-center gap-2">
                <span>عضویت از {joined}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <div className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-background border border-border">
              <span className="block text-lg font-bold text-foreground font-mono">{profile.reputation}</span>
              <span className="text-[11px] text-muted">اعتبار</span>
            </div>
            <div className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-background border border-border">
              <span className="block text-lg font-bold text-foreground font-mono">{debatesCount}</span>
              <span className="text-[11px] text-muted">مناظره</span>
            </div>
            <div className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl bg-background border border-border">
              <span className="block text-lg font-bold text-foreground font-mono">{statementsCount}</span>
              <span className="text-[11px] text-muted">بیانیه</span>
            </div>
          </div>
        </div>

        {blocked && (
          <div className="mt-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs">
            حساب مسدود تا {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(profile.blockedUntil))}
          </div>
        )}

        {/* Bio Section */}
        <div className="mt-6">
          <h2 className="text-xs font-semibold text-muted mb-2">درباره</h2>
          {isSelf ? (
            <EditBioForm initialBio={profile.bio} username={profile.username} />
          ) : (
            <p className="text-sm text-foreground/90 leading-relaxed bg-background p-4 rounded-xl border border-border/60">
              {profile.bio || "بیوگرافی ثبت نشده است."}
            </p>
          )}
        </div>
      </div>

      {/* Tags section */}
      {profile.tags && profile.tags.length > 0 && (
        <section className="border border-border bg-surface rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span>زمینه‌های فعالیت</span>
            <span className="text-xs font-normal text-muted font-mono">({profile.tags.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((t: any) => (
              <TagBadge key={t.id} name={t.name} slug={t.slug} />
            ))}
          </div>
        </section>
      )}

      {/* Statements section */}
      {profile.statements && profile.statements.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>بیانیه‌ها</span>
              <span className="text-xs font-normal text-muted font-mono">({profile.statements.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.statements.map((s: any) => (
              <Link
                key={s.id}
                href={`/club/statements/${s.id}`}
                className="group flex flex-col justify-between border border-border bg-surface rounded-xl p-4 hover:border-accent/40 transition-colors shadow-xs"
              >
                <div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {s.title}
                  </h3>
                  {s.content && (
                    <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                      {s.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted font-mono mt-4 pt-3 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12l7-7 7 7" />
                    </svg>
                    {s.vote_count || 0} رأی
                  </span>
                  {s.active_debate_count > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-accent font-medium">{s.active_debate_count} مناظره فعال</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Debates section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>مناظره‌ها</span>
            <span className="text-xs font-normal text-muted font-mono">({profile.debates?.length || 0})</span>
          </h2>
        </div>
        {profile.debates && profile.debates.length > 0 ? (
          <div className="flex flex-col gap-3">
            {profile.debates.map((d: any) => (
              <div key={d.id} className="relative">
                <span className={`absolute top-4 left-4 z-10 text-[11px] px-2 py-0.5 rounded-md font-medium ${
                  d.creator_id === profile.id ? "bg-accent/10 text-accent border border-accent/20" : "bg-surface border border-border text-muted"
                }`}>
                  {d.creator_id === profile.id ? "ایجادکننده" : "هماورد"}
                </span>
                <DebateCard
                  debate={{
                    debate: {
                      id: d.id,
                      title: d.title,
                      status: d.status,
                      createdAt: d.created_at,
                    },
                    creator: { username: d.creator_username || profile.username },
                    voteCount: d.vote_count || 0,
                    messageCount: d.message_count || 0,
                    tags: [],
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted border border-dashed border-border rounded-xl text-center py-10">
            هنوز بحثی ثبت نشده است
          </p>
        )}
      </section>
    </div>
  );
}