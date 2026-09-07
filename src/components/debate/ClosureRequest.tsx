"use client";

import { useActionState } from "react";
import { requestClosureAction } from "@/lib/debate-actions";

const initialState = { error: "" };

export function ClosureRequest({
  debateId,
  hasRequested,
  otherRequested,
}: {
  debateId: number;
  hasRequested: boolean;
  otherRequested: boolean;
}) {
  const [state, action, pending] = useActionState(requestClosureAction, initialState);

  if (hasRequested) {
    return (
      <div className="mt-4 text-center py-3 text-sm rounded-sm" style={{ background: "#F5F5F7", color: "#5C5C63" }}>
        شما درخواست اتمام بحث داده‌اید. منتظر تأیید حریف.
      </div>
    );
  }

  if (otherRequested) {
    return (
      <div className="mt-4">
        <form action={action} className="text-center">
          <input type="hidden" name="debateId" value={debateId} />
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm rounded-sm disabled:opacity-50"
            style={{ background: "#2D8B6E", color: "#FFFFFF" }}
          >
            {pending ? "..." : "قبول اتمام بحث"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-4 text-center">
      <form action={action}>
        <input type="hidden" name="debateId" value={debateId} />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 text-sm rounded-sm disabled:opacity-50"
          style={{ background: "#F5F5F7", color: "#5C5C63", border: "1px solid #E5E5EA" }}
        >
          {pending ? "..." : "درخواست اتمام بحث"}
        </button>
      </form>
      {state?.error && (
        <p className="text-sm mt-2" style={{ color: "#D93B3B" }}>{state.error}</p>
      )}
    </div>
  );
}