import Link from "next/link";

export function TagBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/debate/tags/${slug}`}
      className="text-xs px-2 py-0.5 rounded-sm hover:opacity-80 inline-block"
      style={{ background: "#F5F5F7", color: "#5C5C63", border: "1px solid #E5E5EA" }}
    >
      {name}
    </Link>
  );
}