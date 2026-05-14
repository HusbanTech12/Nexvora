"use client";

import { motion, type Variants } from "framer-motion";
import { BarChart3, Users, TrendingUp, MessageSquare, Settings, PieChart, FileText, Zap } from "lucide-react";

const dashboards = [
  {
    title: "Analytics Dashboard",
    description: "Real-time visitor analytics, conversion metrics, and business insights",
    icon: BarChart3,
    features: ["Visitor Tracking", "Conversion Funnel", "Performance Metrics"],
    color: "from-violet-600 to-purple-600",
  },
  {
    title: "Lead Management",
    description: "Track, qualify, and manage your leads through the sales pipeline",
    icon: Users,
    features: ["Lead Capture", "Qualification Scoring", "Pipeline View"],
    color: "from-blue-600 to-cyan-600",
  },
  {
    title: "AI Assistant Panel",
    description: "Configure and monitor your AI chatbot for optimal performance",
    icon: MessageSquare,
    features: ["Response Templates", "Knowledge Base", "Analytics"],
    color: "from-emerald-600 to-teal-600",
  },
  {
    title: "Admin Control Center",
    description: "Full system control with user management and security settings",
    icon: Settings,
    features: ["User Roles", "System Logs", "Security Controls"],
    color: "from-orange-600 to-red-600",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function DashboardShowcaseSection() {
  return (
    <section className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 text-violet-400 text-sm mb-4">
            <PieChart className="w-4 h-4" />
            Dashboard
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powerful <span className="gradient-text">Dashboards</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Enterprise-grade dashboards to manage your business, leads, and AI systems
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {dashboards.map((dashboard, i) => (
            <motion.div
              key={dashboard.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
            >
              {/* Preview Window */}
              <div className="glass-light rounded-xl p-4 mb-4 min-h-[160px] relative overflow-hidden">
                {/* Animated Chart Bars */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-end gap-2 h-20">
                    {[35, 55, 45, 70, 60, 85, 75, 90, 80, 95].map((h, j) => (
                      <motion.div
                        key={j}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.05, duration: 0.3 }}
                        className={`w-3 rounded-t-sm bg-gradient-to-t ${dashboard.color}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1">
                  <span className="text-xs text-green-400">+12.5%</span>
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${dashboard.color} flex items-center justify-center`}>
                  <dashboard.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{dashboard.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 mb-4">{dashboard.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {dashboard.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-zinc-500 mt-12"
        >
          Dashboards available in Growth and Premium packages
        </motion.p>
      </div>
    </section>
  );
}