import { Bell, Menu, Search } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { AccountMenu } from "./AccountMenu";
import type { AccountMenuItem, BreadcrumbItem } from "../../types/navigation";

interface TopbarProps {
  /** Open the mobile drawer (hamburger). */
  onOpenMobile: () => void;
  /** Trail for the current page. Omit to leave the left side empty. */
  breadcrumb?: BreadcrumbItem[];
  notificationCount?: number;
  /** Signed-in user's display name, shown on the account menu trigger. */
  userName?: string;
  /** Signed-in user's email, shown as the account menu subtitle. */
  userEmail?: string;
  /** Rows for the account dropdown (Profile, Settings, Log out, …). */
  accountMenuItems?: AccountMenuItem[];
}

/** Application top bar: breadcrumb left, search + notifications / profile right. */
export function Topbar({
  onOpenMobile,
  breadcrumb,
  notificationCount = 6,
  userName,
  userEmail,
  accountMenuItems,
}: TopbarProps) {
  return (
    <header className="bg-base-100 border-base-300 sticky top-3 z-20 rounded-2xl border shadow-xs">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-4">
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

        {/* Mobile-only: search affordance (full field is desktop). */}
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square ml-auto lg:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* ml-auto is what pushes search and the actions into one right-hand
            group, leaving the breadcrumb alone on the left. */}
        <label className="bg-base-200 focus-within:ring-primary/40 ml-auto hidden h-10 w-full max-w-xs items-center gap-2 rounded-full px-4 focus-within:ring-2 lg:flex">
          <Search className="text-base-content/40 h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search or type a command..."
            className="text-base-content placeholder:text-base-content/40 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="kbd kbd-sm text-base-content/50">⌘K</kbd>
        </label>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square relative"
            aria-label={`Notifications${notificationCount ? `, ${notificationCount} unread` : ""}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {notificationCount > 0 && (
              <span className="bg-error text-error-content absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          <AccountMenu userName={userName} userEmail={userEmail} items={accountMenuItems} />
        </div>
      </div>
    </header>
  );
}
