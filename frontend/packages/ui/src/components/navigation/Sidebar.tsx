import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils/cn";
import { Brand } from "../brand/Brand";
import { NavItem } from "./NavItem";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import type { NavSection } from "../../types/navigation";

interface SidebarProps {
  nav: NavSection[];
  brandName: string;
  /** Desktop collapse state. Always false in the mobile drawer. */
  collapsed?: boolean;
  /** Header chevron action — collapse on desktop, close in the drawer. */
  onToggle?: () => void;
  /** Called after a real link is followed (closes the drawer on mobile). */
  onNavigate?: () => void;
  /** Invoked when the footer help button is pressed. */
  onHelp?: () => void;
  /** Rounded, fully-bordered card (desktop). False for the edge-to-edge drawer. */
  floating?: boolean;
}

/** Sidebar panel: brand + collapse toggle, nav sections, theme switcher footer. */
export function Sidebar({
  nav,
  brandName,
  collapsed = false,
  onToggle,
  onNavigate,
  onHelp,
  floating = true,
}: SidebarProps) {
  const ChevIcon = collapsed ? ChevronRight : ChevronLeft;

  return (
    <div
      className={cn(
        "bg-base-100 border-base-300 flex h-full flex-col",
        floating ? "rounded-2xl border shadow-xs" : "border-r",
      )}
    >
      <div
        className={cn(
          "relative flex h-16 shrink-0 items-center",
          // Expanded, pl-6 lines the logo up with the section labels and nav
          // icons, which sit at px-3 inside an already px-3 <nav>.
          collapsed ? "justify-center px-3" : "justify-between pr-3 pl-6",
        )}
      >
        <Brand name={brandName} collapsed={collapsed} />
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "btn btn-ghost btn-sm btn-circle text-base-content/60 shrink-0",
              // Collapsed the rail is too narrow to hold the brand and the
              // toggle side by side, so the toggle straddles the right border.
              collapsed &&
                "bg-base-100 border-base-300 hover:bg-base-200 absolute -right-2.5 z-10 h-6 min-h-6 w-6 border p-0 shadow-xs",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevIcon className={collapsed ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {nav.map((section) => (
          <div key={section.id} className="space-y-1">
            {!collapsed && (
              <p className="text-base-content/40 px-3 pb-1 text-xs font-semibold tracking-wider uppercase">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <NavItem key={item.id} item={item} collapsed={collapsed} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-2 p-3">
        <ThemeSwitcher collapsed={collapsed} />
        <button
          type="button"
          onClick={onHelp}
          className={cn(
            "rounded-field border-base-300 text-base-content/70 hover:bg-base-200/60 hover:text-base-content flex w-full cursor-pointer items-center border px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out",
            collapsed ? "justify-center" : "gap-3",
          )}
          aria-label="Help"
          title={collapsed ? "Help" : undefined}
        >
          <HelpCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span className="truncate">Help</span>}
        </button>
      </div>
    </div>
  );
}
