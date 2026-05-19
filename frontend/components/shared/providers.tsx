"use client";

import { ToastProvider } from "@/components/shared/toast";
import { AuthEvents } from "@/components/shared/auth-events";

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {CLERK_PUBLISHABLE_KEY && <AuthEvents />}
      {children}
    </ToastProvider>
  );
}
