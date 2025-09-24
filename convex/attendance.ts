import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const logAttendance = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    staffId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("attendance", {
      userId: args.userId,
      timestamp: Date.now(),
      type: args.type,
      scannedBy: args.staffId,
    });
  },
});

export const getLogsByUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendance")
      .withIndex("by_user_id", (q) => q.eq("userId", args.clerkId))
      .order("desc")
      .collect();
  },
});

