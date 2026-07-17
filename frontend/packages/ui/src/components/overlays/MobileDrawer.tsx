import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog (e.g. "Navigation"). */
  label: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Left slide-in navigation drawer for mobile. Manual overlay (not <dialog>):
 * fixed inset-0 backdrop + <aside>, Escape to close, and a focus trap that
 * restores focus to the opener on close.
 */
export function MobileDrawer({ open, onClose, label, children }: MobileDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    const focusables = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetParent !== null,
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={open ? undefined : true}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Close button, top-right over the backdrop (per design). */}
      <button
        type="button"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className={`btn btn-sm btn-square btn-neutral absolute top-4 right-4 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close navigation menu"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </aside>
    </div>
  );
}
