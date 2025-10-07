"use client";

import { useState, useEffect } from "react";

type UserModalProps = {
  mode: "create" | "edit";
  initialData?: { name?: string; email?: string; role?: string; clerkId?: string };
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; role?: string; clerkId?: string }) => Promise<void>;
  isSubmitting?: boolean;
};

export function UserModal({
  mode,
  initialData,
  onClose,
  onSubmit,
  isSubmitting,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "user",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "user",
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <h2 className="text-xl font-semibold text-gray-100">
          {mode === "create" ? "Create New User" : "Edit User"}
        </h2>

        {/* Name Input */}
        <input
          className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-gray-100 placeholder-gray-500 
                     focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-red-500 
                     focus:border-red-500 focus:outline-none selection:bg-gray-200 selection:text-black"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        {/* Email Input */}
        <input
          className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-gray-100 placeholder-gray-500 
                     focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-red-500 
                     focus:border-red-500 focus:outline-none selection:bg-gray-200 selection:text-black"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* Role Select — only visible on create */}
        {mode === "create" && (
          <select
            className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-gray-100 
                       hover:bg-neutral-700 focus-visible:ring-1 focus-visible:ring-red-500 
                       focus-visible:border-red-500 focus:border-red-500 focus:outline-none"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 text-gray-300 hover:bg-neutral-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
