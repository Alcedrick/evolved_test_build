"use client";import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage() {
  const { user, isLoaded } = useUser();
  const updateUser = useMutation(api.users.updateUser);
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded || !user) {
    return <div>Loading...</div>; // ✅ Prevents "user possibly null" error
  }

  const handleChangePassword = async () => {
    if (!newPassword) return;

    setIsSubmitting(true);
    try {
      // Update password in Clerk
      await user.updatePassword({ newPassword });

      // ✅ Mark password reset as completed in Convex
      await updateUser({
        clerkId: user.id,
        needsPasswordReset: false, // ✅ Type now exists
      });

      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Change Your Password</h1>
      <Input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button onClick={handleChangePassword} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Password"}
      </Button>
    </div>
  );
}
