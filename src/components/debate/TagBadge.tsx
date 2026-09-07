import Link from "next/link";

export function TagBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/club/tags/${slug}`}
      className="text-xs px-2 py-0.5 rounded border border-border bg-surface text-muted hover:text-accent hover:border-accent/40 transition-colors inline-block"
    >
      #{name}
    </Link>
  );
}