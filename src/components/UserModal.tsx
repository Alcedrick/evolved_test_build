"use client";

import { useState, useEffect } from "react";

type UserModalProps = {
  mode: "create" | "edit";
  initialData?: { name?: string; email?: string; role?: string; clerkId?: string };
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; role: string; clerkId?: string }) => Promise<void>;
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          {mode === "create" ? "Create New User" : "Edit User"}
        </h2>

        <input
          className="border rounded-lg w-full p-2"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          className="border rounded-lg w-full p-2"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <select
          className="border rounded-lg w-full p-2"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
