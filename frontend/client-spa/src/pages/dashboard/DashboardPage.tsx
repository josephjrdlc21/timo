import { AppWindow, RotateCw } from "lucide-react";

/** Integrations landing page — currently an empty state. */
export function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-base-content text-4xl font-bold tracking-tight sm:text-5xl">Apps</h1>
          <p className="text-base-content/60 mt-2 text-base">
            Manage internal and third-party integrations
          </p>
        </div>
        <button type="button" className="btn btn-sm gap-2">
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="bg-base-200 text-base-content/50 flex h-20 w-20 items-center justify-center rounded-full">
          <AppWindow className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="text-base-content mt-6 text-lg font-semibold">No apps found</h2>
        <p className="text-base-content/60 mt-1 text-sm">
          Try adjusting your filters or search to find apps.
        </p>
      </div>
    </div>
  );
}
