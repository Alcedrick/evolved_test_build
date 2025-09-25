"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PlanStats({ users, plans, mostCommonGoal }: any) {
  return (
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
        <CardContent>{plans.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Common Goal</CardTitle>
        </CardHeader>
        <CardContent>{mostCommonGoal}</CardContent>
      </Card>
    </div>
  );
}
