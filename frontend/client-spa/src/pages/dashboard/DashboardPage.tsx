import { RotateCw } from "lucide-react";
import { PageHeader } from "@timo/ui";

/** Integrations landing page — currently an empty state. */
export function DashboardPage() {
  return (
    <div className="mx-auto">
      <PageHeader
        title="Apps"
        subtitle="Manage internal and third-party integrations"
        actions={
          <button type="button" className="btn btn-sm">
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        }
      />
    </div>
  );
}
