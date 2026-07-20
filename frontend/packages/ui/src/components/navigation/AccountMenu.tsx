import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils/cn";
import type { AccountMenuItem } from "../../types/navigation";

interface AccountMenuProps {
  /** Signed-in user's display name, shown on the trigger and menu header. */
  userName?: string;
  /** Signed-in user's email, shown as the subtitle. */
  userEmail?: string;
  /** Menu rows. Omit or pass an empty array to render a non-interactive trigger. */
  items?: AccountMenuItem[];
}

/**
 * Top bar account control: name + email + chevron trigger that opens a dropdown
 * menu. Self-contained overlay (matching MobileDrawer's approach) — controlled
 * open state with outside-click and Escape to close, focus returned to the
 * trigger on close.
 */
export function AccountMenu({ userName = "Account", userEmail, items = [] }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const hasMenu = items.length > 0;

  const runItem = (item: AccountMenuItem) => {
    item.onClick?.();
    setOpen(false);
  };

  const rowClass = (danger?: boolean) =>
    cn(
      "flex w-full cursor-pointer items-center gap-2.5 rounded-field px-3 py-2 text-left text-sm font-medium transition-colors duration-150",
      danger
        ? "text-error hover:bg-error/10"
        : "text-base-content/80 hover:bg-base-200 hover:text-base-content",
    );

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => hasMenu && setOpen((o) => !o)}
        className="hover:bg-base-200 flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors sm:rounded-xl"
        aria-label="Account menu"
        aria-haspopup={hasMenu ? "menu" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        aria-controls={hasMenu ? menuId : undefined}
      >
        <span className="relative shrink-0">
          <span className="bg-base-200 text-base-content/70 ring-base-300 flex h-9 w-9 items-center justify-center rounded-full ring-1">
            <User className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="bg-success border-base-100 absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2" />
        </span>
        <span className="hidden min-w-0 text-left leading-tight sm:block">
          <span className="text-base-content block truncate text-sm font-semibold">{userName}</span>
          {userEmail && (
            <span className="text-base-content/50 block truncate text-xs">{userEmail}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "text-base-content/40 hidden h-4 w-4 shrink-0 transition-transform duration-200 sm:block",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {hasMenu && open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="bg-base-100 border-base-300 absolute right-0 z-30 mt-2 w-60 origin-top-right rounded-2xl border p-1.5 shadow-lg"
        >
          <div className="border-base-200 mb-1 border-b px-3 py-2">
            <p className="text-base-content truncate text-sm font-semibold">{userName}</p>
            {userEmail && <p className="text-base-content/50 truncate text-xs">{userEmail}</p>}
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                <span className="truncate">{item.label}</span>
              </>
            );
            if (item.to) {
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  role="menuitem"
                  className={rowClass(item.danger)}
                  onClick={() => runItem(item)}
                >
                  {content}
                </NavLink>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={rowClass(item.danger)}
                onClick={() => runItem(item)}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
