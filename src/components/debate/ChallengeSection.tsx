"use client";

import { useActionState } from "react";
import { challengeAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function ChallengeSection({ debateId }: { debateId: number }) {
  const [state, action, pending] = useActionState(challengeAction, initialState);

  return (
    <div className="mt-6 border-t pt-4" style={{ borderColor: "#E5E5EA" }}>
      <h2 className="text-lg font-bold mb-3" style={{ color: "#1A1A1D" }}>چالش</h2>
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="debateId" value={debateId} />
        <textarea
          name="positionStatement"
          placeholder="موضع خود را در این بحث بیان کنید (حداقل ۵۰ حرف)"
          required
          rows={4}
          className="w-full px-3 py-2 border text-sm rounded-sm resize-y"
          style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
        />
        {state?.error && (
          <p className="text-sm" style={{ color: "#D93B3B" }}>{state.error}</p>
        )}
        {!state?.error && (
          <p className="text-sm" style={{ color: "#2D8B6E" }}>{}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="self-start px-4 py-2 text-sm rounded-sm disabled:opacity-50"
          style={{ background: "#D93B3B", color: "#FFFFFF" }}
        >
          {pending ? "..." : "ارسال موضع"}
        </button>
      </form>
    </div>
  );
}