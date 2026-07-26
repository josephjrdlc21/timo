import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

/** Width of the `modal-box`. daisyUI has no built-in size scale, so we map to max-widths. */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

/** Vertical placement of the dialog. Maps to daisyUI `modal-{position}` classes. */
export type ModalAlign = "top" | "middle" | "bottom";

interface ModalProps {
  /** Whether the dialog is open. Drives the native `<dialog>` show/close. */
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
  /** Footer actions (e.g. buttons), rendered in a daisyUI `modal-action` row. */
  footer?: ReactNode;
  /** Modal body. */
  children: ReactNode;
  /** Box width. Defaults to "md". */
  size?: ModalSize;
  /** Vertical placement. Defaults to "middle". */
  align?: ModalAlign;
  /** Show the top-right close (X) button. Defaults to true. */
  showCloseButton?: boolean;
  /** Allow closing by clicking the backdrop. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Extra classes merged onto the `modal-box`. */
  className?: string;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "w-11/12 max-w-5xl",
};

const ALIGN_CLASS: Record<ModalAlign, string> = {
  top: "modal-top",
  middle: "modal-middle",
  bottom: "modal-bottom",
};

/**
 * daisyUI modal built on the native `<dialog>` element, so Escape-to-close,
 * focus trapping, and an inert background come from the browser for free. The
 * controlled `open` prop drives `showModal()` / `close()`, and the dialog's
 * native `close` event funnels every close path (X, Escape, backdrop) through
 * `onClose`.
 *
 * Header and subtitle each accept either plain text (`title` / `subtitle`) or a
 * JSX override (`titleContent` / `subtitleContent`); footer actions are passed
 * as JSX via `footer`.
 */
export function Modal({
  open,
  onClose,
  title,
  titleContent,
  subtitle,
  subtitleContent,
  footer,
  children,
  size = "md",
  align = "middle",
  showCloseButton = true,
  closeOnBackdrop = true,
  className,
}: ModalProps) {
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

  const hasHeader =
    titleContent != null || title != null || subtitleContent != null || subtitle != null;
  // The ids live on the default text elements only, so don't reference them
  // when the caller supplies a JSX override.
  const labelledBy = titleContent == null && title != null ? headingId : undefined;
  const describedBy = subtitleContent == null && subtitle != null ? descriptionId : undefined;

  return (
    <dialog
      ref={dialogRef}
      className={cn("modal", ALIGN_CLASS[align])}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      // Every close path (Escape, backdrop, X form) fires the native close event.
      onClose={onClose}
    >
      <div className={cn("modal-box", SIZE_CLASS[size], className)}>
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

        <div>{children}</div>

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
