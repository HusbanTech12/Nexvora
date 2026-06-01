"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, MessageSquare, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { api, type ConversionData, type LeadSource, type DailyLeadData } from "@/lib/api";

export function AnalyticsView() {
  const [conversion, setConversion] = useState<ConversionData | null>(null);
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [dailyData, setDailyData] = useState<DailyLeadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.analytics.conversion(),
      api.analytics.sources(),
      api.analytics.dailyLeads(30),
    ])
      .then(([c, s, d]) => {
        setConversion(c);
        setSources(s);
        setDailyData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = dailyData.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    leads: d.leads,
    consultations: d.consultations,
  }));

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-zinc-400">Loading analytics...</p>
      </div>
    );
  }

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
            <Users className="w-5 h-5 text-teal-300" />
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-3 h-3" /> {conversion?.lead_rate ?? 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{conversion?.total_leads ?? 0}</p>
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
          </div>
          <p className="text-2xl font-bold text-white">{conversion?.visitors ?? 0}</p>
          <p className="text-sm text-zinc-400">Page Views</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{conversion?.converted ?? 0}</p>
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
          </div>
          <p className="text-2xl font-bold text-white">{conversion?.conversion_rate ?? 0}%</p>
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
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="date" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="leads" stroke="#14b8a6" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-zinc-400 text-center py-12">No data yet</p>
          )}
        </motion.div>

        {/* Consultations Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Consultations Over Time</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
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
          ) : (
            <p className="text-zinc-400 text-center py-12">No data yet</p>
          )}
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
          {sources.length > 0 ? (
            <div className="space-y-4">
              {sources.map((item, i) => (
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
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-center py-8">No source data yet</p>
          )}
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
          {conversion?.funnel && conversion.funnel.length > 0 ? (
            <div className="space-y-3">
              {conversion.funnel.map((item, i) => {
                const maxCount = conversion.funnel[0]?.count || 1;
                const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={item.stage} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-zinc-400">{item.stage}</div>
                    <div className="flex-1 h-8 bg-zinc-800 rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(widthPercent, 2)}%` }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-end pr-2"
                      >
                        <span className="text-white text-sm font-medium">{item.count}</span>
                      </motion.div>
                    </div>
                    <div className="w-16 text-right text-sm text-zinc-400">
                      {conversion.total_leads > 0
                        ? `${((item.count / conversion.total_leads) * 100).toFixed(1)}%`
                        : "0%"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-zinc-400 text-center py-8">No funnel data yet</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
