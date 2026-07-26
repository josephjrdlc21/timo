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
  /**
   * "bar" — compact trigger that hugs its content, menu drops down.
   * "panel" — full-width card for the sidebar footer, menu opens upward.
   */
  variant?: "bar" | "panel";
  /** Panel variant only: avatar-only trigger for the collapsed icon rail. */
  collapsed?: boolean;
}

/**
 * Account control: name + email + chevron trigger that opens a dropdown menu.
 * Self-contained overlay (matching MobileDrawer's approach) — controlled open
 * state with outside-click and Escape to close, focus returned to the trigger
 * on close.
 */
export function AccountMenu({
  userName = "Account",
  userEmail,
  items = [],
  variant = "bar",
  collapsed = false,
}: AccountMenuProps) {
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

  const panel = variant === "panel";

  return (
    <div ref={containerRef} className={cn("relative", panel ? "w-full" : "shrink-0")}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => hasMenu && setOpen((o) => !o)}
        className={cn(
          "flex cursor-pointer items-center gap-2 transition-colors",
          panel
            ? // Footer card: a bordered row spanning the sidebar, or just the
              // avatar once the rail collapses. No hover fill — the border
              // already marks it out, and a tint would fight the nav rows.
              cn(
                "rounded-box w-full",
                collapsed ? "justify-center p-1" : "border-base-300 border p-1.5",
              )
            : "rounded-full py-1 pr-2 pl-1 sm:rounded-xl",
        )}
        aria-label="Account menu"
        aria-haspopup={hasMenu ? "menu" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        aria-controls={hasMenu ? menuId : undefined}
      >
        <span className="relative shrink-0">
          <span className="bg-base-200 text-base-content/70 ring-base-300 flex h-8 w-8 items-center justify-center rounded-full ring-1">
            <User className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="bg-success border-base-100 absolute right-0 bottom-0 h-2 w-2 rounded-full border-2" />
        </span>
        {!(panel && collapsed) && (
          <>
            <span
              className={cn(
                "min-w-0 flex-1 text-left leading-tight",
                panel ? "block" : "hidden sm:block",
              )}
            >
              <span className="text-base-content block truncate text-xs font-semibold">
                {userName}
              </span>
              {userEmail && (
                <span className="text-base-content/50 block truncate text-[0.6875rem]">
                  {userEmail}
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                "text-base-content/40 h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                panel ? "block" : "hidden sm:block",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {hasMenu && open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className={cn(
            "bg-base-100 border-base-300 absolute z-30 rounded-2xl border p-1.5 shadow-lg",
            panel
              ? // Anchored to the sidebar footer, so the menu has to grow
                // upward — there is nothing below it.
                cn("bottom-full left-0 mb-2 origin-bottom-left", collapsed ? "w-60" : "w-full")
              : "right-0 mt-2 w-60 origin-top-right",
          )}
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
