import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api"; // convex API reference
import { fetchMutation } from "convex/nextjs";

export async function POST(req: Request) {
  console.log("🚀 [API] /api/update-password called");

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { newPassword } = await req.json();
    if (!newPassword) {
      return NextResponse.json({ error: "Missing new password" }, { status: 400 });
    }

    // ✅ 1. Update password in Clerk
    const client = await clerkClient();
    await client.users.updateUser(userId, { password: newPassword });
    console.log("✅ Password updated successfully in Clerk");

    // ✅ 2. Update Convex flag
    await fetchMutation(api.users.clearPasswordResetFlag, {
      clerkId: userId,
    });
    console.log("🟢 Convex flag set to false");

    // ✅ 3. Return success JSON (frontend will redirect)
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("💥 [API] Error in update-password route:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
