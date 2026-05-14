"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart3, MessageSquare, Zap } from "lucide-react";

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
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-zinc-300">
              <Sparkles className="w-4 h-4 text-violet-400" />
              AI-Powered Development Agency
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
            <span className="text-violet-400"> Into Customers</span>
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
            <Button size="xl" className="group">
              Book Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="xl" variant="outline">
              Explore Services
            </Button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="relative max-w-5xl mx-auto"
          >
            {/* Dashboard Mockup */}
            <div className="glass rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl shadow-violet-500/10">
              {/* Dashboard Header */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-zinc-500">dashboard.husbantech.com</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                {/* Stats Cards */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Visitors", value: "24,589", change: "+12.5%", icon: BarChart3 },
                    { label: "Leads Generated", value: "1,247", change: "+8.2%", icon: Zap },
                    { label: "Conversions", value: "3.2%", change: "+2.1%", icon: ArrowRight },
                    { label: "Active Users", value: "847", change: "+15.3%", icon: MessageSquare },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="glass-light rounded-xl p-4 hover:border-violet-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className="w-4 h-4 text-violet-400" />
                        <span className="text-xs text-green-400">{stat.change}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-zinc-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="lg:col-span-2 glass-light rounded-xl p-4 min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-zinc-500 mb-2">Lead Generation Trend</div>
                    <div className="flex items-end gap-1 h-20">
                      {[40, 60, 45, 70, 55, 80, 65, 90, 75, 85, 95, 100].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1 + i * 0.05, duration: 0.3 }}
                          className="flex-1 bg-gradient-to-t from-violet-600 to-purple-500 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Chat Preview */}
                <div className="glass-light rounded-xl p-4 min-h-[200px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">AI Assistant</div>
                      <div className="text-xs text-zinc-500">Online</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-zinc-800/50 rounded-lg p-2 text-zinc-300">
                      How can I help you today?
                    </div>
                    <div className="bg-violet-600/20 rounded-lg p-2 text-zinc-300 border border-violet-500/20">
                      I need help with lead generation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-1/4 glass rounded-xl p-3 border border-violet-500/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-300">Live Lead Alert</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 bottom-1/4 glass rounded-xl p-3 border border-purple-500/30"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-zinc-300">New inquiry</span>
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
          className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-violet-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}