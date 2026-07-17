import { Bell, Menu, PanelLeft, Search, User } from "lucide-react";

interface TopbarProps {
  /** Open the mobile drawer (hamburger). */
  onOpenMobile: () => void;
  /** Toggle the desktop sidebar collapse (panel button). */
  onTogglePanel: () => void;
  notificationCount?: number;
}

/** A rounded US flag — emoji flags don't render on every platform. */
function UsFlag() {
  return (
    <span className="ring-base-300 inline-flex h-6 w-6 overflow-hidden rounded-full ring-1">
      <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
        <rect width="24" height="24" fill="#b22234" />
        <g fill="#fff">
          <rect y="1.85" width="24" height="1.85" />
          <rect y="5.54" width="24" height="1.85" />
          <rect y="9.23" width="24" height="1.85" />
          <rect y="12.92" width="24" height="1.85" />
          <rect y="16.62" width="24" height="1.85" />
          <rect y="20.31" width="24" height="1.85" />
        </g>
        <rect width="11" height="12.92" fill="#3c3b6e" />
      </svg>
    </span>
  );
}

/** Application top bar: search + panel / language / notifications / profile. */
export function Topbar({ onOpenMobile, onTogglePanel, notificationCount = 6 }: TopbarProps) {
  return (
    <header className="bg-base-100 border-base-300 sticky top-0 z-20 border-b">
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

        {/* Mobile-only: search affordance (full field is desktop). */}
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Desktop search field. */}
        <label className="bg-base-200 focus-within:ring-primary/40 hidden h-10 flex-1 items-center gap-2 rounded-full px-4 focus-within:ring-2 lg:flex">
          <Search className="text-base-content/40 h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search or type a command..."
            className="text-base-content placeholder:text-base-content/40 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="kbd kbd-sm text-base-content/50">⌘K</kbd>
        </label>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <button
            type="button"
            onClick={onTogglePanel}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Language">
            <UsFlag />
          </button>

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

          <button type="button" className="relative shrink-0" aria-label="Account">
            <span className="bg-base-200 text-base-content/70 ring-base-300 flex h-9 w-9 items-center justify-center rounded-full ring-1">
              <User className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="bg-success border-base-100 absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2" />
          </button>
        </div>
      </div>
    </header>
  );
}
