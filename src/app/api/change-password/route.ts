import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json();
    const clerkSecret = process.env.CLERK_SECRET_KEY;

    if (!clerkSecret) throw new Error("Missing Clerk secret key");

    const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${clerkSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
