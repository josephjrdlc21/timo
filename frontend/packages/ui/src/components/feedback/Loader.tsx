import type { HTMLAttributes, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  /** Loader size. Defaults to "md". */
  size?: LoaderSize;
  /** Accessible label announced by screen readers. Defaults to "Loading". */
  label?: string;
  ref?: Ref<HTMLSpanElement>;
}

const SIZE_CLASS: Record<LoaderSize, string> = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
  xl: "loading-xl",
};

/**
 * daisyUI spinner loader. Size-only by design — the animation is always
 * `loading-spinner`. Colour it with a text utility on `className` (e.g.
 * `text-primary`); it inherits the current text colour otherwise. Exposes
 * `role="status"` with an accessible label for screen readers.
 */
export function Loader({ size = "md", label = "Loading", className, ref, ...rest }: LoaderProps) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn("loading loading-spinner", SIZE_CLASS[size], className)}
      {...rest}
    />
  );
}
