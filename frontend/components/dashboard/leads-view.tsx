"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, TrendingUp, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { api, type Lead, type LeadStats } from "@/lib/api";
import { LeadDetailModal } from "@/components/dashboard/lead-detail-modal";
import { useToast } from "@/components/shared/toast";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  qualified: "bg-emerald-400/20 text-emerald-300",
  converted: "bg-green-500/20 text-green-400",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
};

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [filter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await api.leads.list(filter === "all" ? undefined : filter);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.leads.stats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateStatus = async (leadId: number, newStatus: string) => {
    try {
      await api.leads.updateStatus(leadId, newStatus);
      success("Status Updated", `Lead status changed to ${newStatus}`);
      fetchLeads();
      fetchStats();
    } catch {
      showError("Update Failed", "Could not update lead status");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-zinc-400">Total Leads</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.new}</p>
                <p className="text-sm text-zinc-400">New Leads</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.consultations}</p>
                <p className="text-sm text-zinc-400">Consultations</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.converted}</p>
                <p className="text-sm text-zinc-400">Converted</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "new", "contacted", "qualified", "converted"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-teal-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {status === "all" ? "All" : statusLabels[status] || status}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        {lead.company && (
                          <p className="text-sm text-zinc-500">{lead.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{lead.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          lead.lead_type === "consultation"
                            ? "bg-teal-400/20 text-teal-300"
                            : lead.lead_type === "ai_qualified"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-zinc-700 text-zinc-300"
                        }`}
                      >
                        {lead.lead_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs cursor-pointer ${statusColors[lead.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-sm">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setModalOpen(true);
                        }}
                        className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
