const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Lead {
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

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  consultations: number;
  contacts: number;
}

export interface DailyLeadData {
  date: string;
  leads: number;
  consultations: number;
  contacts: number;
}

export interface ConversionData {
  visitors: number;
  total_leads: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  cta_clicks: number;
  conversion_rate: number;
  lead_rate: number;
  funnel: { stage: string; count: number }[];
}

export interface LeadSource {
  source: string;
  leads: number;
  percentage: number;
}

export interface Activity {
  type: string;
  title: string;
  description: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_leads: number;
  page_views: number;
  cta_clicks: number;
  this_week_events: number;
  last_week_events: number;
  growth: number;
}

export const api = {
  leads: {
    list: (status?: string) =>
      fetchAPI<Lead[]>(status ? `/api/leads?status=${status}` : "/api/leads"),
    stats: () => fetchAPI<LeadStats>("/api/leads/stats"),
    updateStatus: (id: number, status: string) =>
      fetchAPI(`/api/leads/${id}?status=${status}`, { method: "PATCH" }),
    export: () => `${API_URL}/api/leads/export`,
  },

  messages: {
    list: (limit = 50, leadType?: string) =>
      fetchAPI<Lead[]>(
        `/api/messages?limit=${limit}${leadType ? `&lead_type=${leadType}` : ""}`
      ),
    unreadCount: () => fetchAPI<{ unread: number }>("/api/messages/unread/count"),
  },

  analytics: {
    summary: () => fetchAPI<AnalyticsSummary>("/api/analytics/summary"),
    dailyLeads: (days = 30) =>
      fetchAPI<DailyLeadData[]>(`/api/analytics/daily-leads?days=${days}`),
    conversion: () => fetchAPI<ConversionData>("/api/analytics/conversion"),
    sources: () => fetchAPI<LeadSource[]>("/api/analytics/sources"),
    recentActivity: (limit = 20) =>
      fetchAPI<Activity[]>(`/api/analytics/recent-activity?limit=${limit}`),
  },

  reports: {
    leads: (startDate?: string, endDate?: string) =>
      fetchAPI(
        `/api/reports/leads${startDate ? `?start_date=${startDate}` : ""}${endDate ? `&end_date=${endDate}` : ""}`
      ),
    analytics: (days = 30) =>
      fetchAPI(`/api/reports/analytics?days=${days}`),
    exportFull: (format = "json") =>
      fetchAPI(`/api/reports/export?format=${format}`),
    exportFullUrl: (format = "json") =>
      `${API_URL}/api/reports/export?format=${format}`,
  },

  settings: {
    get: () => fetchAPI<Record<string, string>>("/api/settings"),
    update: (settings: Record<string, string>) =>
      fetchAPI("/api/settings", {
        method: "POST",
        body: JSON.stringify({ settings }),
      }),
    deleteLeads: () =>
      fetchAPI("/api/settings/leads", { method: "DELETE" }),
  },

  dashboard: {
    liveUrl: () => `${API_URL}/api/dashboard/live`,
  },

  chat: {
    streamUrl: () => `${API_URL}/api/chat/stream`,
  },
};
