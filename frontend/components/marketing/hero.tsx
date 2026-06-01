"use client";

import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  MessageSquare,
  Zap,
  Activity,
  TrendingUp,
  Users,
} from "lucide-react";

const ParticleNetwork = dynamic(
  () => import("@/components/ui/ParticleNetwork"),
  { ssr: false }
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};



export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Particle Network Background */}
      <ParticleNetwork className="absolute inset-0 z-0" />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm text-zinc-300 border-teal-400/30 animate-shimmer">
              <Sparkles className="w-4 h-4 text-teal-300" />
              AI-Powered Development Agency
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">We Build </span>
            <span className="gradient-text">AI-Powered Websites</span>
            <br />
            <span className="text-white">That Convert Visitors</span>
            <span className="text-teal-300"> Into Customers</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Modern fullstack web systems with intelligent lead generation, premium
            UI/UX, and scalable architecture for growing businesses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="xl"
              className="group relative overflow-hidden"
              onClick={() => window.dispatchEvent(new CustomEvent("open-consultation"))}
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="group"
              onClick={() => {
                const el = document.querySelector("#services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Services
              <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="relative max-w-5xl mx-auto"
          >
            {/* Dashboard Mockup */}
            <div className="glass rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl shadow-teal-400/20 hover:shadow-teal-400/30 transition-shadow duration-500">
              {/* Dashboard Header */}
              <div className="flex items-center gap-4 px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-zinc-500">dashboard.nexvora.com</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-zinc-500">Live</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                {/* Stats Cards */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Visitors", value: "24,589", change: "+12.5%", icon: Users, positive: true },
                    { label: "Leads Generated", value: "1,247", change: "+8.2%", icon: TrendingUp, positive: true },
                    { label: "Conversion Rate", value: "3.2%", change: "+2.1%", icon: Activity, positive: true },
                    { label: "Active Sessions", value: "847", change: "+15.3%", icon: BarChart3, positive: true },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="glass-light rounded-xl p-4 hover:border-teal-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/10 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-teal-400/10 group-hover:bg-teal-400/20 transition-colors">
                          <stat.icon className="w-4 h-4 text-teal-300" />
                        </div>
                        <span className={`text-xs font-medium ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-zinc-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 glass-light rounded-xl p-5 hover:border-teal-400/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-white">Lead Generation Trend</div>
                      <div className="text-xs text-zinc-500">Last 12 months</div>
                    </div>
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      +23.5%
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5 h-32">
                    {[40, 60, 45, 70, 55, 80, 65, 90, 75, 85, 95, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-teal-500 to-emerald-300 rounded-t-sm hover:from-teal-400 hover:to-emerald-200 transition-all duration-300 relative group/chart"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/chart:opacity-100 transition-opacity whitespace-nowrap">
                          {h} leads
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Chat Preview */}
                <div className="glass-light rounded-xl p-5 hover:border-teal-400/30 transition-all duration-300 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-400/20">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">AI Assistant</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] text-zinc-500">Online - Ready to help</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <div className="bg-zinc-800/50 rounded-xl px-3 py-2.5 text-xs text-zinc-300 max-w-[85%]">
                      Hi! I&apos;m your AI assistant. How can I help grow your business today?
                    </div>
                    <div className="bg-teal-500/20 rounded-xl px-3 py-2.5 text-xs text-zinc-300 border border-teal-400/20 max-w-[85%] ml-auto">
                      I&apos;d like to learn about your AI development services
                    </div>
                    <div className="flex gap-1.5 items-center text-zinc-600 text-xs">
                      <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Tech Badges */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-1/4 glass rounded-xl p-2.5 border border-teal-400/30 shadow-lg shadow-teal-400/10"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[11px] text-zinc-300 font-medium">Live Lead Captured</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-1/4 glass rounded-xl p-2.5 border border-emerald-400/30 shadow-lg shadow-emerald-400/10"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span className="text-[11px] text-zinc-300 font-medium">New inquiry received</span>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-zinc-700 flex items-start justify-center p-1.5">
            <motion.div className="w-1 h-2 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
