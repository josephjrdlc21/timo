import type { ReactNode } from "react";
import { DashboardLayout } from "@timo/ui";
import { useBreadcrumb } from "@/hooks/app/useBreadcrumb";
import { useClientNavigation } from "@/hooks/app/useClientNavigation";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const navSections = useClientNavigation();
  const breadcrumb = useBreadcrumb();

  return (
    <DashboardLayout nav={navSections} brandName="Timo" breadcrumb={breadcrumb}>
      {children}
    </DashboardLayout>
  );
}
