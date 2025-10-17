import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all payments (admin view)
export const getAll = query({
  handler: async (ctx) => {
    // read all IDs explicitly — ensures reactivity
    const ids = await ctx.db.query("payments").order("desc").collect();
    const payments = await Promise.all(
      ids.map(async (p) => {
        const doc = await ctx.db.get(p._id); // reactive read
        return {
          ...doc!,
          imageUrl: doc?.imageUrl ? await ctx.storage.getUrl(doc.imageUrl) : null,
        };
      })
    );
    return payments.filter(Boolean);
  },
});


// Get payments by user
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return await Promise.all(
      payments.map(async (p) => ({
        ...p,
        imageUrl: p.imageUrl ? await ctx.storage.getUrl(p.imageUrl) : null,
      }))
    );
  },
});

// Create a new payment record (user upload)
export const create = mutation({
  args: { userId: v.string(), imageUrl: v.id("_storage") },
  handler: async (ctx, { userId, imageUrl }) => {
    await ctx.db.insert("payments", {
      userId,
      imageUrl, // store as storageId
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Update payment status (approve/reject)
export const updateStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
