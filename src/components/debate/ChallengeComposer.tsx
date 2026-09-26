"use client";

import { useActionState, useState } from "react";
import { createChallengeAction } from "@/lib/debate-actions";
import { Plus } from "lucide-react";

const MAX_TAGS = 5;
const initialState = { error: "" };

export function ChallengeComposer({
  availableTags,
}: {
  availableTags: { id: number; name: string; slug: string; count: number }[];
}) {
  const [state, action, pending] = useActionState(createChallengeAction, initialState);
  const [selected, setSelected] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");

  const toggle = (name: string) => {
    setSelected((cur) =>
      cur.includes(name) ? cur.filter((t) => t !== name) : cur.length < MAX_TAGS ? [...cur, name] : cur
    );
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || selected.includes(t) || selected.length >= MAX_TAGS) return;
    setSelected([...selected, t]);
    setTagInput("");
  };

  const suggestions = availableTags.filter((t) => !selected.includes(t.name));

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">عنوان چالش</label>
        <input
          name="title"
          placeholder="مثال: آیا هوش مصنوعی خلاقیت اصیل دارد؟"
          required
          maxLength={200}
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors"
        />
        <p className="text-[11px] text-muted mt-1.5">۵ تا ۲۰۰ حرف</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">موضع و استدلال تو</label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="موضع و استدلال خود را شفاف بنویس..."
          required
          rows={6}
          maxLength={5000}
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent transition-colors"
        />
        <p className={`text-[11px] mt-1.5 ${content.length > 0 && content.length < 50 ? "text-red-500" : "text-muted"}`}>
          {content.length} / ۵۰۰۰ حرف — حداقل ۵۰ حرف
        </p>
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">
          موضوع‌ها (۱ تا {MAX_TAGS} مورد)
        </label>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {selected.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-accent/30 bg-accent/10 text-accent font-medium cursor-pointer"
              >
                #{t}
                <span className="text-accent/70">×</span>
              </button>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <>
            <p className="text-[11px] text-muted mb-1.5">موضوع‌های موجود — برای انتخاب کلیک کن:</p>
            <div className="flex flex-wrap gap-1.5 mb-2.5 max-h-32 overflow-y-auto">
              {suggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggle(t.name)}
                  disabled={selected.length >= MAX_TAGS}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-border bg-background text-muted hover:text-accent hover:border-accent/30 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  #{t.name}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            disabled={selected.length >= MAX_TAGS}
            placeholder="موضوع جدید..."
            className="flex-1 px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={selected.length >= MAX_TAGS}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background hover:bg-surface text-foreground disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            افزودن
          </button>
        </div>

        {selected.map((t) => (
          <input key={t} type="hidden" name="tags" value={t} />
        ))}
        {selected.length === 0 && (
          <p className="text-[11px] mt-1.5 text-muted">حداقل یک موضوع برای دسته‌بندی الزامی است.</p>
        )}
      </div>

      {state?.error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || selected.length === 0}
        className="w-full py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-1 shadow-xs cursor-pointer"
      >
        {pending ? "در حال ثبت..." : "شروع چالش"}
      </button>
    </form>
  );
}
