import type { HTMLAttributes, Ref } from "react";
import { cn } from "../../lib/utils/cn";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Convenience width. A number is treated as px; a string is used as-is. Prefer a `w-*` class for static sizes. */
  width?: number | string;
  /** Convenience height. A number is treated as px; a string is used as-is. Prefer an `h-*` class for static sizes. */
  height?: number | string;
  /** Render a circle (for avatar / icon placeholders) instead of the default rounded box. */
  circle?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** Number → px, string → passthrough. */
const toDim = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : value;

/**
 * daisyUI shimmer skeleton for loading placeholders. Size it with `w-*` / `h-*`
 * classes, or the convenience `width` / `height` props for dynamic sizes. Pass
 * `circle` for round avatar / icon placeholders. It respects
 * `prefers-reduced-motion` (the shimmer is disabled) via daisyUI. Decorative by
 * default — wrap it in an `aria-busy` region so assistive tech announces the
 * loading state.
 */
export function Skeleton({
  width,
  height,
  circle = false,
  className,
  style,
  ref,
  ...rest
}: SkeletonProps) {
  return (
    <div
      ref={ref}
      className={cn("skeleton", circle && "rounded-full", className)}
      style={{ width: toDim(width), height: toDim(height), ...style }}
      {...rest}
    />
  );
}
