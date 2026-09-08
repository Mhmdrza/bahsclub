"use client";

import { useState } from "react";
import { createStatementAction } from "@/lib/debate-actions";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CreateStatementPage() {
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
    <div className="max-w-xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link href="/club" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowRight size={14} />
          <span>بازگشت به باشگاه</span>
        </Link>
      </div>

      <div className="border border-border bg-surface p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
          <Sparkles size={13} />
          <span>ثبت باور جدید</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">طرح بیانیه فکری</h1>
        <p className="text-xs text-muted mb-6 leading-relaxed">
          باور و دیدگاه خود را به همراه استدلال‌های شفاف بیان کنید تا در شناسنامه فکری شما ثبت شود و دیگران بتوانند نقد یا پاسخ ارائه کنند.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const result = await createStatementAction(fd);
            if (result?.error) setError(result.error);
          }}
          className="flex flex-col gap-5"
        >
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">موضوع / عنوان باور</label>
            <input
              name="title"
              placeholder="مثال: آیا هوش مصنوعی خلاقیت اصیل دارد؟"
              required
              className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">شرح استدلال و بیانیه</label>
            <textarea
              name="content"
              placeholder="استدلال و منطق موضع خود را شرح دهید (حداقل ۵۰ حرف)..."
              required
              rows={5}
              className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">تگ‌های موضوعی (حداکثر ۵ مورد)</label>
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
                placeholder="تگ موضوعی (مثلاً فلسفه، اقتصاد)..."
                className="flex-1 px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={tags.length >= 5}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-border bg-background hover:bg-surface text-foreground disabled:opacity-50 transition-colors cursor-pointer"
              >
                افزودن
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-border bg-background text-foreground font-medium"
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
              <p className="text-[11px] mt-1.5 text-muted">حداقل یک تگ برای دسته‌بندی موضوع الزامی است.</p>
            )}
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={tags.length === 0}
            className="w-full py-2.5 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 shadow-xs cursor-pointer"
          >
            ثبت باور در باشگاه
          </button>
        </form>
      </div>
    </div>
  );
}
