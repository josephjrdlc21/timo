import { ChevronDown, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils/cn";
import type { NavItem as NavItemData } from "../../types/navigation";

interface NavItemProps {
  item: NavItemData;
  collapsed?: boolean;
  /** Close the mobile drawer when a real link is followed. */
  onNavigate?: () => void;
}

const NEW_BADGE_CLASS = "badge badge-sm border-none bg-success/15 text-success font-semibold";

/** A single sidebar row: icon + label with optional badge / clock / chevron. */
export function NavItem({ item, collapsed = false, onNavigate }: NavItemProps) {
  const { icon: Icon, label, to, badge, comingSoon, expandable } = item;

  const rowClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      // w-full matters for the placeholder <button> rows — buttons size to
      // their content, so without it they'd sit narrower than the links.
      // text-left undoes the button default, which w-full would otherwise expose.
      "group flex w-full cursor-pointer items-center rounded-field px-3 py-2 text-left text-sm font-medium",
      "transition-[background-color,color,transform] duration-200 ease-out",
      collapsed ? "justify-center" : "gap-3",
      isActive
        ? "bg-base-200 text-base-content"
        : "text-base-content/70 hover:bg-base-200/60 hover:text-base-content",
      // A centred icon sliding sideways reads as a glitch, so nudge only when
      // the label is showing.
      !collapsed && "hover:translate-x-0.5",
    );

  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge === "new" && <span className={NEW_BADGE_CLASS}>NEW</span>}
          {expandable && (
            <ChevronDown className="text-base-content/40 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {comingSoon && (
            <Clock className="text-base-content/40 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
        </>
      )}
    </>
  );

  const title = collapsed ? label : undefined;

  // Placeholder items (no real destination) render as buttons, not links.
  if (!to) {
    return (
      <button type="button" className={rowClass({ isActive: false })} title={title}>
        {content}
      </button>
    );
  }

  return (
    <NavLink to={to} className={rowClass} title={title} onClick={onNavigate}>
      {content}
    </NavLink>
  );
}
