import { Button } from "@timo/ui";

export function DashboardPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">IAM Dashboard</h1>
      <p className="text-gray-600">
        Admin console sharing the same <code>@timo/*</code> packages, tooling and versions as the
        client SPA — one install, one source of truth.
      </p>
      <div>
        <Button variant="secondary">Manage access</Button>
      </div>
    </section>
  );
}
