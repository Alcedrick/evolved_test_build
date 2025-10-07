"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PlanStats({ users, plans, mostCommonGoal }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Users */}
      <Card className="bg-neutral-900 border border-neutral-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-gray-100 text-lg font-semibold">
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-red-600">
          {users.length}
        </CardContent>
      </Card>

      {/* Total Plans */}
      <Card className="bg-neutral-900 border border-neutral-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-gray-100 text-lg font-semibold">
            Total Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-red-600">
          {plans.length}
        </CardContent>
      </Card>

      {/* Most Common Goal */}
      <Card className="bg-neutral-900 border border-neutral-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-gray-100 text-lg font-semibold">
            Most Common Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold text-red-600">
          {mostCommonGoal}
        </CardContent>
      </Card>
    </div>
  );
}
