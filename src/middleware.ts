import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/generate-program", "/profile", "/admin"]);

export default clerkMiddleware(async (authFn, req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ✅ Skip middleware for update-password API and reset-password page
  if (pathname.startsWith("/api/update-password") || pathname === "/reset-password") {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) await authFn.protect();

  const { userId } = await authFn();
  if (!userId) return NextResponse.next();

  const res = await fetch(`${url.origin}/api/check-reset?clerkId=${userId}`);
  const { needsReset } = await res.json();

  if (needsReset && pathname !== "/reset-password") {
    return NextResponse.redirect(new URL("/reset-password", req.url));
  }

  if (!needsReset && pathname === "/reset-password") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
