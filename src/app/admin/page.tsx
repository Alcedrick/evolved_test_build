"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
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
  const users = useQuery(api.users.getAllUsers); // you'll add this query
  const plans = useQuery(api.plans.getAllPlans); // you'll add this too

  const [search, setSearch] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  if (!users || !plans) return <div>Loading...</div>;

  // Filter users
  const filteredUsers = users.filter((u: any) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPaid = showPaidOnly ? u.paid : true;
    return matchesSearch && matchesPaid;
  });

  // Plan Stats
  // 
  // Plan Stats
const totalPlans = plans.length;
const mostCommonGoal = (() => {
  if (plans.length === 0) return "N/A";

  const goalCount: Record<string, number> = {};
  plans.forEach((p: any) => {
    // Extract a simplified goal from the plan name
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
                <td className="px-4 py-2">
                  {u.paid ? "✅" : "❌"}
                </td>
                <td className="px-4 py-2">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
