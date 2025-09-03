import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!, // ✅ explicit
});

export default async function AdminPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  const clerkUsers = await clerkClient.users.getUserList({
    orderBy: "-created_at",
    limit: 50,
  });

  return (
    <div className="flex flex-col min-h-screen text-foreground pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        <h1 className="text-3xl font-bold font-mono text-center mb-6">
          Admin <span className="text-primary">Dashboard</span>
        </h1>
        <div className="overflow-x-auto rounded-lg border border-border shadow-md">
          <table className="min-w-full bg-background">
            <thead>
              <tr className="bg-muted text-left">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {clerkUsers.data.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2 px-4">
                    {u.firstName || ""} {u.lastName || ""}
                  </td>
                  <td className="py-2 px-4">{String(u.emailAddresses[0]?.emailAddress)}</td>
                  <td className="py-2 px-4">{String(u.publicMetadata?.role || "user")}</td>
                  <td className="py-2 px-4">{String(new Date(u.createdAt).toLocaleDateString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
