import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/menu";

const BASE = "https://ladarka.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/checkout`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/compte`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
  for (const p of PRODUCTS) {
    routes.push({
      url: `${BASE}/menu/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  return routes;
}
