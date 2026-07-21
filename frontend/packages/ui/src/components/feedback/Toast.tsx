import { useEffect, type ReactNode } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

/** Toast kind — sets the daisyUI `alert` colour and the default icon. */
export type ToastVariant = "info" | "success" | "warning" | "error";

/** Corner the toast is anchored to. Maps to daisyUI `toast-{v} toast-{h}` classes. */
export type ToastPosition =
  "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";

interface ToastProps {
  /** Whether the toast is shown. When false, nothing is rendered. */
  open: boolean;
  /** Toast kind. Defaults to "info". */
  variant?: ToastVariant;
  /** Heading text (bold). */
  title?: ReactNode;
  /** Message body. Falls back to `children` when omitted. */
  message?: ReactNode;
  /** Message body (alternative to `message`). */
  children?: ReactNode;
  /** Corner placement. Defaults to "bottom-end". */
  position?: ToastPosition;
  /** Icon override. Defaults to a per-variant icon. */
  icon?: ReactNode;
  /** Extra action (e.g. an "Undo" button) rendered before the close button. */
  action?: ReactNode;
  /** Dismiss handler. When provided, a close (X) button is shown. */
  onClose?: () => void;
  /** Auto-dismiss after this many ms. Requires `onClose`. Omit to persist. */
  duration?: number;
  /** Extra classes merged onto the `alert`. */
  className?: string;
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

const VARIANT_ICON: Record<ToastVariant, ReactNode> = {
  info: <Info className="h-5 w-5" aria-hidden="true" />,
  success: <CircleCheck className="h-5 w-5" aria-hidden="true" />,
  warning: <TriangleAlert className="h-5 w-5" aria-hidden="true" />,
  error: <CircleX className="h-5 w-5" aria-hidden="true" />,
};

const POSITION_CLASS: Record<ToastPosition, string> = {
  "top-start": "toast-top toast-start",
  "top-center": "toast-top toast-center",
  "top-end": "toast-top toast-end",
  "bottom-start": "toast-bottom toast-start",
  "bottom-center": "toast-bottom toast-center",
  "bottom-end": "toast-bottom toast-end",
};

/**
 * daisyUI toast: a corner-anchored `alert` that always carries a variant icon
 * (info / success / warning / error). Controlled via `open`. Provide `onClose`
 * for a dismiss button, and optionally `duration` to auto-dismiss. `warning`
 * and `error` announce assertively; `info` and `success` politely.
 */
export function Toast({
  open,
  variant = "info",
  title,
  message,
  children,
  position = "bottom-end",
  icon,
  action,
  onClose,
  duration,
  className,
}: ToastProps) {
  // Auto-dismiss: (re)start the timer whenever the toast (re)opens.
  useEffect(() => {
    if (!open || !duration || !onClose) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  const body = message ?? children;
  const assertive = variant === "warning" || variant === "error";

  return (
    <div className={cn("toast", POSITION_CLASS[position])}>
      <div
        role="alert"
        aria-live={assertive ? "assertive" : "polite"}
        className={cn("alert", VARIANT_CLASS[variant], className)}
      >
        {icon ?? VARIANT_ICON[variant]}
        <div>
          {title != null && <h3 className="font-semibold">{title}</h3>}
          {body != null && <div className="text-sm">{body}</div>}
        </div>
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
    </div>
  );
}
