import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils/cn";
import { MobileDrawer } from "../overlays/MobileDrawer";
import { Sidebar } from "../navigation/Sidebar";
import { Topbar } from "../navigation/Topbar";
import type { BreadcrumbItem, NavSection } from "../../types/navigation";

interface DashboardLayoutProps {
  nav: NavSection[];
  brandName: string;
  /** Trail for the current page, shown on the left of the top bar. */
  breadcrumb?: BreadcrumbItem[];
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

/** Dashboard layout: collapsible sidebar + top bar around routed page content. */
export function DashboardLayout({ nav, brandName, breadcrumb, children }: DashboardLayoutProps) {
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
    // The p-3 gutter is what makes the sidebar and top bar read as floating
    // cards rather than panels welded to the viewport edges.
    <div className="bg-base-200 text-base-content flex min-h-screen gap-6 p-3">
      {/* Desktop sidebar column */}
      <div
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 lg:block",
          collapsed ? "w-[4.5rem]" : "w-72",
        )}
      >
        <div className="sticky top-3 h-[calc(100vh-1.5rem)]">
          <Sidebar
            nav={nav}
            brandName={brandName}
            collapsed={collapsed}
            onToggle={toggleCollapsed}
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
          floating={false}
        />
      </MobileDrawer>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Topbar onOpenMobile={() => setMobileOpen(true)} breadcrumb={breadcrumb} />
        {/* No horizontal padding: page content lines up with the top bar
            card's outer edges, which the column gutter already insets. */}
        <main className="flex-1 py-3">{children}</main>
      </div>
    </div>
  );
}
