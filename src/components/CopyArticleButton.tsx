"use client";

import { useState, useRef } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";

interface CopyArticleButtonProps {
  slug: string;
  content?: string;
}

export function CopyArticleButton({ slug, content }: CopyArticleButtonProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("textarea");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const copyUrl = async () => {
    const url = `${window.location.origin}/articles/${slug}`;
    await copyToClipboard(url, "url");
  };

  const copyContent = async () => {
    if (content) {
      await copyToClipboard(content, "content");
    }
  };

  return (
<div className="relative flex flex-wrap gap-2">
      <button
          type="button"
          onClick={copyUrl}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent/40 whitespace-nowrap"
          title="کپی لینک مقاله"
        >
          {copied === "url" ? (
            <Check className="h-4 w-4 text-accent" aria-hidden />
          ) : (
            <Copy className="h-4 w-4 text-muted" aria-hidden />
          )}
          <span>
            {copied === "url" ? "کپی شد" : "کپی لینک"}
          </span>
        </button>

      {content && (
        <button
          type="button"
          onClick={copyContent}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:border-accent/40 whitespace-nowrap"
          title="کپی محتوای مقاله"
        >
          {copied === "content" ? (
            <Check className="h-4 w-4 text-accent" aria-hidden />
          ) : (
            <Copy className="h-4 w-4 text-muted" aria-hidden />
          )}
          <span>
            {copied === "content" ? "کپی شد" : "کپی محتوا"}
          </span>
        </button>
      )}
    </div>
  );
}