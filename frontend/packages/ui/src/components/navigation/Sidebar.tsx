import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "../../lib/utils/cn";
import { Brand } from "../brand/Brand";
import { NavItem } from "./NavItem";
import { AccountMenu } from "./AccountMenu";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import type { AccountMenuItem, NavSection } from "../../types/navigation";

interface SidebarProps {
  nav: NavSection[];
  brandName: string;
  /** Desktop collapse state. Always false in the mobile drawer. */
  collapsed?: boolean;
  /** Header chevron action — collapse on desktop, close in the drawer. */
  onToggle?: () => void;
  /** Called after a real link is followed (closes the drawer on mobile). */
  onNavigate?: () => void;
  /** Signed-in user's display name, shown on the footer account card. */
  userName?: string;
  /** Signed-in user's email, shown as the account card subtitle. */
  userEmail?: string;
  /** Rows for the footer account dropdown (Profile, Settings, Log out, …). */
  accountMenuItems?: AccountMenuItem[];
}

/**
 * Sidebar panel: brand + collapse toggle, search, nav sections, and a footer
 * holding the account card and the theme switcher. It is a flush, full-height
 * column — the border lives on the right edge, not around a card.
 *
 * Sections flagged `footer` (Support) are pinned into that footer group; the
 * rest scroll. Both render through NavItem, so a pinned row and a scrolling
 * one share one set of hover and active styles.
 */
export function Sidebar({
  nav,
  brandName,
  collapsed = false,
  onToggle,
  onNavigate,
  userName,
  userEmail,
  accountMenuItems,
}: SidebarProps) {
  const ChevIcon = collapsed ? ChevronRight : ChevronLeft;
  const hasAccount = Boolean(userName || userEmail || accountMenuItems?.length);

  const renderSection = (section: NavSection) => (
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
  );

  return (
    <div className="bg-base-100 border-base-300 flex h-full flex-col border-r">
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

      {/* Its own element rather than a border on the header: the rule is inset
          from both edges, which a border on the full-width row cannot do. */}
      <div className="border-base-300 mx-3 shrink-0 border-b border-dashed" />

      {/* Search sits under the brand rather than on the top bar, so the whole
          left column reads as one navigation surface. */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        {collapsed ? (
          // `.btn` is inline-flex, so the wrapper is what centres the glyph on
          // the icon rail.
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Search"
              title="Search"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          // px-3 puts the magnifier on the same rail as the nav icons below,
          // which the pill's px-4 could not do.
          <label className="bg-base-200 rounded-field focus-within:ring-primary/40 flex h-10 w-full items-center gap-2 px-3 focus-within:ring-2">
            <Search className="text-base-content/40 h-4 w-4 shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search anything"
              className="text-base-content placeholder:text-base-content/40 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <kbd className="kbd kbd-sm text-base-content/50">⌘K</kbd>
          </label>
        )}
      </div>

      <nav className="scrollbar-slim flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {nav.filter((section) => !section.footer).map(renderSection)}
      </nav>

      <div className="shrink-0 space-y-2 p-3">
        {nav.filter((section) => section.footer).map(renderSection)}

        {hasAccount && (
          <AccountMenu
            variant="panel"
            collapsed={collapsed}
            userName={userName}
            userEmail={userEmail}
            items={accountMenuItems}
          />
        )}

        <ThemeSwitcher collapsed={collapsed} />
      </div>
    </div>
  );
}
