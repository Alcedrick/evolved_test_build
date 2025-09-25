"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";

import { PlanStats } from "@/components/PlanStats";
import { UserFilters } from "@/components/UserFilters";
import { UserTable } from "@/components/UserTable";
import { QrScannerBox } from "@/components/QrScannerBox";
import { AttendanceLogsDialog } from "@/components/AttendanceLogsDialog";

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;


export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const users = useQuery(api.users.getAllUsers);
  const plans = useQuery(api.plans.getAllPlans);
  const logAttendance = useMutation(api.attendance.logAttendance);

  const [search, setSearch] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [lastScanTime, setLastScanTime] = useState(0);
  const [scanType, setScanType] = useState<"entry" | "exit" | null>(null);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const logs = useQuery(api.attendance.getLogsByUser, selectedUser ? { clerkId: selectedUser.clerkId } : "skip");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) return router.replace("/");
    if (user.publicMetadata?.role !== "admin") return router.replace("/");
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  if (!isLoaded) return <div>Loading user...</div>;
  if (!users || !plans) return <div>Loading data...</div>;

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPaid = showPaidOnly ? u.paid : true;
    return matchesSearch && matchesPaid;
  });

  const mostCommonGoal = (() => {
    if (plans.length === 0) return "N/A";
    const goalCount: Record<string, number> = {};
    plans.forEach((p: any) => {
      let goal = (p.name || "").toLowerCase();
      if (goal.includes("muscle")) goal = "Muscle Gain";
      else if (goal.includes("weight loss") || goal.includes("fat loss")) goal = "Weight Loss";
      else if (goal.includes("strength")) goal = "Strength";
      else goal = "Other";
      goalCount[goal] = (goalCount[goal] || 0) + 1;
    });
    return Object.entries(goalCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  })();

  const handleScan = async (result: string) => {
  if (!result || !scanType) return;

  const now = Date.now();
  if (now - lastScanTime < 2000) return; // prevent duplicate scans within 2s
  setLastScanTime(now);

  try {
    await logAttendance({ userId: result, type: scanType, staffId: user?.id });
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

  setScanType(null);
};


  const userMap = new Map(users.map((u: any) => [u.clerkId, u.name?.split(" ")[0] ?? u.name ?? "Unknown"]));

  return (
    <div className="p-8 space-y-8">
      <PlanStats users={users} plans={plans} mostCommonGoal={mostCommonGoal} />
      <UserFilters search={search} setSearch={setSearch} showPaidOnly={showPaidOnly} setShowPaidOnly={setShowPaidOnly} />
      <UserTable users={filteredUsers} onViewLogs={(u: any) => { setSelectedUser(u); setShowLogs(true); }} />
      <QrScannerBox scanType={scanType} setScanType={setScanType} handleScan={handleScan} feedback={feedback} />
      <AttendanceLogsDialog
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        selectedUser={selectedUser}
        logs={logs}
        userMap={userMap}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
