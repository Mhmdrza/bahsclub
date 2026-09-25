"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyArticleButtonProps {
  slug: string;
}

export function CopyArticleButton({ slug }: CopyArticleButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/articles/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent/40"
      title="کپی لینک مقاله"
    >
      {copied ? (
        <Check className="h-4 w-4 text-accent" aria-hidden />
      ) : (
        <Copy className="h-4 w-4 text-muted" aria-hidden />
      )}
      {copied ? "کپی شد" : "کپی لینک"}
    </button>
  );
}