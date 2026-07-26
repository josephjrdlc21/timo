import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export type ToggleFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ToggleFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Text rendered beside the toggle. */
  label?: ReactNode;
  /** Error message shown below the control (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the control when there is no `error`. */
  hint?: ReactNode;
  /** Control size. Defaults to "md". */
  size?: ToggleFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

// Fixed to the primary colour (no colour variant).
const SIZE_CLASS: Record<ToggleFieldSize, string> = {
  xs: "toggle-xs",
  sm: "toggle-sm",
  md: "toggle-md",
  lg: "toggle-lg",
  xl: "toggle-xl",
};

/**
 * daisyUI toggle switch (fixed to the primary colour) with an inline `label`
 * and optional `error` / `hint` messages below. Renders a checkbox under the
 * hood. Works with or without react-hook-form — the ref is forwarded and extra
 * props spread onto the `<input>`, so `{...register("notifications")}` wires it up.
 */
export function ToggleField({
  label,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  ref,
  ...rest
}: ToggleFieldProps) {
  const message = error ?? hint;
  const hasError = error != null;

  return (
    <fieldset className={cn("fieldset", containerClassName)}>
      <label className="label cursor-pointer justify-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          aria-invalid={hasError || undefined}
          className={cn(
            "toggle toggle-primary",
            SIZE_CLASS[size],
            hasError && "toggle-error",
            className,
          )}
          {...rest}
        />
        {label != null && <span className="text-base-content">{label}</span>}
      </label>
      {message != null && <p className={cn("label", hasError && "text-error")}>{message}</p>}
    </fieldset>
  );
}
