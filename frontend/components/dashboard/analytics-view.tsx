"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, MessageSquare, Eye, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface AnalyticsData {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  consultations: number;
  contacts: number;
}

interface DailyLead {
  date: string;
  leads: number;
  consultations: number;
}

const mockDailyData = [
  { date: "Mon", leads: 5, consultations: 2 },
  { date: "Tue", leads: 8, consultations: 3 },
  { date: "Wed", leads: 12, consultations: 5 },
  { date: "Thu", leads: 6, consultations: 2 },
  { date: "Fri", leads: 15, consultations: 8 },
  { date: "Sat", leads: 4, consultations: 1 },
  { date: "Sun", leads: 3, consultations: 1 },
];

const mockSourceData = [
  { source: "Website", leads: 45, percentage: 60 },
  { source: "WhatsApp", leads: 20, percentage: 27 },
  { source: "Direct", leads: 10, percentage: 13 },
];

const mockConversionFunnel = [
  { stage: "Visitors", count: 1250, percentage: 100 },
  { stage: "Leads", count: 180, percentage: 14.4 },
  { stage: "Contacted", count: 120, percentage: 9.6 },
  { stage: "Qualified", count: 45, percentage: 3.6 },
  { stage: "Converted", count: 12, percentage: 1 },
];

export function AnalyticsView() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/leads/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-violet-400" />
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
          <p className="text-sm text-zinc-400">Total Leads</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-3 h-3" /> 8%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.consultations || 0}</p>
          <p className="text-sm text-zinc-400">Consultations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="flex items-center text-red-400 text-sm">
              <ArrowDownRight className="w-3 h-3" /> 3%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.converted || 0}</p>
          <p className="text-sm text-zinc-400">Converted</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-3 h-3" /> 15%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">14%</p>
          <p className="text-sm text-zinc-400">Conversion Rate</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Leads Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockDailyData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="date" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
                labelStyle={{ color: "#fff" }}
              />
              <Area type="monotone" dataKey="leads" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Consultations Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Consultations Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="date" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
                labelStyle={{ color: "#fff" }}
              />
              <Line type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Source & Funnel */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
          <div className="space-y-4">
            {mockSourceData.map((item, i) => (
              <div key={item.source}>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300">{item.source}</span>
                  <span className="text-white font-medium">{item.leads} ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {mockConversionFunnel.map((item, i) => (
              <div key={item.stage} className="flex items-center gap-4">
                <div className="w-24 text-sm text-zinc-400">{item.stage}</div>
                <div className="flex-1 h-8 bg-zinc-800 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage * 6}%` }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-end pr-2"
                  >
                    <span className="text-white text-sm font-medium">{item.count}</span>
                  </motion.div>
                </div>
                <div className="w-16 text-right text-sm text-zinc-400">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}