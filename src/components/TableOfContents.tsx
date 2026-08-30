import type { TocHeading } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: TocHeading[];
  variant?: "mobile" | "desktop";
}

export function TableOfContents({
  headings,
  variant = "mobile",
}: TableOfContentsProps) {
  if (headings.length === 0) return null;

  const list = (
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={cn(heading.level === 3 && "mr-4")}
        >
          <a
            href={`#${heading.id}`}
            className="text-muted hover:text-accent"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "desktop") {
    return (
      <aside aria-label="فهرست مطالب">
        <p className="mb-3 text-sm font-semibold">فهرست مطالب</p>
        <nav>{list}</nav>
      </aside>
    );
  }

  return (
    <details className="mb-6 rounded-lg border border-border bg-surface">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
        فهرست مطالب
      </summary>
      <div className="border-t border-border px-4 py-3">{list}</div>
    </details>
  );
}
