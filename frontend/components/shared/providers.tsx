"use client";

import { ToastProvider } from "@/components/shared/toast";
import { AuthEvents } from "@/components/shared/auth-events";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthEvents />
      {children}
    </ToastProvider>
  );
}
