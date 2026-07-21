import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export type CardSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Header text, rendered as the daisyUI `card-title`. Ignored when `titleContent` is set. */
  title?: ReactNode;
  /** Optional JSX that fully replaces the default title (overrides `title`). */
  titleContent?: ReactNode;
  /** Sub-header text under the title. Ignored when `subtitleContent` is set. */
  subtitle?: ReactNode;
  /** Optional JSX that fully replaces the default subtitle (overrides `subtitle`). */
  subtitleContent?: ReactNode;
  /** Footer actions (e.g. buttons), rendered in a daisyUI `card-actions` row. */
  footer?: ReactNode;
  /** Media rendered in a `<figure>` above the body (e.g. an `<img>`). */
  image?: ReactNode;
  /** Overlay the body on top of a full-bleed `image` (daisyUI `image-full`). */
  imageFull?: boolean;
  /** Card size. Defaults to "md". */
  size?: CardSize;
  /** Render the bordered style (`card-border`). */
  bordered?: boolean;
  /** Render the dashed-border style (`card-dash`). */
  dash?: boolean;
  /** Lay the figure and body side by side (`card-side`). */
  side?: boolean;
  /** Card body. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const SIZE_CLASS: Record<CardSize, string> = {
  xs: "card-xs",
  sm: "card-sm",
  md: "card-md",
  lg: "card-lg",
  xl: "card-xl",
};

/**
 * daisyUI card. Handles content the same way as `Modal`: `title` / `subtitle`
 * each take plain text or a JSX override (`titleContent` / `subtitleContent`),
 * and footer actions are passed as JSX via `footer` (rendered in `card-actions`).
 * An optional `image` renders in a leading `<figure>`. Size, border / dash /
 * side styles, and `image-full` map straight onto daisyUI classes. Extra props
 * (e.g. `onClick`) forward to the root element.
 */
export function Card({
  title,
  titleContent,
  subtitle,
  subtitleContent,
  footer,
  image,
  imageFull = false,
  size = "md",
  bordered = false,
  dash = false,
  side = false,
  className,
  children,
  ref,
  ...rest
}: CardProps) {
  const hasHeader =
    titleContent != null || title != null || subtitleContent != null || subtitle != null;

  return (
    <div
      ref={ref}
      className={cn(
        "card bg-base-100 w-full shadow-sm",
        SIZE_CLASS[size],
        bordered && "card-border",
        dash && "card-dash",
        side && "card-side",
        imageFull && "image-full",
        className,
      )}
      {...rest}
    >
      {image && <figure>{image}</figure>}

      <div className="card-body">
        {hasHeader && (
          <header>
            {titleContent ?? (title != null && <h2 className="card-title">{title}</h2>)}
            {subtitleContent ??
              (subtitle != null && <p className="text-base-content/70 text-sm">{subtitle}</p>)}
          </header>
        )}

        {children}

        {footer && <div className="card-actions justify-end">{footer}</div>}
      </div>
    </div>
  );
}
