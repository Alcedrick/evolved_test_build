"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function UserFilters({ search, setSearch, showPaidOnly, setShowPaidOnly }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="pb-2">Search Users</Label>
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
  );
}
