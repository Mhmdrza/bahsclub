import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PageHeader({
  title,
  backHref,
  backLabel = "بازگشت",
  actions,
}: {
  title: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="text-sm text-muted hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowRight size={16} />
            {backLabel}
          </Link>
        )}
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  as,
  options,
  rows,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number | readonly string[] | undefined;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  as?: "textarea" | "select";
  options?: { value: string; label: string }[];
  rows?: number;
  hint?: string;
}) {
  const id = `field-${name}`;
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-red-500 mr-0.5">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows || 5}
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-y font-mono ${
            error ? "border-red-500" : "border-border"
          }`}
        />
      ) : as === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
            error ? "border-red-500" : "border-border"
          }`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border rounded-lg text-sm bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
            error ? "border-red-500" : "border-border"
          }`}
        />
      )}
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function ToggleField({
  label,
  name,
  checked,
  onChange,
  hint,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <label className="text-sm font-medium text-foreground" htmlFor={name}>
          {label}
        </label>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <button
        id={name}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
      {title}
    </h2>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 bg-surface rounded-xl border border-border">
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-muted text-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SubmitButton({
  loading = false,
  label = "ذخیره",
  loadingLabel = "در حال ذخیره...",
}: {
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2 bg-accent text-accent-fg text-sm font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}