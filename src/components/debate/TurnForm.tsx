"use client";

import { useActionState } from "react";
import { postTurnAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function TurnForm({ debateId, turnNumber }: { debateId: number; turnNumber: number }) {
  const [state, action, pending] = useActionState(postTurnAction, initialState);

  return (
    <div className="mt-4 border-t pt-4" style={{ borderColor: "#E5E5EA" }}>
      <h3 className="text-sm font-bold mb-2" style={{ color: "#1A1A1D" }}>نوبت {turnNumber}</h3>
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="debateId" value={debateId} />
        <textarea
          name="content"
          placeholder="نظر خود را بنویسید..."
          required
          rows={4}
          className="w-full px-3 py-2 border text-sm rounded-sm resize-y"
          style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
        />
        {state?.error && (
          <p className="text-sm" style={{ color: "#D93B3B" }}>{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="self-start px-4 py-2 text-sm rounded-sm disabled:opacity-50"
          style={{ background: "#D93B3B", color: "#FFFFFF" }}
        >
          {pending ? "..." : "ارسال"}
        </button>
      </form>
    </div>
  );
}