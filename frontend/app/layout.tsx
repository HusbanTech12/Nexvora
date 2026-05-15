import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export const metadata: Metadata = {
  title:
    "HusbanTech - AI-Powered Web Development Agency | Premium Fullstack Solutions",
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
  ],
  openGraph: {
    title:
      "HusbanTech - AI-Powered Web Development Agency",
    description:
      "Build AI-powered web systems that help businesses grow faster and engage customers smarter.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      >
        <body className="min-h-screen bg-background text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}