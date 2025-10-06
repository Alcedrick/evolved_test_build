"use client";

import { Button } from "@/components/ui/button";

type UserTableProps = {
  users: any[];
  onViewLogs: (user: any) => void;
  onEditUser?: (user: any) => void;
  onDeleteUser?: (clerkId: string) => void;
};

export function UserTable({ users, onViewLogs, onEditUser, onDeleteUser }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-border text-xs sm:text-sm">
        <thead className="bg-muted/30">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Paid</th>
            <th className="px-4 py-2 text-left">User Created</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr
              key={u._id}
              className={`border-t ${u.clerkId === "pending" ? "opacity-50" : ""}`}
            >
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role ?? "user"}</td>
              <td className="px-4 py-2">{u.paid ? "✅" : "❌"}</td>
              <td className="px-4 py-2">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewLogs(u)}
                >
                  View Logs
                </Button>

                {onEditUser && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditUser(u)}
                  >
                    Edit
                  </Button>
                )}

                {onDeleteUser && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteUser(u.clerkId)}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
