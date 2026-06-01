"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Building, DollarSign, MessageSquare, Calendar, User } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  message: string;
  lead_type: string;
  status: string;
  created_at: string;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  qualified: "bg-emerald-400/20 text-emerald-300 border-emerald-400/50",
  converted: "bg-green-500/20 text-green-400 border-green-500/50",
};

export function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  if (!lead) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass rounded-2xl border border-zinc-800 z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{lead.name}</h3>
                  <p className="text-sm text-zinc-400 capitalize">{lead.lead_type} Lead</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Email</p>
                      <p className="text-sm text-white truncate">{lead.email}</p>
                    </div>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Phone className="w-4 h-4 text-zinc-500" />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-500">Phone</p>
                        <p className="text-sm text-white truncate">{lead.phone}</p>
                      </div>
                    </div>
                  )}
                  {lead.company && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <Building className="w-4 h-4 text-zinc-500" />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-500">Company</p>
                        <p className="text-sm text-white truncate">{lead.company}</p>
                      </div>
                    </div>
                  )}
                  {lead.budget && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-zinc-500" />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-500">Budget</p>
                        <p className="text-sm text-white">{lead.budget}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <div>
                  <p className="text-xs text-zinc-500">Created</p>
                  <p className="text-sm text-white">
                    {new Date(lead.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Message */}
              {lead.message && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </h4>
                  <p className="text-white whitespace-pre-wrap p-4 bg-zinc-800/50 rounded-lg">
                    {lead.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply
                </a>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}