import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // will default if not provided
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) throw new Error("Missing Clerk secret key");

    // Default password
    const password = args.password || "evolvedfitness";

    // ✅ Create user in Clerk
    const res = await fetch("https://api.clerk.dev/v1/users", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${clerkSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [args.email],
        password,
        username: args.name,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Clerk user creation failed: ${err}`);
    }

    const clerkUser = await res.json();

    // ✅ Insert into Convex users table
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      clerkId: clerkUser.id,
      role: args.role ?? "user",
      createdAt: Date.now(),
    });

    return { id: userId, clerkId: clerkUser.id };
  },
});

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