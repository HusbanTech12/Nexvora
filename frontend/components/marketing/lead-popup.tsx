"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const popupVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

interface LeadPopupProps {
  delay?: number; // Delay in ms before showing popup
}

export function LeadPopup({ delay = 30000 }: LeadPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("lead-popup-dismissed");
    if (dismissed) return;

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Remember dismissal for session
    localStorage.setItem("lead-popup-dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsVisible(false);
    localStorage.setItem("lead-popup-dismissed", "true");
  };

  // Don't render if dismissed
  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-8 right-8 w-80 glass rounded-2xl border border-zinc-800 p-6 z-50 shadow-2xl shadow-teal-400/20"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-teal-300 font-medium">AI-Powered Insights</span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-white mb-2">
              Get Your Free AI Strategy Guide
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Learn how businesses increase conversions by 40% with AI-powered web systems.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-teal-400 focus:outline-none transition-colors"
              />
              <Button type="submit" className="w-full">
                Get Free Guide
              </Button>
            </form>

            {/* Trust */}
            <p className="text-xs text-zinc-500 mt-3 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}