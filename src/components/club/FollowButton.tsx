"use client";

import { useActionState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleFollowAction } from "@/lib/debate-actions";
import { UserPlus, UserCheck } from "lucide-react";

const initialState = { error: "" };

export function FollowButton({
  username,
  initialFollowing,
  isAuthenticated = true,
}: {
  username: string;
  initialFollowing: boolean;
  isAuthenticated?: boolean;
}) {
  const [state, action, pending] = useActionState(toggleFollowAction, initialState);
  const pathname = usePathname();

  if (!isAuthenticated) {
    return (
      <Link
        href={`/club/login?next=${encodeURIComponent(pathname)}`}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl font-semibold bg-accent text-accent-fg hover:opacity-90 transition-opacity"
      >
        <UserPlus size={14} />
        برای دنبال کردن وارد شو
      </Link>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="follow" value={initialFollowing ? "false" : "true"} />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
          initialFollowing
            ? "border border-border bg-background text-foreground hover:border-red-400/50 hover:text-red-500"
            : "bg-accent text-accent-fg hover:opacity-90"
        }`}
      >
        {initialFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
        {pending ? "..." : initialFollowing ? "دنبال می‌کنی" : "دنبال کردن"}
      </button>
      {state?.error && <p className="text-[11px] text-red-500 mt-1">{state.error}</p>}
    </form>
  );
}
