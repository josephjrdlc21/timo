import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type DateFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface DateFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Icon rendered inside the field, on the left. */
  startIcon?: ReactNode;
  /** Error message shown below the field (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /**
   * Native date-picker granularity. Defaults to "date". Use "datetime-local",
   * "month", "week", or "time" for the other native pickers.
   */
  type?: "date" | "datetime-local" | "month" | "week" | "time";
  /** Field size. Defaults to "md". */
  size?: DateFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

const SIZE_CLASS: Record<DateFieldSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

/**
 * daisyUI date input (native `type="date"`, or `datetime-local` / `month` /
 * `week` / `time`) with an optional top `label`, a leading `startIcon`, and
 * `error` / `hint` messages. Works with or without react-hook-form — the ref is
 * forwarded and extra props spread onto the `<input>`.
 */
export function DateField({
  label,
  startIcon,
  error,
  hint,
  type = "date",
  size = "md",
  containerClassName,
  className,
  id,
  ref,
  ...rest
}: DateFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = error != null;

  return (
    <FieldShell
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      containerClassName={containerClassName}
    >
      <label className={cn("input w-full", SIZE_CLASS[size], hasError && "input-error", className)}>
        {startIcon != null && (
          <span className="opacity-50 [&_svg]:h-[1em] [&_svg]:w-[1em]" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <input id={inputId} ref={ref} type={type} aria-invalid={hasError || undefined} {...rest} />
      </label>
    </FieldShell>
  );
}
