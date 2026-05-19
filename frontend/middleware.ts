import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";
const HAS_CLERK_KEYS = CLERK_PUBLISHABLE_KEY && CLERK_SECRET_KEY;

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerkAuth = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

const passthrough: NextMiddleware = () => NextResponse.next();

export default HAS_CLERK_KEYS ? clerkAuth : passthrough;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
