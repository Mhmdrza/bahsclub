"use client";

import { useActionState, useState } from "react";
import { updateIdeaAction } from "@/lib/debate-actions";
import { Plus } from "lucide-react";

const MAX_TAGS = 5;
const initialState = { error: "", success: false };

export function EditIdeaForm({
  idea,
}: {
  idea: {
    id: number;
    title: string;
    reasoning: string;
    confidence: number;
    sources: string;
    falsifier: string;
    openToResponse: boolean;
    tags: { name: string }[];
  };
}) {
  const [state, action, pending] = useActionState(updateIdeaAction, initialState);
  const [selected, setSelected] = useState<string[]>(idea.tags.map((t) => t.name));
  const [tagInput, setTagInput] = useState("");
  const [openToResponse, setOpenToResponse] = useState(idea.openToResponse);
  const [confidence, setConfidence] = useState(idea.confidence);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || selected.includes(t) || selected.length >= MAX_TAGS) return;
    setSelected([...selected, t]);
    setTagInput("");
  };

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="ideaId" value={idea.id} />
      <input type="hidden" name="openToResponse" value={openToResponse ? "true" : "false"} />

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">عنوان</label>
        <input
          name="title"
          defaultValue={idea.title}
          required
          maxLength={200}
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">استدلال</label>
        <textarea
          name="reasoning"
          defaultValue={idea.reasoning}
          required
          rows={6}
          maxLength={5000}
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">
          اطمینان: <span className="font-mono text-accent">{confidence}٪</span>
        </label>
        <input
          type="range"
          name="confidence"
          min={0}
          max={100}
          step={5}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <textarea
          name="sources"
          defaultValue={idea.sources}
          rows={2}
          maxLength={2000}
          placeholder="منابع (اختیاری)"
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent"
        />
        <textarea
          name="falsifier"
          defaultValue={idea.falsifier}
          rows={2}
          maxLength={2000}
          placeholder="چه چیزی نظرت را عوض می‌کند؟ (اختیاری)"
          className="w-full px-3.5 py-2.5 border border-border bg-background text-foreground text-sm rounded-xl resize-y focus:outline-hidden focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">موضوع‌ها</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelected(selected.filter((x) => x !== t))}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-accent/30 bg-accent/10 text-accent font-medium cursor-pointer"
            >
              #{t}
              <span className="text-accent/70">×</span>
            </button>
          ))}
        </div>
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
            placeholder="افزودن موضوع..."
            className="flex-1 px-3.5 py-2 border border-border bg-background text-foreground text-sm rounded-xl focus:outline-hidden focus:border-accent disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={selected.length >= MAX_TAGS}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background hover:bg-surface disabled:opacity-50 cursor-pointer"
          >
            <Plus size={13} />
            افزودن
          </button>
        </div>
        {selected.map((t) => (
          <input key={t} type="hidden" name="tags" value={t} />
        ))}
      </div>

      <label className="flex items-center gap-2.5 text-xs text-foreground bg-background border border-border rounded-xl p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={openToResponse}
          onChange={(e) => setOpenToResponse(e.target.checked)}
          className="accent-[var(--accent)]"
        />
        <span>پذیرای پاسخ و چالش باشد</span>
      </label>

      {state?.error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>}
      {state?.success && <p className="text-xs text-green-600 dark:text-green-400 font-medium">ذخیره شد. نسخهٔ تازه ثبت شد.</p>}

      <button
        type="submit"
        disabled={pending || selected.length === 0}
        className="self-start px-4 py-2 text-sm rounded-xl bg-accent text-accent-fg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
      >
        {pending ? "در حال ذخیره..." : "ذخیرهٔ نسخهٔ تازه"}
      </button>
    </form>
  );
}
