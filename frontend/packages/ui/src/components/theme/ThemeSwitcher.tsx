import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "@timo/brand";
import { cn } from "../../lib/utils/cn";

interface ThemeSwitcherProps {
  /** Collapse to a single cycling icon button (icon rail). */
  collapsed?: boolean;
}

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "timo-light", label: "Light", Icon: Sun },
  { value: "timo-dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/** Light / Dark / System preference control shown in the sidebar footer. */
export function ThemeSwitcher({ collapsed = false }: ThemeSwitcherProps) {
  const { preference, resolvedTheme, setPreference } = useTheme();

  if (collapsed) {
    // Icon rail: one button cycling Light → Dark → System, showing the active glyph.
    const order: ThemePreference[] = ["timo-light", "timo-dark", "system"];
    const next = order[(order.indexOf(preference) + 1) % order.length];
    const ActiveIcon =
      preference === "system" ? Monitor : resolvedTheme === "timo-dark" ? Moon : Sun;
    return (
      // `.btn` is inline-flex, so `mx-auto` alone would not centre it — the
      // flex wrapper is what lines the glyph up with the nav icon rail.
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setPreference(next)}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label={`Theme: ${preference === "system" ? "System" : preference === "timo-dark" ? "Dark" : "Light"}. Click to change.`}
          title="Change theme"
        >
          <ActiveIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="bg-base-200 rounded-box flex items-center gap-1 p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setPreference(value)}
            aria-pressed={active}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[calc(var(--radius-box)-0.25rem)] px-2 py-1.5 text-xs font-medium transition-colors duration-200 ease-out",
              active
                ? "bg-base-100 text-base-content shadow-sm"
                : "text-base-content/60 hover:text-base-content",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
