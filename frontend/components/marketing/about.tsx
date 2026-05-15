"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, Heart, Users, Award, Globe } from "lucide-react";

const team = [
  {
    name: "Husban Ali",
    role: "Founder & CEO",
    description: "Fullstack developer with 5+ years building AI-powered web systems",
  },
  {
    name: "AI Team",
    role: "Machine Learning",
    description: "Specialists in AI integration and intelligent automation",
  },
  {
    name: "Dev Team",
    role: "Fullstack Engineers",
    description: "Expert developers in React, Next.js, and modern web technologies",
  },
];

const stats = [
  { label: "Projects Delivered", value: "50+", icon: Globe },
  { label: "Happy Clients", value: "30+", icon: Heart },
  { label: "Years Experience", value: "5+", icon: Award },
  { label: "AI Solutions", value: "20+", icon: Sparkles },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To help businesses grow faster through AI-powered web solutions that convert visitors into customers.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Premium quality, transparent communication, and client success are at the core of everything we do.",
  },
  {
    icon: Users,
    title: "Client Focus",
    description: "We treat every project like our own business, ensuring maximum ROI and sustainable growth.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 text-violet-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Building the Future of <span className="gradient-text">Web Development</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We are a team of passionate developers and AI specialists dedicated to creating premium digital experiences that drive business growth.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-6 text-center hover:border-violet-500/50 transition-colors"
            >
              <stat.icon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 mb-20 border border-violet-500/20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Story</h3>
              <div className="space-y-4 text-zinc-400">
                <p>
                  Founded in 2024, we started with a simple vision: to make AI-powered web development accessible to businesses of all sizes.
                </p>
                <p>
                  From our first project to now, we have helped over 30 businesses transform their online presence with custom web solutions, intelligent automation, and conversion-focused designs.
                </p>
                <p>
                  Today, we combine cutting-edge AI technology with modern web development to create digital experiences that not only look stunning but drive real business results.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl blur-xl" />
              <div className="relative glass-light rounded-xl p-6 border border-violet-500/30">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Nexvora</h4>
                  <p className="text-zinc-400 text-sm">AI-Powered Development Agency</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">What We Stand For</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:border-violet-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{value.title}</h4>
                <p className="text-sm text-zinc-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">Meet Our Team</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 text-center hover:border-violet-500/50 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">{member.name}</h4>
                <p className="text-sm text-violet-400 mb-2">{member.role}</p>
                <p className="text-sm text-zinc-400">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}