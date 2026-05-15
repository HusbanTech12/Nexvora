"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AdminCheck } from "@/components/dashboard/admin-check";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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