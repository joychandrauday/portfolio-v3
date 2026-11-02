import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/ops/", "/ops/"],
    },
    sitemap: "https://joychandrauday.vercel.app/sitemap.xml",
  };
}
