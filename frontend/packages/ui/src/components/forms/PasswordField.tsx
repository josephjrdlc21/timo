import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type PasswordFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Icon rendered inside the field, on the left. */
  startIcon?: ReactNode;
  /** Error message shown below the field (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: PasswordFieldSize;
  /** Hide the built-in show / hide toggle button. */
  hideToggle?: boolean;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

const SIZE_CLASS: Record<PasswordFieldSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

/**
 * daisyUI password input with a built-in show / hide toggle on the right, an
 * optional top `label`, a leading `startIcon`, and `error` / `hint` messages.
 * Works with or without react-hook-form — the ref is forwarded and extra props
 * spread onto the `<input>`, so `{...register("password")}` wires it up.
 */
export function PasswordField({
  label,
  startIcon,
  error,
  hint,
  size = "md",
  hideToggle = false,
  containerClassName,
  className,
  id,
  ref,
  ...rest
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = error != null;
  const [visible, setVisible] = useState(false);

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
          type={visible ? "text" : "password"}
          aria-invalid={hasError || undefined}
          {...rest}
        />
        {!hideToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="cursor-pointer opacity-50 [&_svg]:h-[1em] [&_svg]:w-[1em]"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            tabIndex={-1}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        )}
      </label>
    </FieldShell>
  );
}
