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
  /** Omit on the current page — it renders as text, not a link. */
  href?: string;
  /** Marks the current page. Defaults to the last item in the trail. */
  active?: boolean;
}

export interface NavSection {
  id: string;
  /** Uppercase heading shown above the group (hidden when collapsed). */
  label: string;
  items: NavItem[];
}
