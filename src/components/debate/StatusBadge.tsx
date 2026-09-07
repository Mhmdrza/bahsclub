export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-sm font-medium"
      style={{ background: `${color}20`, color }}
    >
      {label}
    </span>
  );
}