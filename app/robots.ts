import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/onboarding/"],
      },
    ],
    sitemap: "https://ileilao.com/sitemap.xml",
    host: "https://ileilao.com",
  };
}
