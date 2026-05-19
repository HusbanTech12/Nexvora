"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const ADMIN_EMAILS = ["husbantech08@gmail.com"];

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
      const admin = email ? ADMIN_EMAILS.includes(email) : false;
      setIsAdmin(admin);

      if (!admin) {
        setChecking(false);
      } else {
        setChecking(false);
      }
    }
  }, [isLoaded, user, router]);

  if (checking || !isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Checking access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center border border-red-500/20">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400 mb-2">
            Only admins can access the dashboard.
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            Signed in as: {user?.primaryEmailAddress?.emailAddress}
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/"
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors text-sm"
            >
              Go to Homepage
            </a>
            <SignOutButton>
              <button className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-colors text-sm">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
