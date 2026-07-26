import type { ReactNode, Ref, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type TextAreaFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Error message shown below the field (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the field when there is no `error`. */
  hint?: ReactNode;
  /** Field size. Defaults to "md". */
  size?: TextAreaFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

const SIZE_CLASS: Record<TextAreaFieldSize, string> = {
  xs: "textarea-xs",
  sm: "textarea-sm",
  md: "textarea-md",
  lg: "textarea-lg",
  xl: "textarea-xl",
};

/**
 * daisyUI multi-line textarea with an optional top `label` and `error` / `hint`
 * messages. Works with or without react-hook-form — the ref is forwarded and
 * extra props spread onto the `<textarea>`, so `{...register("bio")}` wires it up.
 */
export function TextAreaField({
  label,
  error,
  hint,
  size = "md",
  containerClassName,
  className,
  id,
  ref,
  ...rest
}: TextAreaFieldProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hasError = error != null;

  return (
    <FieldShell
      label={label}
      htmlFor={textareaId}
      error={error}
      hint={hint}
      containerClassName={containerClassName}
    >
      <textarea
        id={textareaId}
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn("textarea w-full", SIZE_CLASS[size], hasError && "textarea-error", className)}
        {...rest}
      />
    </FieldShell>
  );
}
