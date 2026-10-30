import type { MetadataRoute } from "next";
import { site } from "@/lib/posts";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.brand,
    short_name: "Dev Tricks",
    description: "Tested before-and-after coding tricks, plus freelance web and AI work.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
