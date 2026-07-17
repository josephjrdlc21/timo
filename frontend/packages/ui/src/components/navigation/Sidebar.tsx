import { ChevronLeft, ChevronRight } from "lucide-react";
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
}

/** Sidebar panel: brand + collapse toggle, nav sections, theme switcher footer. */
export function Sidebar({ nav, brandName, collapsed = false, onToggle, onNavigate }: SidebarProps) {
  const ChevIcon = collapsed ? ChevronRight : ChevronLeft;

  return (
    <div className="bg-base-100 border-base-300 flex h-full flex-col border-r">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center px-3",
          collapsed ? "justify-center gap-1" : "justify-between",
        )}
      >
        <Brand name={brandName} collapsed={collapsed} />
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevIcon className="h-4 w-4" aria-hidden="true" />
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

      <div className="border-base-300 shrink-0 border-t p-3">
        <ThemeSwitcher collapsed={collapsed} />
      </div>
    </div>
  );
}
