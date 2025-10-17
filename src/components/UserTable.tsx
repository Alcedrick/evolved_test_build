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
    <div className="overflow-x-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-md">
      <table className="min-w-full text-sm text-gray-200">
        <thead className="bg-neutral-900 text-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Role</th>
            <th className="px-4 py-3 text-left font-semibold">Payment Status</th>
            <th className="px-4 py-3 text-left font-semibold">User Created</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u: any) => (
            <tr
              key={u._id}
              className={`border-t border-neutral-800 bg-neutral-950 hover:bg-neutral-800/50 transition-colors text-neutral-50 ${
                u.clerkId === "pending" ? "opacity-50" : ""
              }`}
            >
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role ?? "user"}</td>
              <td className="px-4 py-3">
                {u.paymentStatus === "approved" ? (
                  <span className="text-green-500">✅</span>
                ) : u.paymentStatus === "rejected" ? (
                  <span className="text-red-500">❌</span>
                ) : (
                  <span className="text-yellow-400">⏳</span>
                )}
              </td>

              <td className="px-4 py-3">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-200 hover:border-red-500 hover:text-neutral-50"
                  onClick={() => onViewLogs(u)}
                >
                  View Logs
                </Button>

                {onEditUser && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-neutral-800 text-gray-200 hover:bg-neutral-700"
                    onClick={() => onEditUser(u)}
                  >
                    Edit
                  </Button>
                )}

                {onDeleteUser && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
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
