"use client";

import { useActionState, useState } from "react";
import { resolveFlagsAction } from "@/lib/moderation";

const initialState = { error: "" };

export function ResolveForm({ flaggableType, flaggableId }: { flaggableType: string; flaggableId: number }) {
  const [state, action, pending] = useActionState(resolveFlagsAction, initialState);
  const [userAction, setUserAction] = useState("dismiss");

  if (state.ok) {
    return <p className="text-xs text-accent font-medium">اقدام ثبت شد</p>;
  }

  return (
    <form action={action} className="border-t border-border pt-4 flex flex-col gap-3">
      <input type="hidden" name="flaggableType" value={flaggableType} />
      <input type="hidden" name="flaggableId" value={flaggableId} />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-foreground block mb-1">اقدام علیه کاربر</label>
          <select
            name="userAction"
            value={userAction}
            onChange={(e) => setUserAction(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded"
          >
            <option value="dismiss">بلاموضوع</option>
            <option value="warn">اخطار</option>
            <option value="temp_block">مسدودسازی موقت</option>
            <option value="rep_adjust">تغییر اعتبار</option>
            <option value="rep_lock">قفل اعتبار</option>
            <option value="rep_unlock">بازکردن قفل اعتبار</option>
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-foreground block mb-1">اقدام محتوایی</label>
          <select name="contentAction" className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded">
            <option value="none">بدون تغییر</option>
            <option value="cover">پوشش با هشدار</option>
            <option value="remove">حذف</option>
          </select>
        </div>
      </div>

      {userAction === "temp_block" && (
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">مدت (روز)</label>
          <select name="durationDays" className="px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded">
            <option value="1">۱ روز</option>
            <option value="3">۳ روز</option>
            <option value="7">۷ روز</option>
            <option value="30">۳۰ روز</option>
          </select>
        </div>
      )}

      {userAction === "rep_adjust" && (
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">مقدار تغییر اعتبار (مثبت/منفی)</label>
          <input
            name="repDelta"
            type="number"
            defaultValue={-10}
            required
            className="px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded w-24"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1">
          یادداشت {(userAction === "warn" || userAction === "rep_adjust") && "(الزامی)"}
        </label>
        <textarea
          name="note"
          rows={2}
          required={userAction === "warn" || userAction === "rep_adjust"}
          placeholder="توضیح برای ثبت سوابق..."
          className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs rounded resize-none"
        />
      </div>

      {state.error && <p className="text-xs text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-1.5 text-xs rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {pending ? "در حال ثبت..." : "ثبت اقدام"}
      </button>
    </form>
  );
}