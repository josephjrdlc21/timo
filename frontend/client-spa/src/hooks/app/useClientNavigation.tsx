import {
  BarChart3,
  Briefcase,
  Contact,
  GraduationCap,
  Grid2x2,
  HeartPulse,
  Home,
  LayoutGrid,
  PieChart,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import type { NavSection } from "@timo/ui";

/**
 * Sidebar navigation for the client SPA. Items are presentational placeholders
 * (no destination pages yet) — only the Apps landing page is a real route.
 * Defined at module scope so the reference stays stable across renders.
 */
const CLIENT_NAV_SECTIONS: NavSection[] = [
  {
    id: "home-concepts",
    label: "Home Concepts",
    items: [
      { id: "admin-control-center", label: "Admin Control Center", icon: Home },
      { id: "workspace-setup", label: "Workspace Setup", icon: Sparkles },
      { id: "activity-hub", label: "Activity Hub", icon: LayoutGrid },
    ],
  },
  {
    id: "dashboards",
    label: "Dashboards",
    items: [
      { id: "dash-ecommerce", label: "E-commerce", icon: LayoutGrid },
      { id: "dash-projects", label: "Projects", icon: Grid2x2 },
      { id: "dash-sales-orders", label: "Sales / Orders", icon: BarChart3 },
      { id: "dash-executive", label: "Executive", icon: PieChart },
      { id: "dash-shipment", label: "Shipment Tracking", icon: Truck },
    ],
  },
  {
    id: "solutions",
    label: "Solutions",
    items: [
      {
        id: "sol-ecommerce",
        label: "E-commerce",
        icon: ShoppingCart,
        badge: "new",
        expandable: true,
      },
      { id: "sol-crm", label: "CRM", icon: Contact, badge: "new", expandable: true },
      { id: "sol-projects", label: "Projects", icon: Briefcase, comingSoon: true },
      { id: "sol-education", label: "Education", icon: GraduationCap, comingSoon: true },
      { id: "sol-health", label: "Health & Wellness", icon: HeartPulse, comingSoon: true },
      { id: "sol-real-estate", label: "Real Estate Pro", icon: Home, comingSoon: true },
    ],
  },
];

/** Returns the sidebar navigation sections for the client SPA. */
export function useClientNavigation(): NavSection[] {
  return CLIENT_NAV_SECTIONS;
}
