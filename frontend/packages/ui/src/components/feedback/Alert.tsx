import type { HTMLAttributes, ReactNode, Ref } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

/** daisyUI colour variant. Omit for the plain neutral base alert. */
export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** daisyUI colour variant. Omit for the neutral base alert. */
  variant?: AlertVariant;
  /** Heading text (bold). */
  title?: ReactNode;
  /** Message body. Falls back to `children` when omitted. */
  message?: ReactNode;
  /** Message body (alternative to `message`). */
  children?: ReactNode;
  /**
   * Leading icon. Omit to use the variant's default icon; pass `null` to render
   * none. The neutral base has no default icon.
   */
  icon?: ReactNode;
  /** Extra action (e.g. buttons) rendered after the content. */
  action?: ReactNode;
  /** Dismiss handler. When provided, a close (X) button is shown. */
  onClose?: () => void;
  /** Render the soft (tinted background) style. */
  soft?: boolean;
  /** Render the bordered outline style. */
  outline?: boolean;
  /** Render the dashed-border style. */
  dash?: boolean;
  /** Stack the icon, content, and actions vertically (`alert-vertical`). */
  vertical?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const VARIANT_CLASS: Record<AlertVariant, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

const VARIANT_ICON: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-5 w-5" aria-hidden="true" />,
  success: <CircleCheck className="h-5 w-5" aria-hidden="true" />,
  warning: <TriangleAlert className="h-5 w-5" aria-hidden="true" />,
  error: <CircleX className="h-5 w-5" aria-hidden="true" />,
};

/**
 * daisyUI alert with all colour variants (info / success / warning / error, or
 * a neutral base) and the soft / outline / dash styles. Each colour variant
 * carries a default icon — omit `icon` to use it, or pass `null` to hide it.
 * Provide `onClose` for a dismiss button and `action` for trailing buttons.
 * `warning` and `error` announce assertively; the rest politely.
 */
export function Alert({
  variant,
  title,
  message,
  children,
  icon,
  action,
  onClose,
  soft = false,
  outline = false,
  dash = false,
  vertical = false,
  className,
  ref,
  ...rest
}: AlertProps) {
  const body = message ?? children;
  // `icon` unset → variant default; explicit `null` hides it.
  const resolvedIcon = icon !== undefined ? icon : variant && VARIANT_ICON[variant];
  const assertive = variant === "warning" || variant === "error";

  return (
    <div
      ref={ref}
      role="alert"
      aria-live={assertive ? "assertive" : "polite"}
      className={cn(
        "alert",
        variant && VARIANT_CLASS[variant],
        soft && "alert-soft",
        outline && "alert-outline",
        dash && "alert-dash",
        vertical && "alert-vertical",
        className,
      )}
      {...rest}
    >
      {resolvedIcon}
      {(title != null || body != null) && (
        <div>
          {title != null && <h3 className="font-semibold">{title}</h3>}
          {body != null && <div className={cn(title != null && "text-sm")}>{body}</div>}
        </div>
      )}
      {action}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
