"use client";

import { motion } from "framer-motion";
import { MessageSquare, Target, BarChart3, Cpu, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Assistant Integration",
    description:
      "AI-powered interaction with smart engagement, conversational UI, and business guidance for 24/7 support.",
    tags: ["ChatGPT-style", "RAG Systems", "Smart Responses"],
  },
  {
    icon: Target,
    title: "Smart Lead Generation",
    description:
      "Intelligent CTA systems, lead capture forms, consultation booking, and conversion optimization tools.",
    tags: ["Smart CTAs", "Auto Capture", "Analytics"],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Comprehensive visitor analytics, lead tracking, conversion metrics, and actionable insights.",
    tags: ["Real-time", "Reports", "Export"],
  },
  {
    icon: Cpu,
    title: "Modern Fullstack Architecture",
    description:
      "Scalable systems with responsive UI, optimized performance, and enterprise-grade security.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    icon: Zap,
    title: "Premium User Experience",
    description:
      "Modern UI/UX with smooth animations, interactive components, and intuitive navigation.",
    tags: ["Framer Motion", "ShadCN UI", "Responsive"],
  },
  {
    icon: Globe,
    title: "SEO & Performance",
    description:
      "Search engine optimized with fast loading times, semantic markup, and best practices.",
    tags: ["SEO", "Core Web Vitals", "Optimized"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
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
            <Zap className="w-4 h-4" />
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Premium features designed to grow your business and convert visitors
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-violet-400" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}