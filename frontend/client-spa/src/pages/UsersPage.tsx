import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { parseResponse } from "@timo/common";
import { DataTable } from "@timo/features";

// Domain schema — the TS type is inferred from it, so shape lives in one place.
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});
type User = z.infer<typeof userSchema>;

// Placeholder fetch — swap for `apiClient.get('/users')` against your backend.
// `parseResponse` runtime-validates the payload against the schema.
async function fetchUsers(): Promise<User[]> {
  const raw: unknown = [
    { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
    { id: 2, name: "Alan Turing", email: "alan@example.com" },
    { id: 3, name: "Grace Hopper", email: "grace@example.com" },
  ];
  return parseResponse(userSchema.array(), raw);
}

export function UsersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
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
      {isLoading ? <p>Loading…</p> : <DataTable data={data} columns={columns} />}
    </section>
  );
}
