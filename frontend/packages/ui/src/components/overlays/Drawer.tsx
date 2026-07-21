import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

/** Edge the drawer slides in from. Maps to daisyUI `modal-{start|end|top|bottom}`. */
export type DrawerSide = "left" | "right" | "top" | "bottom";

/**
 * Panel extent along its short axis: width for left/right drawers, height for
 * top/bottom drawers.
 */
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

interface DrawerProps {
  /** Whether the drawer is open. Drives the native `<dialog>` show/close. */
  open: boolean;
  /** Called on every close path: the X button, Escape, or a backdrop click. */
  onClose: () => void;
  /** Header text. Ignored when `titleContent` is provided. */
  title?: ReactNode;
  /** Optional JSX that fully replaces the default header (overrides `title`). */
  titleContent?: ReactNode;
  /** Sub-header text under the title. Ignored when `subtitleContent` is provided. */
  subtitle?: ReactNode;
  /** Optional JSX that fully replaces the default subtitle (overrides `subtitle`). */
  subtitleContent?: ReactNode;
  /** Footer actions (e.g. buttons), pinned to the bottom in a `modal-action` row. */
  footer?: ReactNode;
  /** Drawer body. */
  children: ReactNode;
  /** Edge to anchor to. Defaults to "right". */
  side?: DrawerSide;
  /** Panel width (left/right) or height (top/bottom). Defaults to "md". */
  size?: DrawerSize;
  /** Show the top-right close (X) button. Defaults to true. */
  showCloseButton?: boolean;
  /** Allow closing by clicking the backdrop. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Extra classes merged onto the panel (`modal-box`). */
  className?: string;
}

const SIDE_CLASS: Record<DrawerSide, string> = {
  left: "modal-start",
  right: "modal-end",
  top: "modal-top",
  bottom: "modal-bottom",
};

// Left/right drawers are full-height, so size drives their width.
const WIDTH_CLASS: Record<DrawerSize, string> = {
  sm: "w-72",
  md: "w-96",
  lg: "w-[32rem]",
  xl: "w-[42rem]",
  full: "w-screen",
};

// Top/bottom drawers are full-width, so size drives their height.
const HEIGHT_CLASS: Record<DrawerSize, string> = {
  sm: "h-1/4",
  md: "h-1/3",
  lg: "h-1/2",
  xl: "h-2/3",
  full: "h-screen",
};

/**
 * daisyUI slide-in drawer, built on the native `<dialog>` element exactly like
 * `Modal` — so Escape-to-close, focus trapping, an inert background, and the
 * slide/backdrop transitions all come from daisyUI's `.modal` for free. The
 * controlled `open` prop drives `showModal()` / `close()`, and the dialog's
 * native `close` event funnels every close path (X, Escape, backdrop) through
 * `onClose`.
 *
 * `side` anchors the panel to an edge; `size` sets its width (left/right) or
 * height (top/bottom). Header and subtitle each accept text or a JSX override,
 * and footer actions are passed as JSX via `footer`.
 */
export function Drawer({
  open,
  onClose,
  title,
  titleContent,
  subtitle,
  subtitleContent,
  footer,
  children,
  side = "right",
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  className,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const descriptionId = useId();

  // Sync the controlled `open` prop with the native dialog. `showModal()` throws
  // if called on an already-open dialog, so guard both directions.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const isHorizontal = side === "left" || side === "right";
  const hasHeader =
    titleContent != null || title != null || subtitleContent != null || subtitle != null;
  // The ids live on the default text elements only, so don't reference them
  // when the caller supplies a JSX override.
  const labelledBy = titleContent == null && title != null ? headingId : undefined;
  const describedBy = subtitleContent == null && subtitle != null ? descriptionId : undefined;

  return (
    <dialog
      ref={dialogRef}
      className={cn("modal", SIDE_CLASS[side])}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      // Every close path (Escape, backdrop, X form) fires the native close event.
      onClose={onClose}
    >
      <div
        className={cn(
          "modal-box flex max-w-none flex-col",
          isHorizontal ? WIDTH_CLASS[size] : HEIGHT_CLASS[size],
          className,
        )}
      >
        {showCloseButton && (
          <form method="dialog">
            <button
              type="submit"
              className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        )}

        {hasHeader && (
          <header className="mb-4 pr-8">
            {titleContent ??
              (title != null && (
                <h2 id={headingId} className="text-lg font-semibold">
                  {title}
                </h2>
              ))}
            {subtitleContent ??
              (subtitle != null && (
                <p id={descriptionId} className="text-base-content/70 mt-1 text-sm">
                  {subtitle}
                </p>
              ))}
          </header>
        )}

        {/* Body takes the remaining height and scrolls, keeping the footer pinned. */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="modal-action">{footer}</div>}
      </div>

      {closeOnBackdrop && (
        <form method="dialog" className="modal-backdrop">
          <button type="submit" aria-label="Close">
            close
          </button>
        </form>
      )}
    </dialog>
  );
}
