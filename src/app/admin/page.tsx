"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // ✅ hooks run once, always in the same order
  const users = useQuery(api.users.getAllUsers);
  const plans = useQuery(api.plans.getAllPlans);
  const [search, setSearch] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/"); // not logged in
      return;
    }
    if (user.publicMetadata?.role !== "admin") {
      router.replace("/"); // not admin
    }
  }, [isLoaded, user, router]);

  // Loading states
  if (!isLoaded) return <div>Loading user...</div>;
  if (!user || user.publicMetadata?.role !== "admin") {
    return <div>Redirecting...</div>;
  }
  if (!users || !plans) return <div>Loading data...</div>;

  // Filters
  const filteredUsers = users.filter((u: any) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPaid = showPaidOnly ? u.paid : true;
    return matchesSearch && matchesPaid;
  });

  const totalPlans = plans.length;
  const mostCommonGoal = (() => {
    if (plans.length === 0) return "N/A";
    const goalCount: Record<string, number> = {};
    plans.forEach((p: any) => {
      let goal = (p.name || "").toLowerCase();
      if (goal.includes("muscle")) {
        goal = "Muscle Gain";
      } else if (goal.includes("weight loss") || goal.includes("fat loss")) {
        goal = "Weight Loss";
      } else if (goal.includes("strength")) {
        goal = "Strength";
      } else {
        goal = "Other";
      }
      goalCount[goal] = (goalCount[goal] || 0) + 1;
    });
    const sorted = Object.entries(goalCount).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "N/A";
  })();

  return (
    <div className="p-8 space-y-8">
      {/* Plan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>{users.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Plans</CardTitle>
          </CardHeader>
          <CardContent>{totalPlans}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Common Goal</CardTitle>
          </CardHeader>
          <CardContent>{mostCommonGoal}</CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Users</Label>
          <Input
            id="search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="paid"
            checked={showPaidOnly}
            onCheckedChange={(val: any) => setShowPaidOnly(!!val)}
          />
          <Label htmlFor="paid">Paid Only</Label>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Paid</th>
              <th className="px-4 py-2 text-left">User Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u: any) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role ?? "user"}</td>
                <td className="px-4 py-2">{u.paid ? "✅" : "❌"}</td>
                <td className="px-4 py-2">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
