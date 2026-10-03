import Link from "next/link";
import { LogIn, UserPlus, Lock } from "lucide-react";

// Friendly gate for logged-out users whose action needs auth.
// Carries `next` so login/register return them to exactly this spot.
export function AuthGate({
  next,
  title = "برای ادامه وارد شو",
  message = "این کار به حساب کاربری نیاز دارد. با یک ورود کوتاه، همان‌جا که بودی ادامه می‌دهی.",
  compact = false,
}: {
  next: string;
  title?: string;
  message?: string;
  compact?: boolean;
}) {
  const loginHref = `/club/login?next=${encodeURIComponent(next)}`;
  const registerHref = `/club/register?next=${encodeURIComponent(next)}`;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-surface/50 px-4 py-3 text-xs">
        <span className="text-muted flex items-center gap-1.5">
          <Lock size={13} className="text-accent" />
          {title}
        </span>
        <span className="flex items-center gap-2">
          <Link href={loginHref} className="font-semibold text-accent hover:underline">
            ورود
          </Link>
          <Link href={registerHref} className="text-muted hover:text-foreground">
            عضویت
          </Link>
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6 shadow-xs" dir="rtl">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
          <Lock size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
          <p className="text-xs text-muted leading-relaxed mb-4">{message}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={loginHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              <LogIn size={14} />
              ورود و ادامه
            </Link>
            <Link
              href={registerHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-medium hover:border-accent/40 transition-colors"
            >
              <UserPlus size={14} />
              تازه‌واردی؟ ثبت‌نام
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
