import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

/** daisyUI color / style variants. `ghost` and `link` are style-only. */
export type ButtonVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Button text. Falls back to `children` when omitted. */
  label?: ReactNode;
  /** daisyUI color variant. Omit for the plain neutral base button. */
  variant?: ButtonVariant;
  /** Button size. Defaults to "md". */
  size?: ButtonSize;
  /** Render the bordered outline style. */
  outline?: boolean;
  /** Render the soft (tinted background) style. */
  soft?: boolean;
  /** Full-width button. */
  block?: boolean;
  /** Extra-wide button. */
  wide?: boolean;
  /** Shows a left-aligned spinner and blocks interaction. */
  loading?: boolean;
  /** Icon rendered before the label (replaced by the spinner while loading). */
  startIcon?: ReactNode;
  /** Icon rendered after the label (hidden while loading). */
  endIcon?: ReactNode;
  /** Native button type. Defaults to "button" so it never submits by accident. */
  type?: "button" | "submit" | "reset";
  ref?: Ref<HTMLButtonElement>;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  neutral: "btn-neutral",
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  ghost: "btn-ghost",
  link: "btn-link",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

// The spinner sits a notch smaller than the button so it doesn't crowd the label.
const SPINNER_CLASS: Record<ButtonSize, string> = {
  xs: "loading-xs",
  sm: "loading-xs",
  md: "loading-sm",
  lg: "loading-md",
  xl: "loading-lg",
};

/**
 * daisyUI-styled button with a built-in loading state (left-aligned spinner),
 * disabled handling, size and color variants, and optional leading / trailing
 * icons. Pass either `label` or `children` for the text.
 */
export function Button({
  label,
  variant,
  size = "md",
  outline = false,
  soft = false,
  block = false,
  wide = false,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  className,
  children,
  type = "button",
  ref,
  ...rest
}: ButtonProps) {
  const content = label ?? children;

  return (
    <button
      ref={ref}
      type={type}
      // A loading button is inert — block clicks while work is in flight.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "btn",
        variant && VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        outline && "btn-outline",
        soft && "btn-soft",
        block && "btn-block",
        wide && "btn-wide",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className={cn("loading loading-spinner", SPINNER_CLASS[size])} aria-hidden="true" />
      ) : (
        startIcon
      )}
      {content}
      {!loading && endIcon}
    </button>
  );
}
