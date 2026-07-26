import { Bell, Menu, Settings } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import type { BreadcrumbItem } from "../../types/navigation";

interface TopbarProps {
  /** Open the mobile drawer (hamburger). */
  onOpenMobile: () => void;
  /** Trail for the current page. Omit to leave the left side empty. */
  breadcrumb?: BreadcrumbItem[];
}

const ICON_BUTTON_CLASS = "btn btn-ghost btn-sm btn-square border-base-300 border";

/**
 * Application top bar: breadcrumb left, notifications / settings right. It sits
 * inside the main column — the sidebar owns the full height to its left — and
 * is transparent, so only the inset dashed rule separates it from the content.
 * It scrolls away with the page: being transparent, pinning it would let
 * content run visibly underneath.
 */
export function Topbar({ onOpenMobile, breadcrumb }: TopbarProps) {
  return (
    <header>
      {/* mx (not px) is what holds the dashed rule off the column edges while
          keeping the row's content on the same inset as before. */}
      <div className="border-base-300 mx-3 flex h-16 items-center gap-2 border-b border-dashed sm:mx-6 sm:gap-3">
        {/* Mobile-only: open the drawer. */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {breadcrumb && <Breadcrumb items={breadcrumb} className="hidden sm:block" />}

        {/* ml-auto is what pushes the actions into one right-hand group,
            leaving the breadcrumb alone on the left. */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button type="button" className={ICON_BUTTON_CLASS} aria-label="Notifications">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          <button type="button" className={ICON_BUTTON_CLASS} aria-label="Settings">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
