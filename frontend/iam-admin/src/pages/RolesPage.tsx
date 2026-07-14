import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { parseResponse } from "@timo/common";
import { DataTable } from "@timo/features";
import { Button, TextField } from "@timo/ui";

// Domain schema — the TS type is inferred from it, so shape lives in one place.
const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  members: z.number().int().nonnegative(),
});
type Role = z.infer<typeof roleSchema>;

// `parseResponse` runtime-validates the payload against the schema.
async function fetchRoles(search: string): Promise<Role[]> {
  const raw: unknown = [
    { id: 1, name: "Administrator", members: 3 },
    { id: 2, name: "Editor", members: 12 },
    { id: 3, name: "Viewer", members: 48 },
  ];
  const all = parseResponse(roleSchema.array(), raw);
  const q = search.trim().toLowerCase();
  return q ? all.filter((r) => r.name.toLowerCase().includes(q)) : all;
}

// Form schema — validation rules + inferred form type.
const searchSchema = z.object({
  search: z.string().max(50, "Keep the search under 50 characters"),
});
type SearchForm = z.infer<typeof searchSchema>;

export function RolesPage() {
  const { control, handleSubmit } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });
  const search = useWatch({ control, name: "search" });

  const { data = [], isLoading } = useQuery({
    queryKey: ["roles", search],
    queryFn: () => fetchRoles(search),
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
      <form onSubmit={handleSubmit(() => undefined)} className="flex items-end gap-2">
        <TextField name="search" control={control} label="Search" placeholder="Filter by role" />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      {isLoading ? <p>Loading…</p> : <DataTable data={data} columns={columns} />}
    </section>
  );
}
