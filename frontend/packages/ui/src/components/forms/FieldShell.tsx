import type { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

interface FieldShellProps {
  /** Label rendered above the control. */
  label?: ReactNode;
  /** `id` of the control the label points at. */
  htmlFor?: string;
  /** Error message (also colors the message red). */
  error?: ReactNode;
  /** Helper text shown when there is no `error`. */
  hint?: ReactNode;
  /** Classes for the outer `fieldset`. */
  containerClassName?: string;
  /** The control itself. */
  children: ReactNode;
}

/**
 * Shared layout shell for the forms components: an optional top `label`, the
 * control, and an `error` / `hint` message below. Internal to `@timo/ui` — not
 * exported from the package barrel.
 */
export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  containerClassName,
  children,
}: FieldShellProps) {
  const message = error ?? hint;

  return (
    <fieldset className={cn("fieldset", containerClassName)}>
      {label != null && (
        <label htmlFor={htmlFor} className="fieldset-legend">
          {label}
        </label>
      )}
      {children}
      {message != null && <p className={cn("label", error != null && "text-error")}>{message}</p>}
    </fieldset>
  );
}
