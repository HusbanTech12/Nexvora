"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Our new website generated 3x more leads in the first month. The AI assistant alone converted 40% of visitors into qualified leads.",
    author: "Sarah Mitchell",
    role: "CEO, TechStart Inc.",
    rating: 5,
  },
  {
    quote:
      "HusbanTech delivered a stunning dashboard that our team actually uses. The analytics helped us double our conversion rate.",
    author: "James Chen",
    role: "Founder, GrowthLabs",
    rating: 5,
  },
  {
    quote:
      "The AI integration transformed our customer support. We're now handling 10x the inquiries with the same team.",
    author: "Maria Rodriguez",
    role: "Director, EcomFlow",
    rating: 5,
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

export function TestimonialsSection() {
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
            <Star className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Real results from real businesses we've helped grow
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              variants={itemVariants}
              className="glass rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-violet-500/50" />
              </div>

              {/* Quote */}
              <p className="text-zinc-300 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div>
                <div className="font-semibold text-white">
                  {testimonial.author}
                </div>
                <div className="text-sm text-zinc-500">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}