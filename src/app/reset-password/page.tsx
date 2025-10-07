"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

const passwordRules = [
  { key: "minLength", test: (pw: string) => pw.length >= 8, message: "At least 8 characters" },
  { key: "lowercase", test: (pw: string) => /[a-z]/.test(pw), message: "At least one lowercase letter" },
  { key: "uppercase", test: (pw: string) => /[A-Z]/.test(pw), message: "At least one uppercase letter" },
  { key: "digit", test: (pw: string) => /\d/.test(pw), message: "At least one number" },
  { key: "symbol", test: (pw: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw), message: "At least one special character" },
] as const;

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showRules, setShowRules] = useState(false);

  // validate live
  useEffect(() => {
    const results: Record<string, boolean> = {};
    for (const rule of passwordRules) {
      results[rule.key] = rule.test(newPassword);
    }
    setValidation(results);
  }, [newPassword]);

  const allValid = passwordRules.every((rule) => validation[rule.key]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
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

      if (data?.success) {
        setMessage("✅ Password updated. Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        setMessage("⚠️ " + (data?.error || "Could not update password"));
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-neutral-900 border border-neutral-800 shadow-lg rounded-2xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Reset Your Password
        </h2>

        <div className="relative mb-4">
          <input
            aria-label="New password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-200 w-full px-4 py-3 pr-10 rounded-md placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* 👇 Show only unmet rules after submit is attempted */}
        {showRules && (
          <ul className="mb-4 space-y-2 text-sm transition-all">
            {passwordRules
              .filter((rule) => !validation[rule.key]) // hide when met
              .map((rule) => (
                <li key={rule.key} className="text-red-400 flex items-center gap-2">
                  ❌ {rule.message}
                </li>
              ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && <p className="mt-3 text-center text-sm text-neutral-300">{message}</p>}
      </form>
    </div>
  );
}
