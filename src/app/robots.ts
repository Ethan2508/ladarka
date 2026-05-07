import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/checkout", "/commande/"] },
    ],
    sitemap: "https://ladarka.fr/sitemap.xml",
    host: "https://ladarka.fr",
  };
}
