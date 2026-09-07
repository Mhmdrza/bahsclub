"use client";

import { useActionState, useState, useEffect } from "react";
import { updateBioAction } from "@/lib/moderation";

const initialState = { error: "" };

export function EditBioForm({ initialBio, username }: { initialBio: string; username: string }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateBioAction, initialState);
  const ok = "ok" in state;

  useEffect(() => { if (ok) setEditing(false); }, [ok]);

  if (!editing) {
    return (
      <div className="mt-2">
        {initialBio ? (
          <p className="text-sm text-muted leading-relaxed bg-background p-3 rounded border border-border/60">{initialBio}</p>
        ) : (
          <p className="text-xs text-muted/60 italic">بیوگرافی ثبت نشده</p>
        )}
        <button
          onClick={() => setEditing(true)}
          className="mt-2 text-xs text-accent hover:underline"
        >
          ویرایش
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="mt-2">
      <input type="hidden" name="username" value={username} />
      <textarea
        name="bio"
        defaultValue={initialBio}
        placeholder="درباره خودت بنویس..."
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 border border-border bg-background text-foreground text-sm rounded-md resize-y focus:outline-hidden focus:border-accent"
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-3 py-1.5 text-xs rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "..." : "ذخیره"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-3 py-1.5 text-xs rounded border border-border text-muted hover:text-foreground"
        >
          انصراف
        </button>
      </div>
      {state.error && <p className="text-xs text-red-500 mt-1">{state.error}</p>}
    </form>
  );
}