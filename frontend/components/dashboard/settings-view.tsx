"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { User, Bell, Mail, Shield, Database, Download, Trash2, CheckCircle, AlertCircle } from "lucide-react";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profile, setProfile] = useState({
    business_name: "Nexvora",
    admin_name: "",
    admin_phone: "",
  });

  const [notifications, setNotifications] = useState({
    notify_email_enabled: true,
    notify_whatsapp_enabled: false,
    notify_daily_summary: true,
  });

  const [emailSettings, setEmailSettings] = useState({
    resend_api_key: "",
    from_email: "onboarding@resend.dev",
    notification_email: "",
  });

  const [whatsappSettings, setWhatsappSettings] = useState({
    whatsapp_phone: "",
    whatsapp_token: "",
  });

  useEffect(() => {
    api.settings
      .get()
      .then((data) => {
        setProfile({
          business_name: data.business_name || "Nexvora",
          admin_name: data.admin_name || "",
          admin_phone: data.admin_phone || "",
        });
        setNotifications({
          notify_email_enabled: data.notify_email_enabled === "true",
          notify_whatsapp_enabled: data.notify_whatsapp_enabled === "true",
          notify_daily_summary: data.notify_daily_summary === "true",
        });
        setEmailSettings({
          resend_api_key: data.resend_api_key || "",
          from_email: data.from_email || "onboarding@resend.dev",
          notification_email: data.notification_email || "",
        });
        setWhatsappSettings({
          whatsapp_phone: data.whatsapp_phone || "",
          whatsapp_token: data.whatsapp_token || "",
        });
      })
      .catch(console.error);
  }, []);

  const showFeedback = (success: boolean, message: string) => {
    setSaved(success);
    setError(success ? "" : message);
    setTimeout(() => {
      setSaved(false);
      setError("");
    }, 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.settings.update(profile);
      showFeedback(true, "Profile saved");
    } catch {
      showFeedback(false, "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        notify_email_enabled: String(notifications.notify_email_enabled),
        notify_whatsapp_enabled: String(notifications.notify_whatsapp_enabled),
        notify_daily_summary: String(notifications.notify_daily_summary),
      });
      showFeedback(true, "Notification settings saved");
    } catch {
      showFeedback(false, "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const saveEmailSettings = async () => {
    setSaving(true);
    try {
      await api.settings.update(emailSettings);
      showFeedback(true, "Email settings saved");
    } catch {
      showFeedback(false, "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const saveWhatsAppSettings = async () => {
    setSaving(true);
    try {
      await api.settings.update(whatsappSettings);
      showFeedback(true, "WhatsApp settings saved");
    } catch {
      showFeedback(false, "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const deleteAllLeads = async () => {
    try {
      await api.settings.deleteLeads();
      showFeedback(true, "All leads deleted");
      setShowDeleteConfirm(false);
    } catch {
      showFeedback(false, "Failed to delete leads");
    }
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-colors ${
        enabled ? "bg-teal-500" : "bg-zinc-700"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
          enabled ? "right-1" : "left-1"
        }`}
      />
    </button>
  );

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "email", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )},
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
            value={profile.business_name}
            onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Your Name</label>
          <input
            type="text"
            value={profile.admin_name}
            onChange={(e) => setProfile({ ...profile, admin_name: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.admin_phone}
            onChange={(e) => setProfile({ ...profile, admin_phone: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 rounded-lg text-white transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
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
          <Toggle
            enabled={notifications.notify_email_enabled}
            onChange={() =>
              setNotifications({
                ...notifications,
                notify_email_enabled: !notifications.notify_email_enabled,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">WhatsApp Notifications</p>
            <p className="text-sm text-zinc-400">Send WhatsApp message on new lead</p>
          </div>
          <Toggle
            enabled={notifications.notify_whatsapp_enabled}
            onChange={() =>
              setNotifications({
                ...notifications,
                notify_whatsapp_enabled: !notifications.notify_whatsapp_enabled,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white">Daily Summary</p>
            <p className="text-sm text-zinc-400">Receive daily lead summary</p>
          </div>
          <Toggle
            enabled={notifications.notify_daily_summary}
            onChange={() =>
              setNotifications({
                ...notifications,
                notify_daily_summary: !notifications.notify_daily_summary,
              })
            }
          />
        </div>
        <button
          onClick={saveNotifications}
          disabled={saving}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 rounded-lg text-white transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    ),
    email: (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Resend API Key</label>
          <input
            type="password"
            value={emailSettings.resend_api_key}
            onChange={(e) => setEmailSettings({ ...emailSettings, resend_api_key: e.target.value })}
            placeholder="re_xxxxx"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">From Email</label>
          <input
            type="email"
            value={emailSettings.from_email}
            onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Notification Email</label>
          <input
            type="email"
            value={emailSettings.notification_email}
            onChange={(e) => setEmailSettings({ ...emailSettings, notification_email: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
        </div>
        <button
          onClick={saveEmailSettings}
          disabled={saving}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 rounded-lg text-white transition-colors"
        >
          {saving ? "Saving..." : "Save Email Settings"}
        </button>
      </div>
    ),
    whatsapp: (
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">WhatsApp Phone Number</label>
          <input
            type="text"
            value={whatsappSettings.whatsapp_phone}
            onChange={(e) => setWhatsappSettings({ ...whatsappSettings, whatsapp_phone: e.target.value })}
            placeholder="+1234567890"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
          <p className="text-xs text-zinc-500 mt-1">Phone number with country code for WhatsApp Business API</p>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">WhatsApp API Token</label>
          <input
            type="password"
            value={whatsappSettings.whatsapp_token}
            onChange={(e) => setWhatsappSettings({ ...whatsappSettings, whatsapp_token: e.target.value })}
            placeholder="EAAxxxxxxxxx"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
          />
          <p className="text-xs text-zinc-500 mt-1">Get from Meta Developers Dashboard</p>
        </div>
        <button
          onClick={saveWhatsAppSettings}
          disabled={saving}
          className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 rounded-lg text-white transition-colors"
        >
          {saving ? "Saving..." : "Save WhatsApp Settings"}
        </button>
      </div>
    ),
    security: (
      <div className="space-y-6">
        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <h4 className="text-white font-medium mb-2">Password Management</h4>
          <p className="text-sm text-zinc-400 mb-4">
            Password is managed through Clerk. Go to your Clerk account settings to change it.
          </p>
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white transition-colors text-sm"
          >
            <Shield className="w-4 h-4" />
            Manage in Clerk Dashboard
          </a>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <h4 className="text-white font-medium mb-2">Two-Factor Authentication</h4>
          <p className="text-sm text-zinc-400">
            Enable 2FA in your Clerk account for extra security.
          </p>
        </div>
      </div>
    ),
    data: (
      <div className="space-y-6">
        <div className="p-4 bg-zinc-800/50 rounded-xl">
          <h4 className="text-white font-medium mb-2">Export Data</h4>
          <p className="text-sm text-zinc-400 mb-4">Download all your leads as CSV</p>
          <a
            href={api.leads.export()}
            download="leads.csv"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </a>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-xl">
          <h4 className="text-white font-medium mb-2">Export Full Report</h4>
          <p className="text-sm text-zinc-400 mb-4">Download complete report with all data</p>
          <a
            href={api.reports.exportFullUrl("csv")}
            download="full_report.csv"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Full Report
          </a>
        </div>
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
          <h4 className="text-white font-medium mb-2">Danger Zone</h4>
          <p className="text-sm text-zinc-400 mb-4">Delete all leads (this cannot be undone)</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Leads
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={deleteAllLeads}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    ),
  };

  return (
    <div className="p-6">
      {/* Feedback */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          Settings saved successfully
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="md:w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSaved(false);
                  setError("");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <tab.icon />
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
              {activeTab === "data" ? "Data Management" : activeTab === "whatsapp" ? "WhatsApp Settings" : activeTab}
            </h2>
            {tabsContent[activeTab as keyof typeof tabsContent]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
