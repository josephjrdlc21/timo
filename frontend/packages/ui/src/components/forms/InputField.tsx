import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";

export type InputFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label rendered above the field. Omit for a bare input. */
  label?: ReactNode;
  /** Icon rendered inside the field, on the left. */
  startIcon?: ReactNode;
  /**
   * Error message shown below the field. When set, the field also takes the
   * error style (`input-error`) and is flagged `aria-invalid`.
   */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: InputFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  /** Ref to the underlying `<input>` (also works with `register`'s ref). */
  ref?: Ref<HTMLInputElement>;
}

const SIZE_CLASS: Record<InputFieldSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

/**
 * daisyUI text input with an optional top `label`, an optional leading
 * `startIcon` inside the field, and `error` / `hint` messages below it.
 *
 * Works with or without react-hook-form: the ref is forwarded and all extra
 * props spread onto the `<input>`, so `<InputField {...register("email")} />`
 * wires up value, onChange, onBlur, name, and ref automatically. Without RHF,
 * use it as a normal controlled or uncontrolled input.
 */
export function InputField({
  label,
  startIcon,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  id,
  type = "text",
  ref,
  ...rest
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const hasError = error != null;

  return (
    <fieldset className={cn("fieldset", containerClassName)}>
      {label != null && (
        <label htmlFor={inputId} className="fieldset-legend">
          {label}
        </label>
      )}

      <label className={cn("input w-full", SIZE_CLASS[size], hasError && "input-error", className)}>
        {startIcon != null && (
          <span className="opacity-50 [&_svg]:h-[1em] [&_svg]:w-[1em]" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <input id={inputId} ref={ref} type={type} aria-invalid={hasError || undefined} {...rest} />
      </label>

      {message != null && <p className={cn("label", hasError && "text-error")}>{message}</p>}
    </fieldset>
  );
}
