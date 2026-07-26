import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils/cn";
import { MobileDrawer } from "../overlays/MobileDrawer";
import { Sidebar } from "../navigation/Sidebar";
import { Topbar } from "../navigation/Topbar";
import type { AccountMenuItem, BreadcrumbItem, NavSection } from "../../types/navigation";

interface DashboardLayoutProps {
  nav: NavSection[];
  brandName: string;
  /** Trail for the current page, shown on the left of the top bar. */
  breadcrumb?: BreadcrumbItem[];
  /** Signed-in user's display name, shown on the sidebar footer account card. */
  userName?: string;
  /** Signed-in user's email, shown as the account card subtitle. */
  userEmail?: string;
  /** Rows for the sidebar account dropdown (Profile, Settings, Log out, …). */
  accountMenuItems?: AccountMenuItem[];
  children: ReactNode;
}

const COLLAPSE_KEY = "timo.sidebar.collapsed";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Dashboard layout: a full-height collapsible sidebar flush against the left
 * edge, with the top bar and routed page content stacked in the column beside
 * it.
 */
export function DashboardLayout({
  nav,
  brandName,
  breadcrumb,
  userName,
  userEmail,
  accountMenuItems,
  children,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      // Persistence is best-effort.
    }
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    // Two flush columns, no outer gutter: the sidebar runs the full viewport
    // height against the left edge and the top bar spans only the main column.
    <div className="bg-base-200 text-base-content flex min-h-screen">
      {/* Desktop sidebar column */}
      <div
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 lg:block",
          collapsed ? "w-[4.5rem]" : "w-72",
        )}
      >
        {/* Sticky + h-screen keeps the rail pinned while the main column
            scrolls, so its footer account card stays reachable. */}
        <div className="sticky top-0 h-screen">
          <Sidebar
            nav={nav}
            brandName={brandName}
            collapsed={collapsed}
            onToggle={toggleCollapsed}
            userName={userName}
            userEmail={userEmail}
            accountMenuItems={accountMenuItems}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={closeMobile} label="Navigation">
        <Sidebar
          nav={nav}
          brandName={brandName}
          onToggle={closeMobile}
          onNavigate={closeMobile}
          userName={userName}
          userEmail={userEmail}
          accountMenuItems={accountMenuItems}
        />
      </MobileDrawer>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={() => setMobileOpen(true)} breadcrumb={breadcrumb} />
        {/* The gutter now lives on the content instead of around the shell. */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
