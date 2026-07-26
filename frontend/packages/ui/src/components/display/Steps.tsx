import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export interface StepItem {
  /** Unique value identifying the step. */
  id: string;
  /** Step label shown beneath the marker. */
  label: ReactNode;
  /**
   * Custom marker rendered inside the step circle (daisyUI `data-content`),
   * e.g. "✓", "?", "!", or "●". Defaults to the step's number.
   */
  marker?: string;
}

/** daisyUI step colour applied to completed / active steps. */
export type StepsColor =
  "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";

interface StepsProps extends Omit<HTMLAttributes<HTMLUListElement>, "color"> {
  /** Steps to render, in order. */
  items: StepItem[];
  /**
   * Zero-based index of the current step. That step and every step before it are
   * coloured. Defaults to 0 (only the first step). Pass -1 for none.
   */
  current?: number;
  /** Colour applied to completed / active steps. Defaults to "primary". */
  color?: StepsColor;
  /** Lay the steps out vertically instead of horizontally. */
  vertical?: boolean;
  ref?: Ref<HTMLUListElement>;
}

const COLOR_CLASS: Record<StepsColor, string> = {
  neutral: "step-neutral",
  primary: "step-primary",
  secondary: "step-secondary",
  accent: "step-accent",
  info: "step-info",
  success: "step-success",
  warning: "step-warning",
  error: "step-error",
};

/**
 * daisyUI steps / progress tracker. Every step at or before `current` is
 * coloured, so a single index drives the whole track. Each item can override its
 * circle marker via `marker` (defaults to the step number). Lays out
 * horizontally by default; pass `vertical` to stack. The active step carries
 * `aria-current="step"`.
 */
export function Steps({
  items,
  current = 0,
  color = "primary",
  vertical = false,
  className,
  ...rest
}: StepsProps) {
  return (
    <ul
      className={cn("steps", vertical ? "steps-vertical" : "steps-horizontal", className)}
      {...rest}
    >
      {items.map((item, index) => {
        const done = index <= current;
        return (
          <li
            key={item.id}
            className={cn("step", done && COLOR_CLASS[color])}
            data-content={item.marker}
            aria-current={index === current ? "step" : undefined}
          >
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
