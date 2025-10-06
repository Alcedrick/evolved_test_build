import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


// --- Delete user ---
export const deleteUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();
    if (!existingUser) throw new Error("User not found");
    await ctx.db.delete(existingUser._id);
    return existingUser._id;
  },
});

// --- Edit user (name, email, role) ---
export const editUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      ...(args.name && { name: args.name }),
      ...(args.email && { email: args.email }),
      ...(args.role && { role: args.role }),
    });
    return user._id;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});



export const listUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
    needsPasswordReset: v.optional(v.boolean()), // 👈 add this
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return await ctx.db.patch(existingUser._id, {
        ...args,
        role: args.role ?? existingUser.role ?? "user",
        // 👇 Keep the existing flag if already set, else use provided or default to false
        needsPasswordReset:
          args.needsPasswordReset ?? existingUser.needsPasswordReset ?? false,
      });
    }

    // 👇 New user — set default to true
    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
      role: args.role ?? "user",
      needsPasswordReset: args.needsPasswordReset ?? true,
    });
  },
});


export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
    needsPasswordReset: v.optional(v.boolean()),
  },
  handler: async(ctx, args) => {
    
    const existingUser = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId)).first()

    if(!existingUser) return

    return await ctx.db.patch(existingUser._id, args)
    
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const mustResetPassword = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user?.needsPasswordReset ?? false;
  },
});

export const clearPasswordResetFlag = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return;

    await ctx.db.patch(user._id, { needsPasswordReset: false });
  },
});

