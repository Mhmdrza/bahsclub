"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteLessonButton({
  slug,
  sha,
}: {
  slug: string;
  sha: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`آیا از حذف "${slug}" اطمینان دارید؟`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/lessons/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در حذف درس");
      }
    } catch {
      alert("خطا در حذف درس");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="حذف"
    >
      <Trash2 size={16} />
    </button>
  );
}