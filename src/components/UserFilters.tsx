"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function UserFilters({
  search,
  setSearch,
  showPaidOnly,
  setShowPaidOnly,
}: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-md flex flex-col gap-3">
      {/* Top Row — Label */}
      <div>
        <Label
          htmlFor="search"
          className="text-neutral-50 text-sm font-medium"
        >
          Search Users
        </Label>
      </div>

      {/* Bottom Row — Input + Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="flex-1">
          <Input
            id="search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 text-gray-100 placeholder-gray-500 
                       focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-red-500 
                       focus:border-red-500 focus:outline-none selection:bg-neutral-500 selection:text-black"
          />
        </div>

        {/* Paid Only filter */}
        <div className="flex items-center justify-center gap-2">
          <Checkbox
            id="paid"
            checked={showPaidOnly}
            onCheckedChange={(val: any) => setShowPaidOnly(!!val)}
            className="border-neutral-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
          />
          <Label htmlFor="paid" className="text-gray-300 text-sm font-medium">
            Paid Only
          </Label>
        </div>
      </div>
    </div>
  );
}
