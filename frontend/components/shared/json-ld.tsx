import Script from "next/script";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nexvora",
    url: "https://nexvora.ai",
    logo: "https://nexvora.ai/logo.png",
    description:
      "AI-powered web development agency building premium fullstack solutions with intelligent lead generation.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [],
    makesOffer: [
      {
        "@type": "Offer",
        name: "Starter Package",
        price: "499",
        priceCurrency: "USD",
        description:
          "Responsive business website with premium UI/UX, contact forms, deployment, and WhatsApp integration.",
      },
      {
        "@type": "Offer",
        name: "Growth Package",
        price: "1500",
        priceCurrency: "USD",
        description:
          "Fullstack web app with admin dashboard, AI integration, lead generation system, and analytics.",
      },
      {
        "@type": "Offer",
        name: "Premium Package",
        price: "3000",
        priceCurrency: "USD",
        description:
          "Advanced AI systems, custom dashboards, scalable architecture, premium UI, and analytics platform.",
      },
    ],
  };

  return (
    <Script
      id="json-ld-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
