import { useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

/** Flips between the light and dark brand themes. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "timo-dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className ?? "btn btn-ghost btn-sm"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
    </button>
  );
}
