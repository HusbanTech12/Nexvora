"use client";

import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero";
import { TrustSection } from "@/components/marketing/trust-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { FeaturesSection } from "@/components/marketing/features";
import { ServicesSection } from "@/components/marketing/services";
import { AboutSection } from "@/components/marketing/about";
import { PricingSection } from "@/components/marketing/pricing";
import { DashboardShowcaseSection } from "@/components/marketing/dashboard-showcase";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { FinalCTASection } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { AIAssistant } from "@/components/ai-assistant/chat";
import { ConsultationCTA } from "@/components/marketing/consultation-form";
import { WhatsAppCTA } from "@/components/marketing/whatsapp-cta";
import { LeadPopup } from "@/components/marketing/lead-popup";
import { ContactForm } from "@/components/marketing/contact-form";
import { JsonLd } from "@/components/shared/json-ld";
import { useState, useEffect } from "react";

export default function Home() {
  const [showContact, setShowContact] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);

  // Listen for contact form trigger from navbar
  useEffect(() => {
    const handleOpenContact = () => setShowContact(true);
    const handleOpenConsultation = () => setShowConsultation(true);
    window.addEventListener("open-contact-form", handleOpenContact);
    window.addEventListener("open-consultation", handleOpenConsultation);
    return () => {
      window.removeEventListener("open-contact-form", handleOpenContact);
      window.removeEventListener("open-consultation", handleOpenConsultation);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <JsonLd />
      <Navbar />
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ServicesSection />
      <AboutSection />
      <PricingSection />
      <DashboardShowcaseSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />

      {/* Interactive Components */}
      <AIAssistant />
      <ConsultationCTA isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
      <WhatsAppCTA />
      <LeadPopup delay={30000} />
      <ContactForm isOpen={showContact} onClose={() => setShowContact(false)} />
    </main>
  );
}