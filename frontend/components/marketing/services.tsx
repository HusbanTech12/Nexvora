"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Globe, Cpu, Target, BarChart3, ArrowRight, Check } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Fullstack Web Development",
    description:
      "End-to-end development for business websites, SaaS platforms, dashboards, and admin systems.",
    items: [
      "Business Websites",
      "SaaS Platforms",
      "Admin Dashboards",
      "E-commerce Solutions",
      "API Development",
    ],
    cta: "Build Your Website",
  },
  {
    icon: Cpu,
    title: "AI Systems Integration",
    description:
      "Intelligent AI assistants, RAG chatbots, and automation for enhanced user experiences.",
    items: [
      "AI Assistants",
      "RAG Chatbots",
      "Voice AI",
      "Automation",
      "Smart Workflows",
    ],
    cta: "Integrate AI",
  },
  {
    icon: Target,
    title: "Lead Generation Systems",
    description:
      "Smart CTAs, lead capture, consultation booking, and conversion optimization.",
    items: [
      "Smart CTAs",
      "Lead Capture Forms",
      "Consultation Booking",
      "Email Automation",
      "WhatsApp Integration",
    ],
    cta: "Boost Conversions",
  },
  {
    icon: BarChart3,
    title: "Dashboard Systems",
    description:
      "Analytics dashboards, reporting interfaces, and business intelligence tools.",
    items: [
      "Analytics Dashboards",
      "Lead Management",
      "Reporting Systems",
      "Data Visualization",
      "Real-time Updates",
    ],
    cta: "View Analytics",
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

export function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-300 text-sm mb-4">
            <Cpu className="w-4 h-4" />
            Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Comprehensive solutions for your digital transformation
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-400/10"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-400/30 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{service.description}</p>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-6">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-teal-300" />
                    </div>
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button variant="outline" className="w-full group-hover:bg-teal-500 group-hover:border-teal-500">
                {service.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}