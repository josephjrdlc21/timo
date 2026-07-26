import type { ClipboardEvent, KeyboardEvent, ReactNode, Ref } from "react";
import { useId, useRef, useState } from "react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

export type OTPFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface OTPFieldProps {
  /** Label rendered above the boxes. */
  label?: ReactNode;
  /** Number of boxes / characters. Defaults to 6. */
  length?: number;
  /** Controlled value (the joined code). Falls back to internal state when omitted. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Fires with the full joined code whenever it changes. */
  onChange?: (value: string) => void;
  /** Fires once every box is filled. */
  onComplete?: (value: string) => void;
  /** Restrict input. Defaults to "numeric" (digits only). */
  mode?: "numeric" | "alphanumeric";
  /** Error message shown below the boxes (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the boxes when there is no `error`. */
  hint?: ReactNode;
  /** Disable all boxes. */
  disabled?: boolean;
  /** Autofocus the first box on mount. */
  autoFocus?: boolean;
  /** Box size. Defaults to "md". */
  size?: OTPFieldSize;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  /** Extra classes for each box. */
  className?: string;
  /** Ref to the first box. */
  ref?: Ref<HTMLInputElement>;
}

const SIZE_CLASS: Record<OTPFieldSize, string> = {
  xs: "input-xs w-8",
  sm: "input-sm w-10",
  md: "input-md w-12",
  lg: "input-lg w-14",
  xl: "input-xl w-16",
};

const PATTERN: Record<NonNullable<OTPFieldProps["mode"]>, RegExp> = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
};

/**
 * Segmented one-time-password input: a row of single-character boxes with
 * auto-advance, backspace-to-previous, arrow-key navigation, and paste-to-fill.
 *
 * It's a controlled component (`value` + `onChange` giving the joined code), so
 * with react-hook-form wrap it in a `Controller`; without RHF, drive it from
 * state or leave it uncontrolled with `defaultValue`.
 */
export function OTPField({
  label,
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  mode = "numeric",
  error,
  hint,
  disabled = false,
  autoFocus = false,
  size = "md",
  containerClassName,
  className,
  ref,
}: OTPFieldProps) {
  const baseId = useId();
  const hasError = error != null;
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  // Controlled when `value` is provided; otherwise track internally.
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const chars = Array.from({ length }, (_, i) => current[i] ?? "");

  const commit = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  // Forward the first box to the external ref (supports callback & object refs).
  const assignFirstRef = (el: HTMLInputElement | null) => {
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const focusBox = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    boxes.current[clamped]?.focus();
    boxes.current[clamped]?.select();
  };

  const setChar = (index: number, char: string) => {
    const nextChars = [...chars];
    nextChars[index] = char;
    // Trim trailing empties so the joined value reflects only filled boxes.
    commit(nextChars.join("").replace(/\s+$/g, ""));
  };

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(PATTERN[mode], "");
    if (cleaned === "") {
      setChar(index, "");
      return;
    }
    // Keep only the last typed character for this box.
    setChar(index, cleaned[cleaned.length - 1]);
    if (index < length - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (chars[index] === "" && index > 0) {
        event.preventDefault();
        setChar(index - 1, "");
        focusBox(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(PATTERN[mode], "");
    if (pasted === "") return;
    const nextChars = [...chars];
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      nextChars[index + i] = pasted[i];
    }
    commit(nextChars.join("").replace(/\s+$/g, ""));
    focusBox(index + pasted.length);
  };

  return (
    <FieldShell label={label} error={error} hint={hint} containerClassName={containerClassName}>
      <div className="flex gap-2">
        {chars.map((char, index) => (
          <input
            // Positional boxes with no stable id of their own.
            key={index}
            ref={(el) => {
              boxes.current[index] = el;
              if (index === 0) assignFirstRef(el);
            }}
            id={index === 0 ? baseId : undefined}
            type="text"
            inputMode={mode === "numeric" ? "numeric" : "text"}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={char}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={hasError || undefined}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            onFocus={(e) => e.target.select()}
            className={cn(
              "input text-center font-mono",
              SIZE_CLASS[size],
              hasError && "input-error",
              className,
            )}
          />
        ))}
      </div>
    </FieldShell>
  );
}
