import type { ReactNode } from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "../../lib/utils/cn";

export interface DropdownItem {
  /** Item text. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Click handler (ignored when `href` is set). */
  onClick?: () => void;
  /** Render the item as a link instead of a button. */
  href?: string;
  /** Disable the item. */
  disabled?: boolean;
  /** Style the item as destructive (e.g. "Delete"). */
  danger?: boolean;
}

/** Horizontal alignment of the menu relative to the trigger. */
export type DropdownAlign = "start" | "end";

/** Side the menu opens toward. */
export type DropdownPlacement = "top" | "bottom" | "left" | "right";

interface DropdownProps {
  /** Menu items. */
  items: DropdownItem[];
  /** Text trigger. When omitted (and no `trigger`), an icon-only trigger is used. */
  label?: ReactNode;
  /** Icon-trigger content. Defaults to an ellipsis when there's no `label`. */
  icon?: ReactNode;
  /** Fully custom trigger content (overrides `label` / `icon`). */
  trigger?: ReactNode;
  /** Horizontal alignment. Defaults to "start". */
  align?: DropdownAlign;
  /** Side the menu opens toward. Defaults to "bottom". */
  placement?: DropdownPlacement;
  /** Accessible label for the icon-only trigger. Defaults to "Open menu". */
  ariaLabel?: string;
  /** Extra classes merged onto the trigger button. */
  triggerClassName?: string;
  /** Extra classes merged onto the menu (`dropdown-content`). */
  className?: string;
}

const PLACEMENT_CLASS: Record<DropdownPlacement, string> = {
  top: "dropdown-top",
  bottom: "dropdown-bottom",
  left: "dropdown-left",
  right: "dropdown-right",
};

/**
 * daisyUI dropdown menu. The trigger is a text button (`label`), an icon-only
 * button (defaults to an ellipsis when no `label`), or fully custom (`trigger`).
 * Items are passed as data; selecting one runs its `onClick` (or follows `href`)
 * and closes the menu.
 *
 * Uses daisyUI's focus method — the menu opens on focus and dismisses on blur
 * (outside click, Escape, or after a selection), so no open state to manage.
 */
export function Dropdown({
  items,
  label,
  icon,
  trigger,
  align = "start",
  placement = "bottom",
  ariaLabel = "Open menu",
  triggerClassName,
  className,
}: DropdownProps) {
  const isIconOnly = trigger == null && label == null;

  // Selecting an item should close the menu; blurring the focused element does
  // that under daisyUI's focus method.
  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onClick?.();
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <div className={cn("dropdown", PLACEMENT_CLASS[placement], align === "end" && "dropdown-end")}>
      <div
        tabIndex={0}
        role="button"
        aria-label={isIconOnly ? ariaLabel : undefined}
        className={cn(
          "btn",
          isIconOnly && "btn-ghost btn-circle",
          !isIconOnly && "btn-neutral",
          triggerClassName,
        )}
      >
        {trigger ?? label ?? icon ?? <Ellipsis className="h-5 w-5" aria-hidden="true" />}
      </div>

      <ul
        tabIndex={0}
        className={cn(
          "dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow-sm",
          className,
        )}
      >
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <a
                href={item.href}
                aria-disabled={item.disabled || undefined}
                className={cn(item.disabled && "menu-disabled", item.danger && "text-error")}
                onClick={() => (document.activeElement as HTMLElement | null)?.blur()}
              >
                {item.icon}
                {item.label}
              </a>
            ) : (
              <button
                type="button"
                disabled={item.disabled}
                className={cn(item.danger && "text-error")}
                onClick={() => handleSelect(item)}
              >
                {item.icon}
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
