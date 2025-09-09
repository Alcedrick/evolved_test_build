import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


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
    role: v.optional(v.string()), // <-- add role here
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
      });
    }

    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(), // fallback to "user"
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