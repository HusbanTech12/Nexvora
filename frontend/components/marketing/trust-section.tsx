"use client";

import { motion, type Variants } from "framer-motion";
import { Code2, Cpu, Globe, TrendingUp, Shield, Zap } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  { icon: Globe, value: "150+", label: "Projects Delivered" },
  { icon: TrendingUp, value: "98%", label: "Client Satisfaction" },
  { icon: Cpu, value: "50+", label: "AI Integrations" },
  { icon: Code2, value: "5+", label: "Years Experience" },
];

const features = [
  {
    title: "Modern Scalable Systems",
    description: "Built with Next.js, TypeScript, and modern architecture patterns",
    icon: Code2,
  },
  {
    title: "AI-Powered Experiences",
    description: "Integration with Gemini, GPT-4, and Claude for intelligent interactions",
    icon: Cpu,
  },
  {
    title: "Conversion-Focused Design",
    description: "Every pixel optimized for lead generation and business growth",
    icon: TrendingUp,
  },
  {
    title: "Premium Fullstack Development",
    description: "End-to-end solutions from frontend to backend infrastructure",
    icon: Shield,
  },
];

export function TrustSection() {
  return (
    <section className="py-20 px-6 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 mb-4">
                <stat.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300 mb-4">
                <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}