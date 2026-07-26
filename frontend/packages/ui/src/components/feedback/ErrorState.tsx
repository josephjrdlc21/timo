import type { HTMLAttributes, ReactNode, Ref } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "../../lib/utils/cn";

export type ErrorStateSize = "sm" | "md" | "lg";

interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Icon rendered above the title. Omit to use the default warning triangle;
   * pass `null` to render none.
   */
  icon?: ReactNode;
  /** Heading text. Defaults to "Something went wrong". */
  title?: ReactNode;
  /** Supporting text under the title. Falls back to `children` when omitted. */
  description?: ReactNode;
  /** Supporting text (alternative to `description`). */
  children?: ReactNode;
  /** Call-to-action(s) rendered below the text, e.g. a retry `Button`. */
  action?: ReactNode;
  /** Padding / spacing scale. Defaults to "md". */
  size?: ErrorStateSize;
  ref?: Ref<HTMLDivElement>;
}

const SIZE_CLASS: Record<ErrorStateSize, string> = {
  sm: "gap-2 p-6",
  md: "gap-3 p-10",
  lg: "gap-4 p-16",
};

const ICON_CLASS: Record<ErrorStateSize, string> = {
  sm: "[&_svg]:h-8 [&_svg]:w-8",
  md: "[&_svg]:h-10 [&_svg]:w-10",
  lg: "[&_svg]:h-12 [&_svg]:w-12",
};

/**
 * Centered error state inside a dashed error-tinted panel. Mirrors `EmptyState`
 * but signals failure: an `icon` (default warning triangle, or `null` to hide),
 * `title`, and `description` (or `children`), plus an `action` slot for a retry
 * `Button`. Size controls the padding and icon scale. Announces politely to
 * assistive tech. Extra props (e.g. `onClick`) forward to the root.
 */
export function ErrorState({
  icon,
  title = "Something went wrong",
  description,
  children,
  action,
  size = "md",
  className,
  ref,
  ...rest
}: ErrorStateProps) {
  const body = description ?? children;
  // `icon` unset → default triangle; explicit `null` hides it.
  const resolvedIcon =
    icon !== undefined ? icon : <TriangleAlert className="h-10 w-10" aria-hidden="true" />;

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className={cn(
        "border-error/40 flex flex-col items-center justify-center rounded-box border-2 border-dashed text-center",
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {resolvedIcon != null && (
        <div className={cn("text-error/70", ICON_CLASS[size])} aria-hidden="true">
          {resolvedIcon}
        </div>
      )}
      {title != null && <h3 className="text-base-content text-lg font-semibold">{title}</h3>}
      {body != null && <p className="text-base-content/60 max-w-sm text-sm">{body}</p>}
      {action != null && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
