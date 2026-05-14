"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Code2, Sparkles, Target, Rocket, TrendingUp, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Business Discovery",
    description: "We analyze your goals, target audience, and competition to build a winning strategy.",
  },
  {
    icon: PenTool,
    title: "Strategy & Planning",
    description: "Creating detailed roadmaps with wireframes, technical specs, and timeline.",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    description: "Crafting premium interfaces that convert visitors into customers.",
  },
  {
    icon: Code2,
    title: "Fullstack Development",
    description: "Building robust applications with modern frameworks and best practices.",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    description: "Implementing intelligent features that enhance user experience.",
  },
  {
    icon: Target,
    title: "Lead Generation Setup",
    description: "Configuring smart CTAs, forms, and tracking systems.",
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "Launching to production with optimized performance.",
  },
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "Monitoring analytics and optimizing for better results.",
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 text-violet-400 text-sm mb-4">
            <CheckCircle className="w-4 h-4" />
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A proven workflow that delivers premium results every time
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connection Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px bg-gradient-to-r from-violet-500/50 to-transparent z-0" />
              )}

              <div className="glass rounded-2xl p-6 relative z-10 h-full hover:border-violet-500/50 transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800 mb-4 mt-2">
                  <step.icon className="w-6 h-6 text-violet-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}