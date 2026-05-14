"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$499",
    priceRange: "$499 – $999",
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
    price: "$1,500",
    priceRange: "$1,500 – $3,000",
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
    price: "$3,000+",
    priceRange: "$3,000 – $8,000+",
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
  return (
    <section id="pricing" className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 text-violet-400 text-sm mb-4">
            <Crown className="w-4 h-4" />
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Transparent pricing with no hidden costs
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative group glass rounded-2xl p-8 transition-all duration-300 flex flex-col ${
                plan.popular
                  ? "border-violet-500 shadow-xl shadow-violet-500/20"
                  : "hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-purple-600"
                      : "bg-zinc-800"
                  }`}
                >
                  <plan.icon
                    className={`w-5 h-5 ${
                      plan.popular ? "text-white" : "text-zinc-400"
                    }`}
                  />
                </div>
                <span className="text-lg font-semibold text-white">
                  {plan.name}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm ml-2">
                  {plan.priceRange}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                {plan.cta}
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