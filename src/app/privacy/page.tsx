import type { Metadata } from "next";
import { site } from "@/lib/posts";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <article className="wrap article page-top prose">
      <h1>Privacy policy</h1>
      <p>This site has no accounts and no forms, and it doesn’t collect personal data directly. If you email or message me, I use your details only to reply.</p>
      <p>The site may show ads from Google AdSense. Google and its partners may use cookies to show ads based on your visits to this and other websites. You can turn off personalised ads in <a href="https://adssettings.google.com" rel="noopener noreferrer">Google Ad Settings</a>.</p>
      <p>The site is hosted on Vercel, which may keep standard server logs, such as IP address and browser type, for security.</p>
      <p>Questions: <a href={`mailto:${site.email}`}>{site.email}</a></p>
    </article>
  );
}
