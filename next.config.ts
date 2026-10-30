import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";
const ads = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);

// Google AdSense loads scripts, frames and images from several Google hosts; only allow them when ads are on.
const AD_HOSTS = "https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com https://adservice.google.com";

// Next.js inlines small scripts for a static site, so script-src needs 'unsafe-inline'; nonces would force every page to render on demand.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${ads ? ` ${AD_HOSTS}` : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${ads ? " https:" : ""}`,
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}${ads ? ` ${AD_HOSTS}` : ""}`,
  `frame-src ${ads ? AD_HOSTS : "'none'"}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
