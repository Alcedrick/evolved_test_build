"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useMutation } from "convex/react";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // ✅ hooks run once, always in the same order
  const users = useQuery(api.users.getAllUsers);
  const plans = useQuery(api.plans.getAllPlans);

  const [search, setSearch] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);


  const logAttendance = useMutation(api.attendance.logAttendance);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [scanType, setScanType] = useState<"entry" | "exit" | null>(null);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const logs = useQuery(api.attendance.getLogsByUser, selectedUser ? { clerkId: selectedUser.clerkId } : "skip");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


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

  // Auto-dismiss effect
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [feedback]);


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


  const handleScan = async (result: string) => {
  if (!result || !scanType) return;

  const now = Date.now();

  // Ignore duplicates within 2 seconds
  if (now - lastScanTime < 2000) return;

  setLastScanTime(now);

  try {
    await logAttendance({
      userId: result,
      type: scanType,
      staffId: user?.id,
    });

    setFeedback({
      type: "success",
      message: `Attendance (${scanType}) logged for user: ${result}`,
    });
  } catch (err) {
    console.error(err);
    setFeedback({
      type: "error",
      message: "Failed to log attendance. Please try again.",
    });
  }

  setScanType(null); // reset mode
};

  const userMap = new Map(
  users.map((u: any) => [
    u.clerkId,
    u.name?.split(" ")[0] ?? u.name ?? "Unknown",
  ])
);

const filteredLogs = logs
  ? logs.filter((log: any) => {
      if (!selectedDate) return true;
      const logDate = new Date(log.timestamp).toDateString();
      return logDate === selectedDate.toDateString();
    })
  : [];


  return (
    <div className="p-8 md:p-8 space-y-8">
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

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border text-xs sm:text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 sm:px-4 py-2 text-left">Name</th>
              <th className="px-4 sm:px-4 py-2 text-left">Email</th>
              <th className="px-4 sm:px-4 py-2 text-left">Role</th>
              <th className="px-4 sm:px-4 py-2 text-left">Paid</th>
              <th className="px-4 sm:px-4 py-2 text-left">User Created</th>
              <th className="px-4 sm:px-4 py-2 text-left">Logs</th>
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
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(u);   // includes u.clerkId
                      setShowLogs(true);
                    }}
                  >
                    View Logs
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* QR Scanner */}
      <div className="mt-8 border p-4 md:p-6 rounded-lg w-full">
        <h2 className="text-lg font-bold mb-4">Scan Member QR</h2>

        {!scanType ? (
          <div className="flex gap-4">
            <button
              onClick={() => setScanType("entry")}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Entry
            </button>
            <button
              onClick={() => setScanType("exit")}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Exit
            </button>
          </div>
        ) : (
          <div className="w-full mt-4">
            <p className="mb-2 font-medium text-gray-700">
              {scanType === "entry" ? "Scanning for Entry..." : "Scanning for Exit..."}
            </p>
            <Scanner
              onScan={(results) => {
                if (results && results.length > 0) {
                  const value = results[0].rawValue;
                  if (value) handleScan(value);
                }
              }}
              constraints={{ facingMode: "environment" }}
            />
            
          </div>
        )}

        {feedback && (
          <Alert
            className={`mt-4 ${
              feedback.type === "success"
                ? "border-green-500 text-green-700"
                : "border-red-500 text-red-700"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {feedback.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}
      </div>
      {/* Attendance Logs Dialog */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="w-full max-w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Attendance Logs for {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>

          {/* Date Filter */}
          <div className="mt-2 mb-4 flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate ?? undefined}
                  onSelect={(date) => setSelectedDate(date ?? null)}
                  required={false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button
                variant="ghost"
                onClick={() => setSelectedDate(null)}
              >
                Clear
              </Button>
            )}
          </div>
          
          {/* Logs Table */}
          <div className="flex-1 overflow-y-auto">
            {!logs ? (
              <p>Loading...</p>
            ) : filteredLogs.length === 0 ? (
              <p>No logs found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border max-h-[60vh]">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/30 top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Timestamp</th>
                      <th className="px-4 py-2 text-left">Scanned By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log: any) => (
                      <tr key={log._id} className="border-t">
                        <td className="px-4 py-2 font-medium">
                          {log.type === "entry" ? (
                            <span className="text-green-600">Entry</span>
                          ) : (
                            <span className="text-red-600">Exit</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          {log.scannedBy
                            ? userMap.get(log.scannedBy) ?? log.scannedBy
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
