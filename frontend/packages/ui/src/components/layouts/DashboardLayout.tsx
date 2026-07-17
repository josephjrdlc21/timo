import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils/cn";
import { MobileDrawer } from "../overlays/MobileDrawer";
import { Sidebar } from "../navigation/Sidebar";
import { Topbar } from "../navigation/Topbar";
import type { NavSection } from "../../types/navigation";

interface DashboardLayoutProps {
  nav: NavSection[];
  brandName: string;
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
export function DashboardLayout({ nav, brandName, children }: DashboardLayoutProps) {
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
    <div className="bg-base-200 text-base-content flex min-h-screen">
      {/* Desktop sidebar column */}
      <div
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 lg:block",
          collapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        <div className="sticky top-0 h-screen">
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
        <Sidebar nav={nav} brandName={brandName} onToggle={closeMobile} onNavigate={closeMobile} />
      </MobileDrawer>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={() => setMobileOpen(true)} onTogglePanel={toggleCollapsed} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
