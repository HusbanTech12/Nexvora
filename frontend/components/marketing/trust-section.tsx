"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Code2, Cpu, Globe, TrendingUp, Shield, Zap, CheckCircle } from "lucide-react";

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

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numValue = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numValue]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
      {isInView ? count : 0}{suffix}
      {value.includes("+") && "+"}
    </div>
  );
}

const stats = [
  { icon: Globe, value: "150", suffix: "+", label: "Projects Delivered" },
  { icon: TrendingUp, value: "98", suffix: "%", label: "Client Satisfaction" },
  { icon: Cpu, value: "50", suffix: "+", label: "AI Integrations" },
  { icon: Code2, value: "5", suffix: "+", label: "Years Experience" },
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
    <section className="py-20 px-6 bg-zinc-900/50 relative overflow-hidden">
      <div className="absolute inset-0 noise" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20">
                <stat.icon className="w-7 h-7 text-violet-400" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
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
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 group-hover:from-violet-600/5 group-hover:to-purple-600/5 transition-all duration-500" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300 mb-4">
                  <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
