import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export type EmptyStateSize = "sm" | "md" | "lg";

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon rendered above the title (e.g. a lucide icon). */
  icon?: ReactNode;
  /** Heading text. */
  title?: ReactNode;
  /** Supporting text under the title. Falls back to `children` when omitted. */
  description?: ReactNode;
  /** Supporting text (alternative to `description`). */
  children?: ReactNode;
  /** Call-to-action(s) rendered below the text, e.g. a `Button`. */
  action?: ReactNode;
  /** Padding / spacing scale. Defaults to "md". */
  size?: EmptyStateSize;
  ref?: Ref<HTMLDivElement>;
}

const SIZE_CLASS: Record<EmptyStateSize, string> = {
  sm: "gap-2 p-6",
  md: "gap-3 p-10",
  lg: "gap-4 p-16",
};

const ICON_CLASS: Record<EmptyStateSize, string> = {
  sm: "text-3xl [&_svg]:h-8 [&_svg]:w-8",
  md: "text-4xl [&_svg]:h-10 [&_svg]:w-10",
  lg: "text-5xl [&_svg]:h-12 [&_svg]:w-12",
};

/**
 * Centered empty / placeholder state inside a dashed-border panel. Stacks an
 * optional `icon`, `title`, and `description` (or `children`) with an `action`
 * slot for call-to-action buttons (pass a `Button` here). Size controls the
 * padding and icon scale. Extra props (e.g. `onClick`) forward to the root.
 */
export function EmptyState({
  icon,
  title,
  description,
  children,
  action,
  size = "md",
  className,
  ref,
  ...rest
}: EmptyStateProps) {
  const body = description ?? children;

  return (
    <div
      ref={ref}
      className={cn(
        "border-base-content/20 flex flex-col items-center justify-center rounded-box border-2 border-dashed text-center",
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {icon != null && (
        <div className={cn("text-base-content/40", ICON_CLASS[size])} aria-hidden="true">
          {icon}
        </div>
      )}
      {title != null && <h3 className="text-base-content text-lg font-semibold">{title}</h3>}
      {body != null && <p className="text-base-content/60 max-w-sm text-sm">{body}</p>}
      {action != null && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
