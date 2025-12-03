import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://chat.babacreates.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/chat/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
