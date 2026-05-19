import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexvora.ai";
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export const metadata: Metadata = {
  title: {
    default: "Nexvora - AI-Powered Web Development Agency | Premium Fullstack Solutions",
    template: "%s | Nexvora",
  },
  description:
    "We build AI-powered websites that convert visitors into customers. Modern fullstack web systems with intelligent lead generation, premium UI/UX, and scalable architecture for growing businesses.",
  keywords: [
    "AI web development",
    "fullstack development",
    "SaaS development",
    "lead generation",
    "premium web design",
    "admin dashboard",
    "AI chatbot integration",
    "web development agency",
    "Dubai web development",
    "Saudi Arabia web development",
    "AI-powered websites",
  ],
  authors: [{ name: "Nexvora" }],
  creator: "Nexvora",
  publisher: "Nexvora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Nexvora",
    title: "Nexvora - AI-Powered Web Development Agency",
    description:
      "Build AI-powered web systems that help businesses grow faster, engage customers smarter, and create premium digital experiences.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Nexvora - AI-Powered Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexvora - AI-Powered Web Development Agency",
    description:
      "We build AI-powered websites that convert visitors into customers.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <html
        lang="en"
        className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      >
        <body className="min-h-screen bg-background text-foreground antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <html
        lang="en"
        className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      >
        <body className="min-h-screen bg-background text-foreground antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
