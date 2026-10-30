import type { MetadataRoute } from "next";
import { site } from "@/lib/posts";

// Everything is public. /_next/ stays crawlable because Google needs the CSS and JS to render pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
