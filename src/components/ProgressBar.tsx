import { formatPersianNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  completed,
  total,
  className,
  showLabel = true,
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <p className="text-sm text-muted">
          {formatPersianNumber(completed)} از {formatPersianNumber(total)} درس
          کامل شده
        </p>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-md bg-border"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت: ${formatPersianNumber(percent)} درصد`}
      >
        <div
          className="h-full rounded-md bg-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
