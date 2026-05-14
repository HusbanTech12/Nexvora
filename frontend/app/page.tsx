import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero";
import { TrustSection } from "@/components/marketing/trust-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { FeaturesSection } from "@/components/marketing/features";
import { ServicesSection } from "@/components/marketing/services";
import { PricingSection } from "@/components/marketing/pricing";
import { DashboardShowcaseSection } from "@/components/marketing/dashboard-showcase";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { FinalCTASection } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { AIAssistant } from "@/components/ai-assistant/chat";
import { ConsultationCTA } from "@/components/marketing/consultation-form";
import { WhatsAppCTA } from "@/components/marketing/whatsapp-cta";
import { LeadPopup } from "@/components/marketing/lead-popup";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ServicesSection />
      <PricingSection />
      <DashboardShowcaseSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />

      {/* Interactive Components */}
      <AIAssistant />
      <ConsultationCTA />
      <WhatsAppCTA />
      <LeadPopup delay={30000} />
    </main>
  );
}