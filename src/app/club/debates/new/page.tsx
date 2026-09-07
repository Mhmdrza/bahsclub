"use client";

import { useState } from "react";
import { createDebateAction } from "@/lib/debate-actions";

export default function CreateDebatePage() {
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  return (
    <div className="max-w-xl mx-auto mt-4">
      <div className="mb-6 border-b border-border pb-4">
        <div className="eyebrow mb-1">طرح بحث</div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">ایجاد بحث جدید</h1>
        <p className="text-xs text-muted mt-1">موضوع، ادعا و چارچوب نظری اولیه خود را به شکل منقح تبیین کنید.</p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const result = await createDebateAction(fd);
          if (result?.error) setError(result.error);
        }}
        className="flex flex-col gap-5 border border-border bg-surface p-6 rounded-lg shadow-xs"
      >
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">عنوان مناظره</label>
          <input
            name="title"
            placeholder="مثال: آیا هوش مصنوعی خلاقیت اصیل دارد؟"
            required
            className="w-full px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-md focus:outline-hidden focus:border-accent"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">بیانیه اولیه / موضع نظری</label>
          <textarea
            name="initialStatement"
            placeholder="استدلال‌ها، تعاریف و مبانی ادعای خود را شرح دهید (حداقل ۵۰ حرف)..."
            required
            rows={5}
            className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-md resize-y focus:outline-hidden focus:border-accent"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">برچسب‌ها (حداکثر ۵ مورد)</label>
          <div className="flex gap-2 mb-2.5">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="برچسب موضوعی..."
              className="flex-1 px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-md focus:outline-hidden focus:border-accent"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={tags.length >= 5}
              className="px-4 py-2 text-xs font-medium rounded border border-border bg-background hover:bg-surface text-foreground disabled:opacity-50 transition-colors"
            >
              افزودن
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-background text-foreground"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-muted hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input type="hidden" name="tags" value={tags.join(",")} />
          {tags.length === 0 && (
            <p className="text-xs mt-1.5 text-muted">حداقل یک برچسب برای دسته‌بندی موضوع الزامی است.</p>
          )}
        </div>

        {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={tags.length === 0}
          className="w-full py-2.5 text-sm rounded bg-accent text-accent-fg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
        >
          ایجاد و انتشار بحث
        </button>
      </form>
    </div>
  );
}