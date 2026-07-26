import { useEffect, useRef, useState, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "../../lib/utils/cn";
import { Button } from "../actions/Button";
import { Modal, type ModalSize } from "./Modal";

/** `confirm` is the neutral/primary flow; `danger` is the destructive (delete) flow. */
export type ConfirmModalVariant = "confirm" | "danger";

interface ConfirmModalProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog is dismissed (Cancel, X, Escape, or backdrop). */
  onClose: () => void;
  /**
   * Called when the confirm button is pressed. May return a promise — while it's
   * pending, the confirm button shows a spinner and the dialog can't be closed.
   */
  onConfirm: () => void | Promise<void>;
  /** Heading. Defaults to a variant-appropriate question. */
  title?: ReactNode;
  /** Body text. Falls back to `children` when omitted. */
  description?: ReactNode;
  /** Body content (alternative to `description`). */
  children?: ReactNode;
  /** Confirm button text. Defaults to "Delete" for `danger`, else "Confirm". */
  confirmLabel?: ReactNode;
  /** Cancel button text. Defaults to "Cancel". */
  cancelLabel?: ReactNode;
  /** Visual + semantic style. Defaults to "confirm". */
  variant?: ConfirmModalVariant;
  /**
   * Leading icon shown beside the body. Omit to use the variant's default
   * (a warning triangle for `danger`, none for `confirm`); pass `null` to hide.
   */
  icon?: ReactNode;
  /** Externally-controlled busy state (in addition to a pending `onConfirm`). */
  loading?: boolean;
  /** Box width. Defaults to "sm". */
  size?: ModalSize;
}

const DEFAULT_TITLE: Record<ConfirmModalVariant, string> = {
  confirm: "Are you sure?",
  danger: "Delete item?",
};

const DEFAULT_CONFIRM_LABEL: Record<ConfirmModalVariant, string> = {
  confirm: "Confirm",
  danger: "Delete",
};

/**
 * Confirmation dialog built on `Modal`, with a `confirm` and a destructive
 * `danger` (delete) variant. Handles the confirm/cancel button pair, sensible
 * variant defaults (title, confirm label, button colour, warning icon), and an
 * async `onConfirm`: the confirm button spins and the dialog locks (no X,
 * Escape, backdrop, or Cancel) until it settles.
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "confirm",
  icon,
  loading = false,
  size = "sm",
}: ConfirmModalProps) {
  const isDanger = variant === "danger";
  const body = description ?? children;
  const [pending, setPending] = useState(false);
  const busy = loading || pending;

  // Guard against setting state after the dialog unmounts mid-confirm.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // `icon` unset → variant default; explicit `null` hides it.
  const resolvedIcon =
    icon !== undefined
      ? icon
      : isDanger && <TriangleAlert className="h-6 w-6" aria-hidden="true" />;

  const handleConfirm = async () => {
    try {
      setPending(true);
      await onConfirm();
    } finally {
      if (mountedRef.current) setPending(false);
    }
  };

  // Swallow close attempts while the confirm action is in flight.
  const handleClose = () => {
    if (!busy) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title ?? DEFAULT_TITLE[variant]}
      size={size}
      showCloseButton={!busy}
      closeOnBackdrop={!busy}
      footer={
        <>
          <Button variant="ghost" label={cancelLabel} onClick={onClose} disabled={busy} />
          <Button
            variant={isDanger ? "error" : "primary"}
            label={confirmLabel ?? DEFAULT_CONFIRM_LABEL[variant]}
            onClick={handleConfirm}
            loading={busy}
          />
        </>
      }
    >
      {body != null && (
        <div className="flex gap-3">
          {resolvedIcon != null && (
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                isDanger ? "bg-error/15 text-error" : "bg-primary/15 text-primary",
              )}
            >
              {resolvedIcon}
            </span>
          )}
          <div className="text-base-content/80">{body}</div>
        </div>
      )}
    </Modal>
  );
}
