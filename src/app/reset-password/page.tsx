"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const passwordRules = [
  {
    key: "minLength",
    test: (pw: string) => pw.length >= 8,
    message: "At least 8 characters",
  },
  {
    key: "lowercase",
    test: (pw: string) => /[a-z]/.test(pw),
    message: "At least one lowercase letter",
  },
  {
    key: "uppercase",
    test: (pw: string) => /[A-Z]/.test(pw),
    message: "At least one uppercase letter",
  },
  {
    key: "digit",
    test: (pw: string) => /\d/.test(pw),
    message: "At least one number",
  },
  {
    key: "symbol",
    test: (pw: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
    message: "At least one special character",
  },
];

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showRules, setShowRules] = useState(false); // 👈 control visibility of rules

  // Validate password on every change
  useEffect(() => {
    const results: Record<string, boolean> = {};
    for (const rule of passwordRules) {
      results[rule.key] = rule.test(newPassword);
    }
    setValidation(results);
  }, [newPassword]);

  const allValid = passwordRules.every((rule) => validation[rule.key]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // 👇 Show rules only when button is pressed
    setShowRules(true);

    if (!allValid) {
      setMessage("⚠️ Please meet all password requirements.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ Password updated. Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        setMessage("⚠️ " + (data.error || "Could not update password"));
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white shadow-md rounded-xl w-80"
      >
        <h2 className="text-lg font-semibold mb-3 text-center">
          Reset Your Password
        </h2>

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border w-full p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* 👇 Show validation rules only after submit is attempted */}
        {showRules && (
          <ul className="mb-3 space-y-1 text-sm transition-all">
            {passwordRules
              .filter((rule) => !validation[rule.key])
              .map((rule) => (
                <li key={rule.key} className="text-red-600 flex items-center">
                  ❌ {rule.message}
                </li>
              ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full transition-colors duration-150"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
