import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

/** daisyUI color variants. `ghost` is style-only. */
export type BadgeVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost";

export type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge text. Falls back to `children` when omitted. */
  label?: ReactNode;
  /** daisyUI color variant. Omit for the plain neutral base badge. */
  variant?: BadgeVariant;
  /** Badge size. Defaults to "md". */
  size?: BadgeSize;
  /** Render the bordered outline style. */
  outline?: boolean;
  /** Render the soft (tinted background) style. */
  soft?: boolean;
  /** Render the dashed-border style. */
  dash?: boolean;
  /** Icon rendered to the left of the label. */
  icon?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  ghost: "badge-ghost",
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  xs: "badge-xs",
  sm: "badge-sm",
  md: "badge-md",
  lg: "badge-lg",
  xl: "badge-xl",
};

/**
 * daisyUI-styled badge with size and color variants, optional outline / soft /
 * dash styles, and an optional leading icon. Pass either `label` or `children`
 * for the text. The daisyUI `.badge` is already an inline-flex row with a gap,
 * so the icon and text align without extra wrappers.
 */
export function Badge({
  label,
  variant,
  size = "md",
  outline = false,
  soft = false,
  dash = false,
  icon,
  className,
  children,
  ref,
  ...rest
}: BadgeProps) {
  const content = label ?? children;

  return (
    <span
      ref={ref}
      className={cn(
        "badge",
        variant && VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        outline && "badge-outline",
        soft && "badge-soft",
        dash && "badge-dash",
        className,
      )}
      {...rest}
    >
      {icon}
      {content}
    </span>
  );
}
