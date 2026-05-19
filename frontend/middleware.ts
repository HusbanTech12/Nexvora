import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export default clerkMiddleware(async (auth, req) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
