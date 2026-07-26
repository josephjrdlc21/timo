import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type FileUploadFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface FileUploadFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "value"
> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Error message shown below the field (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: FileUploadFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

const SIZE_CLASS: Record<FileUploadFieldSize, string> = {
  xs: "file-input-xs",
  sm: "file-input-sm",
  md: "file-input-md",
  lg: "file-input-lg",
  xl: "file-input-xl",
};

/**
 * daisyUI file input (`type="file"`) with an optional top `label` and
 * `error` / `hint` messages. Pass `accept` / `multiple` through. Works with or
 * without react-hook-form — the ref is forwarded and extra props spread onto
 * the `<input>`, so `{...register("avatar")}` wires it up.
 */
export function FileUploadField({
  label,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  id,
  ref,
  ...rest
}: FileUploadFieldProps) {
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
      <input
        id={inputId}
        ref={ref}
        type="file"
        aria-invalid={hasError || undefined}
        className={cn(
          "file-input w-full",
          SIZE_CLASS[size],
          hasError && "file-input-error",
          className,
        )}
        {...rest}
      />
    </FieldShell>
  );
}
