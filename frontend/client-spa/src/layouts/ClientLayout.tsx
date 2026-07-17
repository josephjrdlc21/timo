import type { ReactNode } from "react";
import { DashboardLayout } from "@timo/ui";
import { useClientNavigation } from "@/hooks/app/useClientNavigation";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const navSections = useClientNavigation();

  return (
    <DashboardLayout nav={navSections} brandName="Timo">
      {children}
    </DashboardLayout>
  );
}
