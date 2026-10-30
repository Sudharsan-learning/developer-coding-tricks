import Link from "next/link";
import { getPosts, site, topicLabel } from "@/lib/posts";
import CommandPalette from "./CommandPalette";
import Logo from "./Logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-in">
        <Link href="/" className="logo" aria-label="Developer Coding Tricks, home">
          <Logo size={26} /> developer_coding_tricks
        </Link>
        <nav aria-label="Main">
          <Link href="/#about">About</Link>
          <Link href="/#experience" className="nav-wide">Experience</Link>
          <Link href="/tips">Tips</Link>
          <Link href="/#hire">Hire me</Link>
          <CommandPalette
            tips={getPosts().map((p) => ({ slug: p.slug, title: p.title, sub: p.sub, topic: p.series ?? topicLabel(p.topic) }))}
            email={site.email}
            links={[["LinkedIn", site.linkedin], ["GitHub", site.github], ["Instagram", site.instagram]].filter(([, h]) => h).map(([label, href]) => ({ label, href }))}
          />
          <Link href="/#contact" className="btn btn-sm">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export function ContactLinks({ large = false }: { large?: boolean }) {
  const cls = large ? "btn" : "btn btn-sm";
  return (
    <div className="contact-links">
      {site.email && (
        <a className={`${cls} btn-primary`} href={`mailto:${site.email}?subject=Project%20enquiry`}>Email me</a>
      )}
      {site.whatsapp && (
        <a className={cls} href={`https://wa.me/${site.whatsapp}`} rel="noopener noreferrer" target="_blank">WhatsApp</a>
      )}
      {site.linkedin && (
        <a className={cls} href={site.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn</a>
      )}
      {site.github && (
        <a className={cls} href={site.github} rel="noopener noreferrer" target="_blank">GitHub</a>
      )}
      {site.instagram && (
        <a className={cls} href={site.instagram} rel="noopener noreferrer" target="_blank">Message on Instagram</a>
      )}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-in">
        <p>
          © {new Date().getFullYear()} {site.name}. Software developer and freelancer. Tips are free to use in your own code.
        </p>
        <nav aria-label="Footer">
          <Link href="/#about">About</Link>
          <Link href="/tips">All tips</Link>
          <a href={`mailto:${site.email}`}>Email</a>
          <a href={site.instagram} rel="noopener noreferrer" target="_blank">Instagram</a>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}

export function AdSlot() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;
  return (
    <aside className="ad-slot" aria-label="Advertisement">
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-format="auto" data-full-width-responsive="true" />
      <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle=window.adsbygoogle||[]).push({});" }} />
    </aside>
  );
}
