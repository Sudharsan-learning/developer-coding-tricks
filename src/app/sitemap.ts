import type { MetadataRoute } from "next";
import { getPublished, site } from "@/lib/posts";

// Only published tips are listed; scheduled ones join on their date via the daily rebuild.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublished();
  return [
    { url: site.url, lastModified: posts[0]?.date, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/tips`, lastModified: posts[0]?.date, changeFrequency: "daily", priority: 0.9 },
    ...posts.map((p) => ({
      url: `${site.url}/tips/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: Array.from({ length: p.slides }, (_, i) => `${site.url}/tips/${p.slug}/slide-${i + 1}.jpg`),
    })),
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
