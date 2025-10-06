import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const createUser = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    role: v.optional(v.string()),
  },

  handler: async (
    ctx,
    args
  ): Promise<{ clerkId: string; userId: Id<"users"> | null }> => {
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) throw new Error("Missing Clerk secret key");

    const password = args.password || "evolvedfitness";
    const role = args.role ?? "user";

    // ✅ Create user in Clerk (with username + name split)
    const response = await fetch("https://api.clerk.dev/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [args.email],
        username: args.name.replace(/\s+/g, "").toLowerCase(),
        password: "evolvedfitness",
        first_name: args.name.split(" ")[0],
        last_name: args.name.split(" ").slice(1).join(" ") || "",
        public_metadata: {
          role: args.role,
        },
      }),

    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Clerk user creation failed: ${err}`);
    }

    const clerkUser: { id: string } = await response.json();

    // ✅ Sync into Convex DB
    const userId = await ctx.runMutation(api.users.syncUser, {
      name: args.name,
      email: args.email,
      clerkId: clerkUser.id,
      role: args.role ?? "user",
      needsPasswordReset: true, // ✅ Default for first-time users
    });

    return { clerkId: clerkUser.id, userId };
  },
});

export const deleteUser = action({
  args: {
    clerkId: v.string(),
  },

  handler: async (ctx, { clerkId }) => {
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) throw new Error("Missing Clerk secret key");

    // 🧹 Step 1: Delete user from Clerk
    const res = await fetch(`https://api.clerk.dev/v1/users/${clerkId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${clerkSecret}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to delete user from Clerk: ${err}`);
    }

    // 🗑️ Step 2: Delete from Convex DB
    await ctx.runMutation(api.users.deleteUser, { clerkId });

    return { success: true };
  },
});
