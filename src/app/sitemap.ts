import type { MetadataRoute } from "next";
import { getPosts, site } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: site.url, lastModified: posts[0]?.date, priority: 1 },
    { url: `${site.url}/tips`, lastModified: posts[0]?.date, priority: 0.9 },
    ...posts.map((p) => ({ url: `${site.url}/tips/${p.slug}`, lastModified: p.date, priority: 0.8 })),
    { url: `${site.url}/privacy`, priority: 0.2 },
  ];
}
