import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type NumberFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Icon rendered inside the field, on the left. */
  startIcon?: ReactNode;
  /** Error message shown below the field (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: NumberFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

const SIZE_CLASS: Record<NumberFieldSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

/**
 * daisyUI numeric input (`type="number"`) with an optional top `label`, a
 * leading `startIcon`, and `error` / `hint` messages. Pass `min` / `max` /
 * `step` through. Works with or without react-hook-form — the ref is forwarded
 * and extra props spread onto the `<input>`, so `{...register("qty", { valueAsNumber: true })}`
 * wires it up.
 */
export function NumberField({
  label,
  startIcon,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  id,
  ref,
  ...rest
}: NumberFieldProps) {
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
        <input
          id={inputId}
          ref={ref}
          type="number"
          aria-invalid={hasError || undefined}
          {...rest}
        />
      </label>
    </FieldShell>
  );
}
