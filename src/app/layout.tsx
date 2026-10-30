import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/500.css";
import "@fontsource/fira-code/700.css";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { site } from "@/lib/posts";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.brand}: before-and-after dev tricks`, template: `%s | ${site.brand}` },
  description: "Before-and-after JavaScript, React, Python, CSS and Git tricks, every snippet tested. Plus freelance web apps and CRM/API integrations by Sudharsan A.",
  authors: [{ name: site.name, url: site.url }],
  openGraph: { type: "website", siteName: site.brand, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0D1117", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ads = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="en-IN">
      <head>
        {ads ? (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads}`} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
