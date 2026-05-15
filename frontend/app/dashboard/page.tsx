"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LeadsView } from "@/components/dashboard/leads-view";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <LeadsView />
    </div>
  );
}