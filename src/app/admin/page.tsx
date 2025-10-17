"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { PlanStats } from "@/components/PlanStats";
import { UserFilters } from "@/components/UserFilters";
import { UserTable } from "@/components/UserTable";
import { QrScannerBox } from "@/components/QrScannerBox";
import { AttendanceLogsDialog } from "@/components/AttendanceLogsDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel"; // 👈 add this import
import { UserModal } from "@/components/UserModal";

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const users = useQuery(api.users.getAllUsers);
  const plans = useQuery(api.plans.getAllPlans);
  const payments = useQuery(api.payments.getAll);
  const updatePaymentStatus = useMutation(api.payments.updateStatus);
  const logAttendance = useMutation(api.attendance.logAttendance);
  const createUser = useAction(api.usersActions.createUser);
  const deleteUser = useAction(api.usersActions.deleteUser);
  const editUser = useMutation(api.users.editUser);

  const usersData = useQuery(api.users.getAllUsers);
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  useEffect(() => {
  if (!usersData) return;

  // Merge users with their latest payment info
  const mergedUsers = usersData.map((u) => {
    const userPayment = payments
      ?.filter((p: any) => p.userId === u._id)
      .sort((a: any, b: any) => b.createdAt - a.createdAt)[0]; // get latest payment

    return {
      ...u,
      paymentStatus: userPayment?.status ?? "none",
    };
  });

  setLocalUsers(mergedUsers);
}, [usersData, payments]);



  const [search, setSearch] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [scanType, setScanType] = useState<"entry" | "exit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const openCreateUser = () => {
    setModalMode("create");
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditUser = (user: any) => {
    setModalMode("edit");
    setEditingUser(user);
    setShowModal(true);
  };

  const logs = useQuery(
    api.attendance.getLogsByUser,
    selectedUser ? { clerkId: selectedUser.clerkId } : "skip"
  );

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
  if (!users || !plans || !payments) return <div>Loading data...</div>;

  const handleCreateUser = async (data: { name: string; email: string; role?: string }) => {
    const { name, email } = data;
    const role = data.role ?? "user";

    if (!name || !email) {
      setFeedback({ type: "error", message: "Name and email are required" });
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticUser = {
      _id: tempId,
      name,
      email,
      role,
      clerkId: "pending",
      createdAt: Date.now(),
    };

    setLocalUsers((prev) => [optimisticUser, ...prev]);

    try {
      const result = await createUser({ name, email, role });
      setLocalUsers((prev) =>
        prev.map((u) =>
          u._id === tempId
            ? { ...u, clerkId: result.clerkId, _id: result.userId ?? tempId }
            : u
        )
      );
      setFeedback({ type: "success", message: "User created successfully!" });
    } catch (err: any) {
      console.error(err);
      setLocalUsers((prev) => prev.filter((u) => u._id !== tempId));
      setFeedback({ type: "error", message: err.message || "Error creating user" });
    }
  };

  const handleDeleteUser = async (clerkId: string) => {
    const prevUsers = localUsers;
    setLocalUsers((prev) => prev.filter((u) => u.clerkId !== clerkId));

    try {
      await deleteUser({ clerkId });
      setFeedback({ type: "success", message: "User deleted" });
    } catch (err) {
      console.error(err);
      setLocalUsers(prevUsers);
      setFeedback({ type: "error", message: "Failed to delete user" });
    }
  };

  const handleEditUser = async (clerkId: string, updates: { name?: string; email?: string; role?: string }) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u.clerkId === clerkId ? { ...u, ...updates } : u))
    );

    try {
      await editUser({ clerkId, ...updates });
      setFeedback({ type: "success", message: "User updated" });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Failed to update user" });
    }
  };

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
  try {
    await updatePaymentStatus({ id: id as Id<"payments">, status }); // ✅ cast it
    setFeedback({ type: "success", message: `Payment ${status}` });
  } catch (err) {
    console.error(err);
    setFeedback({ type: "error", message: "Error updating payment" });
  }
};



  const filteredUsers = localUsers.filter((u: any) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPaid = showPaidOnly ? u.paymentStatus === "approved" : true;
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
    if (now - lastScanTime < 2000) return;
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
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
        <div className="flex sm:justify-end">
          <Button
            onClick={openCreateUser}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            <Plus size={18} />
            Create User
          </Button>
        </div>
      </div>

      {showModal && (
        <UserModal
          mode={modalMode}
          initialData={editingUser}
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            setIsSubmitting(true);
            if (modalMode === "create") {
              await handleCreateUser(data);
            } else if (modalMode === "edit" && editingUser) {
              await handleEditUser(editingUser.clerkId, data);
            }
            setIsSubmitting(false);
            setShowModal(false);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      <PlanStats users={users} plans={plans} mostCommonGoal={mostCommonGoal} />
      <UserFilters
        search={search}
        setSearch={setSearch}
        showPaidOnly={showPaidOnly}
        setShowPaidOnly={setShowPaidOnly}
        inputClassName="bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-700 focus:ring-red-500"
      />
      <UserTable
        users={filteredUsers}
        onViewLogs={(u: any) => {
          setSelectedUser(u);
          setShowLogs(true);
        }}
        onEditUser={openEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Payment Management Section */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-4">Payment Proofs</h2>
        {!payments.length ? (
          <p className="text-gray-400">No payments yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments
              .filter((p: any) => p.status === "pending")
              .map((p: any) => (
              
              <div key={p._id} className="border border-border rounded-lg p-4 bg-neutral-900">
                {p.imageUrl ? (
                  <div
                    onClick={() =>
                      setSelectedImage(
                        p.imageUrl.startsWith("http")
                          ? p.imageUrl
                          : `/uploads/${p.imageUrl}`
                      )
                    }
                    className="cursor-pointer"
                  >
                    <Image
                      src={
                        p.imageUrl.startsWith("http")
                          ? p.imageUrl
                          : `/uploads/${p.imageUrl}`
                      }
                      alt="Payment Proof"
                      width={400}
                      height={400}
                      className="rounded-lg object-cover w-full h-64 hover:opacity-80 transition"
                    />
                  </div>

                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-neutral-800 text-gray-500 rounded-lg">
                    No Image
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-300">
                  <strong>User ID:</strong> {p.userId}
                </p>
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      p.status === "approved"
                        ? "text-green-400"
                        : p.status === "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusChange(p._id, "approved")}
                    disabled={p.status === "approved"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleStatusChange(p._id, "rejected")}
                    disabled={p.status === "rejected"}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <QrScannerBox
        scanType={scanType}
        setScanType={setScanType}
        handleScan={handleScan}
        feedback={feedback}
      />
      <AttendanceLogsDialog
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        selectedUser={selectedUser}
        logs={logs}
        userMap={userMap}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Full Payment Proof"
              width={800}
              height={800}
              className="rounded-lg object-contain max-h-[85vh] w-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
