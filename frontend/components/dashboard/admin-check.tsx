"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, X } from "lucide-react";

const ADMIN_EMAIL = "husbantech08@gmail.com";

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
      if (email !== ADMIN_EMAIL.toLowerCase()) {
        // Sign out and redirect
        router.push("/");
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400 mb-4">
            Only the admin can access the dashboard.
          </p>
          <p className="text-sm text-zinc-500">
            Your email: {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}