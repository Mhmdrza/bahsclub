import Link from "next/link";
import { Bell, MessageCircle, Flag, Zap, CheckCircle, ArrowLeft } from "lucide-react";
import { getNotifications } from "@/lib/queries";
import NotifMarkRead from "./NotifMarkRead";

const typeIcons: Record<string, React.ReactNode> = {
  new_message: <MessageCircle size={14} />,
  closure_requested: <Flag size={14} />,
  new_counter: <Zap size={14} />,
  debate_started: <CheckCircle size={14} />,
};

function linkFor(n: { referenceType: string; referenceId: number }): string {
  if (n.referenceType === "debate") return `/club/debates/${n.referenceId}`;
  if (n.referenceType === "statement") return `/club/statements/${n.referenceId}`;
  return "#";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "همین الان";
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days} روز پیش`;
}

export default async function NotificationsPage() {
  const notifs = await getNotifications();

  return (
    <div className="space-y-6" dir="rtl">
      <NotifMarkRead />

      <div className="border-b border-border pb-4">
        <Link
          href="/club"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft size={12} />
          بازگشت به باشگاه
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bell size={20} />
          اعلان‌ها
        </h1>
      </div>

      {notifs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted bg-surface/50">
          اعلانی برای شما وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifs.map((n) => (
            <Link
              key={n.id}
              href={linkFor(n)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                n.isRead
                  ? "border-border bg-surface/30 text-muted"
                  : "border-accent/30 bg-accent/5 text-foreground hover:bg-accent/10"
              }`}
            >
              <span className={n.isRead ? "text-muted" : "text-accent"}>
                {typeIcons[n.type] || <Bell size={14} />}
              </span>
              <span className="flex-1 text-xs">{n.message}</span>
              <span className="text-[10px] text-muted whitespace-nowrap">
                {timeAgo(n.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}