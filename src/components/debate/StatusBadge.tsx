export function StatusBadge({ status, label }: { status?: string; label?: string }) {
  const statusLabels: Record<string, string> = {
    open: "در انتظار چالشگر",
    challengers: "در حال بررسی",
    in_progress: "در جریان",
    closed: "پایان یافته",
  };

  const currentLabel = label || (status ? statusLabels[status] : "") || status || "";

  const colorStyles: Record<string, string> = {
    open: "bg-gold-light text-gold border-gold/30",
    challengers: "bg-gold-light text-gold border-gold/30",
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