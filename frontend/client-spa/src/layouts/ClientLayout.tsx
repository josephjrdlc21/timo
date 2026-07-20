import type { ReactNode } from "react";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { DashboardLayout, type AccountMenuItem } from "@timo/ui";
import { useBreadcrumb } from "@/hooks/app/useBreadcrumb";
import { useClientNavigation } from "@/hooks/app/useClientNavigation";

interface ClientLayoutProps {
  children: ReactNode;
}

// Placeholder account until auth is wired into the client SPA. Profile / Settings
// have no routes yet, so they act as menu placeholders; Log out is a stub.
const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Log out", icon: LogOut, danger: true },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const navSections = useClientNavigation();
  const breadcrumb = useBreadcrumb();

  return (
    <DashboardLayout
      nav={navSections}
      brandName="Timo"
      breadcrumb={breadcrumb}
      userName="Jane Doe"
      userEmail="jane@acme.com"
      accountMenuItems={ACCOUNT_MENU_ITEMS}
    >
      {children}
    </DashboardLayout>
  );
}
