"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: "$499",
    yearlyPrice: "$4,999",
    monthlyRange: "$499 – $999",
    yearlyRange: "$4,999 – $9,999",
    description: "Perfect for small businesses looking to establish their online presence.",
    icon: Sparkles,
    popular: false,
    features: [
      "Responsive Business Website",
      "Premium UI/UX Design",
      "Contact Forms",
      "Basic SEO Setup",
      "WhatsApp Integration",
      "1 Month Support",
      "Deployment Included",
    ],
    cta: "Get Started",
  },
  {
    name: "Growth",
    monthlyPrice: "$1,500",
    yearlyPrice: "$14,999",
    monthlyRange: "$1,500 – $3,000",
    yearlyRange: "$14,999 – $29,999",
    description: "Ideal for growing businesses needing a fullstack web application.",
    icon: Rocket,
    popular: true,
    features: [
      "Fullstack Web App",
      "Admin Dashboard",
      "AI Integration",
      "Lead Generation System",
      "Analytics Dashboard",
      "Email Integration",
      "3 Months Support",
      "Custom Domain",
      "API Development",
    ],
    cta: "Start Growing",
  },
  {
    name: "Premium",
    monthlyPrice: "$3,000+",
    yearlyPrice: "$29,999+",
    monthlyRange: "$3,000 – $8,000+",
    yearlyRange: "$29,999 – $79,999+",
    description: "For serious businesses and startups requiring advanced AI systems.",
    icon: Crown,
    popular: false,
    features: [
      "Advanced AI Systems",
      "Custom Dashboards",
      "Scalable Architecture",
      "Premium UI Systems",
      "Analytics Platform",
      "Priority Support",
      "6 Months Support",
      "White-label Rights",
      "Custom Integrations",
      "Advanced Security",
    ],
    cta: "Contact Us",
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

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 px-6 bg-zinc-900/30 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-300 text-sm mb-4 border border-teal-400/20">
            <Crown className="w-4 h-4" />
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            Transparent pricing with no hidden costs
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-zinc-800/50 rounded-full p-1.5 border border-zinc-700/50">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isYearly ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {!isYearly && (
                <motion.div
                  layoutId="billing-bg"
                  className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isYearly ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {isYearly && (
                <motion.div
                  layoutId="billing-bg"
                  className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 ml-1.5 text-[10px] text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative group glass rounded-2xl p-8 transition-all duration-500 flex flex-col ${
                plan.popular
                  ? "border-teal-400 shadow-xl shadow-teal-400/20 scale-[1.02] md:scale-105"
                  : "hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-400/10"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-medium shadow-lg shadow-teal-400/30">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Icon & Name */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg shadow-teal-400/20"
                        : "bg-zinc-800 group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-emerald-500"
                    }`}
                  >
                    <plan.icon
                      className={`w-5 h-5 transition-colors ${
                        plan.popular ? "text-white" : "text-zinc-400 group-hover:text-white"
                      }`}
                    />
                  </div>
                  <span className="text-lg font-semibold text-white">
                    {plan.name}
                  </span>
                </div>
                {plan.popular && (
                  <Zap className="w-4 h-4 text-teal-300" />
                )}
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">
                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-zinc-500 text-sm ml-2">
                  {isYearly ? plan.yearlyRange : plan.monthlyRange}
                </span>
              </div>

              {isYearly && (
                <div className="text-xs text-green-400 mb-4">
                  Billed annually — save ~20%
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-zinc-400 mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="p-0.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full group"
              >
                {plan.cta}
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-zinc-500 mt-12"
        >
          All plans include a free consultation. Prices may vary based on project
          requirements.
        </motion.p>
      </div>
    </section>
  );
}
