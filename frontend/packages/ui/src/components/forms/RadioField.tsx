import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export type RadioFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface RadioOption {
  /** Text rendered beside the radio. */
  label: ReactNode;
  /** Submitted value. */
  value: string | number;
  /** Render this option disabled. */
  disabled?: boolean;
}

interface RadioFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Group label rendered above the options. */
  label?: ReactNode;
  /** The radio options. */
  options: RadioOption[];
  /** Error message shown below the group (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the group when there is no `error`. */
  hint?: ReactNode;
  /** Lay the options out in a row instead of stacked. */
  inline?: boolean;
  /** Control size. Defaults to "md". */
  size?: RadioFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

// Fixed to the primary colour (no colour variant).
const SIZE_CLASS: Record<RadioFieldSize, string> = {
  xs: "radio-xs",
  sm: "radio-sm",
  md: "radio-md",
  lg: "radio-lg",
  xl: "radio-xl",
};

/**
 * daisyUI radio group (fixed to the primary colour) with a group `label`, an
 * `options` array, and optional `error` / `hint` messages. Works with or
 * without react-hook-form — the ref and shared props (`name`, `onChange`,
 * `onBlur`) spread onto every radio, so `{...register("plan")}` wires up the
 * whole group; the per-option `value` is set for you.
 */
export function RadioField({
  label,
  options,
  error,
  hint,
  inline = false,
  size = "md",
  containerClassName,
  className,
  ref,
  ...rest
}: RadioFieldProps) {
  const message = error ?? hint;
  const hasError = error != null;

  return (
    <fieldset className={cn("fieldset", containerClassName)}>
      {label != null && <legend className="fieldset-legend">{label}</legend>}
      <div className={cn("flex gap-3", inline ? "flex-row flex-wrap items-center" : "flex-col")}>
        {options.map((option) => (
          <label key={String(option.value)} className="label cursor-pointer justify-start gap-3">
            <input
              ref={ref}
              type="radio"
              {...rest}
              value={option.value}
              disabled={option.disabled}
              aria-invalid={hasError || undefined}
              className={cn(
                "radio radio-primary",
                SIZE_CLASS[size],
                hasError && "radio-error",
                className,
              )}
            />
            <span className="text-base-content">{option.label}</span>
          </label>
        ))}
      </div>
      {message != null && <p className={cn("label", hasError && "text-error")}>{message}</p>}
    </fieldset>
  );
}
