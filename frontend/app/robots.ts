import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexvora.ai";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/sign-in/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
