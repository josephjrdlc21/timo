import { Headphones, LayoutGrid, MessageSquare } from "lucide-react";
import type { NavSection } from "@timo/ui";

/**
 * Sidebar navigation for the client SPA. Overview is the only destination so
 * far — the Support rows are placeholders, which NavItem renders as buttons
 * rather than links until they have routes.
 *
 * Defined at module scope so the reference stays stable across renders.
 */
const CLIENT_NAV_SECTIONS: NavSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [{ id: "overview", label: "Overview", icon: LayoutGrid, to: "/" }],
  },
  {
    id: "support",
    label: "Support",
    footer: true,
    items: [
      { id: "feedback", label: "Feedback", icon: MessageSquare },
      { id: "help-support", label: "Help & Support", icon: Headphones },
    ],
  },
];

/** Returns the sidebar navigation sections for the client SPA. */
export function useClientNavigation(): NavSection[] {
  return CLIENT_NAV_SECTIONS;
}
