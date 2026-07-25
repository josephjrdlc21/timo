import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type RangeFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface RangeFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Error message shown below the field. */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: RangeFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

// Fixed to the primary colour (no colour variant), matching Checkbox / Toggle.
const SIZE_CLASS: Record<RangeFieldSize, string> = {
  xs: "range-xs",
  sm: "range-sm",
  md: "range-md",
  lg: "range-lg",
  xl: "range-xl",
};

/**
 * daisyUI range slider (`type="range"`), fixed to the primary colour, with an
 * optional top `label` and `error` / `hint` messages. Pass `min` / `max` /
 * `step` through. Works with or without react-hook-form — the ref is forwarded
 * and extra props spread onto the `<input>`.
 */
export function RangeField({
  label,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  id,
  ref,
  ...rest
}: RangeFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      containerClassName={containerClassName}
    >
      <input
        id={inputId}
        ref={ref}
        type="range"
        className={cn("range range-primary w-full", SIZE_CLASS[size], className)}
        {...rest}
      />
    </FieldShell>
  );
}
