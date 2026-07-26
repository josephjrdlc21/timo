import type { LucideIcon } from "lucide-react";

/** Badge shown after a nav label. Only "new" is used in the current design. */
export type NavBadge = "new";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Destination for real routes. Placeholder items may omit or use a hash. */
  to?: string;
  badge?: NavBadge;
  /** Renders a trailing clock glyph — "coming soon", not yet available. */
  comingSoon?: boolean;
  /** Renders a trailing chevron. Groups have no children in the current design. */
  expandable?: boolean;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  /**
   * Glyph shown before the label. The first item in a trail always carries
   * one; later items are text-only.
   */
  icon?: LucideIcon;
  /** Omit on the current page — it renders as text, not a link. */
  href?: string;
  /** Marks the current page. Defaults to the last item in the trail. */
  active?: boolean;
}

export interface NavSection {
  id: string;
  /** Uppercase heading shown above the group (hidden when collapsed). */
  label: string;
  /**
   * Pins the section to the sidebar footer, grouped with the account card and
   * theme switcher, instead of scrolling with the rest of the nav.
   */
  footer?: boolean;
  items: NavItem[];
}

export interface AccountMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Destination for real routes. Omit to render a plain action button. */
  to?: string;
  /** Action handler (also fires for links, e.g. to close the menu). */
  onClick?: () => void;
  /** Renders in the error color — for destructive actions like "Log out". */
  danger?: boolean;
}
