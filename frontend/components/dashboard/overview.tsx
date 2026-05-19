"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from "lucide-react";
import { api, type LeadStats, type Activity as ActivityType } from "@/lib/api";
import { useDashboardLive } from "@/hooks/use-dashboard-live";

export function DashboardOverview() {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: liveData } = useDashboardLive();

  useEffect(() => {
    Promise.all([
      api.leads.stats(),
      api.analytics.recentActivity(10),
    ])
      .then(([s, a]) => {
        setStats(s);
        setActivities(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const conversionRate = stats
    ? stats.total > 0
      ? ((stats.converted / stats.total) * 100).toFixed(1)
      : "0"
    : "0";

  return (
    <div className="p-6 space-y-6">
      {/* Live Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            {liveData && (
              <span className="flex items-center text-green-400 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-white">
            {liveData?.total_leads ?? stats?.total ?? 0}
          </p>
          <p className="text-sm text-zinc-400">Total Leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {liveData?.new_leads ?? stats?.new ?? 0}
          </p>
          <p className="text-sm text-zinc-400">New Leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {liveData?.today_leads ?? 0}
          </p>
          <p className="text-sm text-zinc-400">Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{conversionRate}%</p>
          <p className="text-sm text-zinc-400">Conversion</p>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {loading ? (
              <p className="text-zinc-400 text-center py-8">Loading...</p>
            ) : activities.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">No activity yet</p>
            ) : (
              activities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      activity.type === "lead"
                        ? "bg-violet-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">
                      {activity.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {formatTime(activity.created_at)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Lead Breakdown
          </h3>
          {loading ? (
            <p className="text-zinc-400 text-center py-8">Loading...</p>
          ) : stats ? (
            <div className="space-y-4">
              {[
                {
                  label: "New",
                  value: stats.new,
                  color: "bg-blue-500",
                  total: stats.total,
                },
                {
                  label: "Contacted",
                  value: stats.contacted,
                  color: "bg-yellow-500",
                  total: stats.total,
                },
                {
                  label: "Qualified",
                  value: stats.qualified,
                  color: "bg-purple-500",
                  total: stats.total,
                },
                {
                  label: "Converted",
                  value: stats.converted,
                  color: "bg-green-500",
                  total: stats.total,
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">{item.label}</span>
                    <span className="text-white font-medium">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Consultations</span>
                  <span className="text-white">{stats.consultations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Contacts</span>
                  <span className="text-white">{stats.contacts}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-zinc-400 text-center py-8">No data</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
