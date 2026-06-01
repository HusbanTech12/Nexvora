"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AdminCheck } from "@/components/dashboard/admin-check";

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">Dashboard Unavailable</h2>
          <p className="text-zinc-400 mb-6">
            Authentication is not configured. Please set Clerk environment variables in Vercel.
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors text-sm"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminCheck>
      <div className="min-h-screen bg-zinc-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="md:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main>{children}</main>
        </div>
      </div>
    </AdminCheck>
  );
}