import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export type KbdSize = "xs" | "sm" | "md" | "lg" | "xl";

interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Key text. Falls back to `children` when omitted. */
  label?: ReactNode;
  /** Kbd size. Defaults to "md". */
  size?: KbdSize;
  ref?: Ref<HTMLElement>;
}

const SIZE_CLASS: Record<KbdSize, string> = {
  xs: "kbd-xs",
  sm: "kbd-sm",
  md: "kbd-md",
  lg: "kbd-lg",
  xl: "kbd-xl",
};

/**
 * daisyUI keyboard key, rendered as a semantic `<kbd>`. Size-only; compose
 * combos from multiple instances, e.g. `<Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>`. Pass
 * either `label` or `children` for the key text.
 */
export function Kbd({ label, size = "md", className, children, ref, ...rest }: KbdProps) {
  return (
    <kbd ref={ref} className={cn("kbd", SIZE_CLASS[size], className)} {...rest}>
      {label ?? children}
    </kbd>
  );
}
