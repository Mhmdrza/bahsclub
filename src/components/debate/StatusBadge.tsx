export function StatusBadge({ status, label }: { status?: string; label?: string }) {
  const statusLabels: Record<string, string> = {
    in_progress: "در جریان",
    closed: "پایان یافته",
  };

  const currentLabel = label || (status ? statusLabels[status] : "") || status || "";

  const colorStyles: Record<string, string> = {
    in_progress: "bg-accent-light text-accent border-accent/30",
    closed: "bg-surface text-muted border-border",
  };

  const styleClass = (status && colorStyles[status]) || "bg-surface text-muted border-border";

  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${styleClass}`}>
      {currentLabel}
    </span>
  );
}
