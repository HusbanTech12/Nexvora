"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Filter, Mail, Phone, Clock, User } from "lucide-react";
import { api, type Lead } from "@/lib/api";

export function MessagesView() {
  const [messages, setMessages] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.messages
      .list()
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Messages List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-400" />
              Messages ({filteredMessages.length})
            </h3>
          </div>
          <div className="divide-y divide-zinc-800 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-zinc-400">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-zinc-400">No messages found</div>
            ) : (
              filteredMessages.map((msg, i) => (
                <motion.button
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full p-4 text-left hover:bg-zinc-800/50 transition-colors ${
                    selectedMessage?.id === msg.id ? "bg-violet-600/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{msg.name}</p>
                      <p className="text-sm text-zinc-400 truncate">{msg.email}</p>
                    </div>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{msg.message}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                      msg.lead_type === "consultation"
                        ? "bg-violet-500/20 text-violet-400"
                        : msg.lead_type === "ai_qualified"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {msg.lead_type}
                  </span>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="glass rounded-xl overflow-hidden">
          {selectedMessage ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMessage.name}</h3>
                  <p className="text-sm text-zinc-400">{selectedMessage.lead_type}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span>{selectedMessage.email}</span>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-zinc-300">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Message</h4>
                <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-3 mt-6">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply
                </a>
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
