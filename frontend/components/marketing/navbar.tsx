"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { useUser, useAuth, SignOutButton } from "@clerk/nextjs";

const ADMIN_EMAILS = ["husbantech08@gmail.com"];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#", action: "contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
      setIsAdmin(email ? ADMIN_EMAILS.includes(email) : false);
    }
  }, [isSignedIn, user]);

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.action === "contact") {
      window.dispatchEvent(new CustomEvent("open-contact-form"));
    } else if (link.href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link.href && link.href.length > 1) {
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-zinc-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo showText={false} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                {isAdmin && (
                  <a
                    href="/dashboard"
                    className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Dashboard
                  </a>
                )}
                <SignOutButton>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("user-signed-out"));
                    }}
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </SignOutButton>
                <Button size="sm" onClick={() => window.dispatchEvent(new CustomEvent("open-consultation"))}>
                  Book Consultation
                </Button>
              </>
            ) : (
              <>
                <a
                  href="/sign-in"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Sign In
                </a>
                <Button size="sm" onClick={() => window.dispatchEvent(new CustomEvent("open-consultation"))}>
                  Book Consultation
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-zinc-800"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2 text-left"
                  >
                    {link.label}
                  </button>
                ))}

                {isSignedIn ? (
                  <>
                    {isAdmin && (
                      <a
                        href="/dashboard"
                        className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors py-2"
                      >
                        Dashboard
                      </a>
                    )}
                    <SignOutButton>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent("user-signed-out"));
                        }}
                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2 text-left"
                      >
                        Sign Out
                      </button>
                    </SignOutButton>
                  </>
                ) : (
                  <a
                    href="/sign-in"
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2"
                  >
                    Sign In
                  </a>
                )}

                <Button className="mt-2" onClick={() => window.dispatchEvent(new CustomEvent("open-consultation"))}>Book Consultation</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
