import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { parseResponse } from "@timo/common";
import { DataTable } from "@timo/features";

// Domain schema — the TS type is inferred from it, so shape lives in one place.
const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  members: z.number().int().nonnegative(),
});
type Role = z.infer<typeof roleSchema>;

// `parseResponse` runtime-validates the payload against the schema.
async function fetchRoles(): Promise<Role[]> {
  const raw: unknown = [
    { id: 1, name: "Administrator", members: 3 },
    { id: 2, name: "Editor", members: 12 },
    { id: 3, name: "Viewer", members: 48 },
  ];
  return parseResponse(roleSchema.array(), raw);
}

export function RolesPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const columns = useMemo<ColumnDef<Role, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Role" },
      { accessorKey: "members", header: "Members" },
    ],
    [],
  );

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Roles</h1>
      {isLoading ? <p>Loading…</p> : <DataTable data={data} columns={columns} />}
    </section>
  );
}
