import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/500.css";
import "@fontsource/fira-code/700.css";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import Logo from "@/components/Logo";
import Spotlight from "@/components/Spotlight";
import { site } from "@/lib/posts";

const BOOT_SCRIPT = `try{if(sessionStorage.getItem("dct-boot"))document.documentElement.classList.add("booted");else sessionStorage.setItem("dct-boot","1")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}, React and Freshworks developer in Chennai`, template: `%s | ${site.brand}` },
  description: `Daily tested coding tricks for developers, plus freelance websites, React and Freshworks apps, AI automations and API integrations by ${site.name}.`,
  applicationName: site.brand,
  creator: site.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false, email: false, address: false },
  authors: [{ name: site.name, url: site.url }],
  openGraph: { type: "website", siteName: site.brand, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  // Google Search Console's "HTML tag" method: set GOOGLE_SITE_VERIFICATION in Vercel to the code from the tag.
  ...(process.env.GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }),
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ads = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Show the logo loader once per visit: later page loads in the same tab skip it. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {ads ? (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads}`} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body>
        <div className="boot" aria-hidden="true">
          <div className="boot-in">
            <Logo size={104} draw />
            <p className="boot-word">developer_coding_tricks</p>
            <span className="boot-bar"><i /></span>
          </div>
        </div>
        <a href="#main" className="skip">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Spotlight />
      </body>
    </html>
  );
}
