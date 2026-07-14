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
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});
type User = z.infer<typeof userSchema>;

// Placeholder fetch — swap for `apiClient.get('/users')` against your backend.
// `parseResponse` runtime-validates the payload against the schema.
async function fetchUsers(search: string): Promise<User[]> {
  const raw: unknown = [
    { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { id: 2, name: "Alan Turing", email: "alan@example.com" },
    { id: 3, name: "Grace Hopper", email: "grace@example.com" },
  ];
  const all = parseResponse(userSchema.array(), raw);
  const q = search.trim().toLowerCase();
  return q ? all.filter((u) => u.name.toLowerCase().includes(q)) : all;
}

// Form schema — validation rules + inferred form type.
const searchSchema = z.object({
  search: z.string().max(50, "Keep the search under 50 characters"),
});
type SearchForm = z.infer<typeof searchSchema>;

export function UsersPage() {
  const { control, handleSubmit } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });
  const search = useWatch({ control, name: "search" });

  const { data = [], isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => fetchUsers(search),
  });

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
    ],
    [],
  );

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <form onSubmit={handleSubmit(() => undefined)} className="flex items-end gap-2">
        <TextField name="search" control={control} label="Search" placeholder="Filter by name" />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      {isLoading ? <p>Loading…</p> : <DataTable data={data} columns={columns} />}
    </section>
  );
}
