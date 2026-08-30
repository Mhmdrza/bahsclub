"use client";

import { useTheme, type Theme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "روشن", icon: Sun },
  { value: "dark", label: "تاریک", icon: Moon },
  { value: "system", label: "سیستم", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-md border border-border bg-surface p-0.5">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          title={label}
          className={`flex items-center justify-center rounded-sm p-1.5 text-sm transition-colors ${
            theme === value
              ? "bg-accent text-accent-fg"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Icon size={16} aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}