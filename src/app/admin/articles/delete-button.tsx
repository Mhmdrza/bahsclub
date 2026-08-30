"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteArticleButton({
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
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در حذف مقاله");
      }
    } catch {
      alert("خطا در حذف مقاله");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="حذف"
    >
      <Trash2 size={16} />
    </button>
  );
}