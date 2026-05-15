"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Mail, Shield, Palette, Database, Download, Trash2 } from "lucide-react";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "email", label: "Email", icon: Mail },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data", icon: Database },
  ];

  const tabsContent = {
    profile: (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Business Name</label>
          <input
            type="text"
            defaultValue="Nexvora"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Your Name</label>
          <input
            type="text"
            defaultValue="Husban Ali"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Email</label>
          <input
            type="email"
            defaultValue="husbantech08@gmail.com"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Phone</label>
          <input
            type="tel"
            defaultValue="+92 323 2774340"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <button className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white transition-colors">
          Save Changes
        </button>
      </div>
    ),
    notifications: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">Email Notifications</p>
            <p className="text-sm text-zinc-400">Receive email when new leads come in</p>
          </div>
          <button className="w-12 h-6 bg-violet-600 rounded-full relative">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">WhatsApp Notifications</p>
            <p className="text-sm text-zinc-400">Send WhatsApp message on new lead</p>
          </div>
          <button className="w-12 h-6 bg-zinc-700 rounded-full relative">
            <span className="absolute left-1 top-1 w-4 h-4 bg-zinc-400 rounded-full" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">Daily Summary</p>
            <p className="text-sm text-zinc-400">Receive daily lead summary</p>
          </div>
          <button className="w-12 h-6 bg-violet-600 rounded-full relative">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </button>
        </div>
      </div>
    ),
    email: (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Resend API Key</label>
          <input
            type="password"
            placeholder="re_xxxxx"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">From Email</label>
          <input
            type="email"
            defaultValue="onboarding@resend.dev"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Notification Email</label>
          <input
            type="email"
            defaultValue="husbantech08@gmail.com"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <button className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white transition-colors">
          Save Email Settings
        </button>
      </div>
    ),
    security: (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <button className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white transition-colors">
          Update Password
        </button>
      </div>
    ),
    data: (
      <div className="space-y-6">
        <div className="p-4 bg-zinc-800/50 rounded-xl">
          <h4 className="text-white font-medium mb-2">Export Data</h4>
          <p className="text-sm text-zinc-400 mb-4">Download all your leads as CSV</p>
          <a
            href="http://localhost:8000/api/leads/export"
            download="leads.csv"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </a>
        </div>
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
          <h4 className="text-white font-medium mb-2">Danger Zone</h4>
          <p className="text-sm text-zinc-400 mb-4">Delete all leads (this cannot be undone)</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors">
            <Trash2 className="w-4 h-4" />
            Delete All Data
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="md:w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 capitalize">
              {activeTab === "data" ? "Data Management" : activeTab}
            </h2>
            {tabsContent[activeTab as keyof typeof tabsContent]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}