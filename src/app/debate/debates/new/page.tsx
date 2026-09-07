"use client";

import { useState } from "react";
import { createDebateAction } from "@/lib/debate-actions";

const initialState = { error: "" };

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
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#1A1A1D" }}>ایجاد بحث جدید</h1>
      <p className="text-sm mb-6" style={{ color: "#5C5C63" }}>موضوع و موضع اولیه خود را مشخص کنید</p>

      <form onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const result = await createDebateAction(fd);
        if (result?.error) setError(result.error);
      }} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1" style={{ color: "#1A1A1D" }}>عنوان</label>
          <input
            name="title"
            placeholder="عنوان بحث"
            required
            className="w-full px-3 py-2 border text-sm rounded-sm"
            style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1" style={{ color: "#1A1A1D" }}>بیانیه اولیه</label>
          <textarea
            name="initialStatement"
            placeholder="موضع خود را توضیح دهید (حداقل ۵۰ حرف)"
            required
            rows={5}
            className="w-full px-3 py-2 border text-sm rounded-sm resize-y"
            style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1" style={{ color: "#1A1A1D" }}>برچسب‌ها</label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="برچسب جدید..."
              className="flex-1 px-3 py-2 border text-sm rounded-sm"
              style={{ borderColor: "#E5E5EA", background: "#FFFFFF", color: "#1A1A1D" }}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={tags.length >= 5}
              className="px-3 py-2 text-sm rounded-sm disabled:opacity-50"
              style={{ background: "#D93B3B", color: "#FFFFFF" }}
            >
              افزودن
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-sm"
                style={{ background: "#F5F5F7", color: "#1A1A1D", border: "1px solid #E5E5EA" }}
              >
                {t}
                <button type="button" onClick={() => removeTag(t)} className="text-sm" style={{ color: "#5C5C63" }}>×</button>
              </span>
            ))}
          </div>
          <input type="hidden" name="tags" value={tags.join(",")} />
          {tags.length === 0 && <p className="text-xs mt-1" style={{ color: "#5C5C63" }}>حداقل یک برچسب الزامی است</p>}
        </div>

        {error && (
          <p className="text-sm" style={{ color: "#D93B3B" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={tags.length === 0}
          className="w-full py-2 text-sm rounded-sm disabled:opacity-50"
          style={{ background: "#D93B3B", color: "#FFFFFF" }}
        >
          ایجاد بحث
        </button>
      </form>
    </div>
  );
}