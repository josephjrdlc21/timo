import { LayoutGrid } from "lucide-react";
import { useLocation } from "react-router-dom";
import type { BreadcrumbItem } from "@timo/ui";

/**
 * Breadcrumb trail per route. Add an entry here when you add a route —
 * this map and the router are separate sources of truth, so a missing entry
 * shows no trail rather than a wrong one.
 *
 * Defined at module scope so the reference stays stable across renders.
 */
const CLIENT_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: "Overview", icon: LayoutGrid, href: "/" }, { label: "Dashboard" }],
};

/** Returns the breadcrumb trail for the current route, or [] if untrailed. */
export function useBreadcrumb(): BreadcrumbItem[] {
  const { pathname } = useLocation();
  return CLIENT_BREADCRUMBS[pathname] ?? [];
}
