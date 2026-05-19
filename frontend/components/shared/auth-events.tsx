"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/shared/toast";

export function AuthEvents() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { success, info } = useToast();

  useEffect(() => {
    if (isSignedIn && user) {
      const hasSeenWelcome = sessionStorage.getItem("welcome_shown");
      if (!hasSeenWelcome) {
        success(
          "Signed In Successfully",
          `Welcome back, ${user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}!`
        );
        sessionStorage.setItem("welcome_shown", "true");
      }
    }
  }, [isSignedIn, user, success]);

  useEffect(() => {
    const handleSignOut = () => {
      info("Signed Out", "You have been signed out successfully");
      sessionStorage.removeItem("welcome_shown");
    };

    window.addEventListener("user-signed-out", handleSignOut);
    return () => window.removeEventListener("user-signed-out", handleSignOut);
  }, [info]);

  return null;
}
