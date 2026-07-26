import type { ReactNode, Ref, SelectHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type SelectFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SelectOption {
  /** Visible option text. */
  label: ReactNode;
  /** Submitted value. */
  value: string | number;
  /** Render the option disabled. */
  disabled?: boolean;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Icon rendered inside the field, on the left. */
  startIcon?: ReactNode;
  /** Options to render. Alternatively, pass `<option>`s as `children`. */
  options?: SelectOption[];
  /** Disabled placeholder shown first (with an empty value). */
  placeholder?: string;
  /** Error message shown below the field (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: SelectFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLSelectElement>;
}

const SIZE_CLASS: Record<SelectFieldSize, string> = {
  xs: "select-xs",
  sm: "select-sm",
  md: "select-md",
  lg: "select-lg",
  xl: "select-xl",
};

/**
 * daisyUI select with an optional top `label`, a leading `startIcon`, a
 * disabled `placeholder`, and `error` / `hint` messages. Provide choices via
 * the `options` array or as `<option>` `children`. Works with or without
 * react-hook-form — the ref is forwarded and extra props spread onto the
 * `<select>`, so `{...register("country")}` wires it up.
 */
export function SelectField({
  label,
  startIcon,
  options,
  placeholder,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  id,
  ref,
  children,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hasError = error != null;

  return (
    <FieldShell
      label={label}
      htmlFor={selectId}
      error={error}
      hint={hint}
      containerClassName={containerClassName}
    >
      <label
        className={cn("select w-full", SIZE_CLASS[size], hasError && "select-error", className)}
      >
        {startIcon != null && (
          <span className="opacity-50 [&_svg]:h-[1em] [&_svg]:w-[1em]" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <select id={selectId} ref={ref} aria-invalid={hasError || undefined} {...rest}>
          {placeholder != null && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((option) => (
            <option key={String(option.value)} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
      </label>
    </FieldShell>
  );
}
