import { LayoutGrid } from "lucide-react";
import { EmptyState, PageHeader } from "@timo/ui";

/** Overview landing page — the client SPA's only route so far. */
export function DashboardPage() {
  return (
    <div className="mx-auto">
      <PageHeader title="Overview" subtitle="A snapshot of your workspace at a glance" />
      <EmptyState
        className="mt-8"
        size="lg"
        icon={<LayoutGrid />}
        title="Nothing to show yet"
        description="Once your workspace has activity, the metrics and recent updates worth watching land here."
      />
    </div>
  );
}
