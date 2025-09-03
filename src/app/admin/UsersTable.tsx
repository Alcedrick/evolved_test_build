"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function UsersTable() {
  const users = useQuery(api.users.listUsers);

  if (users === undefined) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-md">
      <table className="min-w-full bg-background">
        <thead>
          <tr className="bg-muted text-left">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="py-2 px-4">{u.name}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.role || "user"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
