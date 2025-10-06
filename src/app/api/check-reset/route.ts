import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api"; // this is allowed in API routes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get("clerkId");
  if (!clerkId) return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });

  const needsReset = await fetchQuery(api.users.mustResetPassword, { clerkId });
  return NextResponse.json({ needsReset });
}
