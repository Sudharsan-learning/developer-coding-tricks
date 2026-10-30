import Link from "next/link";
import HeroDiff, { type DiffDemo } from "@/components/HeroDiff";
import { TipRows } from "@/components/TipIndex";
import { AdSlot, ContactLinks } from "@/components/Chrome";
import { getPosts, site, toRows } from "@/lib/posts";
import { highlightLines } from "@/lib/highlight";

const EXT: Record<string, string> = { js: "js", jsx: "jsx", css: "css", html: "html", python: "py", bash: "sh" };

export default async function Home() {
  const posts = getPosts();
  const demos: DiffDemo[] = [];
  for (const p of posts) {
    for (const [n, t] of p.tricks.entries()) {
      if (!t.before || t.before.code.length > 7) continue;
      demos.push({
        slug: p.slug,
        file: `${p.slug.replace(/-/g, "_")}_${n + 1}.${EXT[t.after.lang] ?? "txt"}`,
        title: t.title,
        before: await highlightLines(t.before.code, t.before.lang),
        after: await highlightLines(t.after.code, t.after.lang),
      });
    }
  }
  demos.sort((a, b) => (b.before.length - b.after.length) - (a.before.length - a.after.length));
  const rows = toRows(posts);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: site.brand, url: site.url },
      { "@type": "Person", name: site.name, url: site.url, sameAs: [site.instagram, site.linkedin].filter(Boolean), jobTitle: "Software developer" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>Delete code you didn’t need to write.</h1>
            <p className="lede">
              Before-and-after tricks for JavaScript, React, Python, CSS and Git. Every snippet is run before it’s
              published. I’m {site.name.split(" ")[0]}, and I also build web apps and integrations for clients.
            </p>
            <div className="actions">
              <Link href="/tips" className="btn btn-primary">Browse the tips</Link>
              <Link href="/#hire" className="btn">Hire me</Link>
            </div>
            <p className="proof">{posts.length} tricks published so far, new ones every day on {site.handle}.</p>
          </div>
          {demos.length > 0 && <HeroDiff demos={demos} />}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="latest">
        <div className="section-head">
          <h2 id="latest">Latest tricks</h2>
          <Link href="/tips">See all {posts.length}</Link>
        </div>
        <TipRows rows={rows.slice(0, 5)} />
      </section>

      <AdSlot />

      <section className="wrap section" id="hire" aria-labelledby="hire-h">
        <h2 id="hire-h">Hire me for your next project</h2>
        <p className="section-lede">
          I take on freelance work alongside the page. Send a few lines about what you need, and I’ll reply with a
          plan, a timeline and a fixed quote.
        </p>
        <div className="services">
          {site.services.map((s) => (
            <article key={s.title} className="service">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul>{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
        {site.projects.length > 0 && (
          <div className="projects">
            <h3>Selected work</h3>
            {site.projects.map((p) => (
              <article key={p.title} className="project">
                <h4>{p.title}</h4>
                <p>{p.body}</p>
                {p.result && <p className="result">{p.result}</p>}
              </article>
            ))}
          </div>
        )}
        <ol className="steps" aria-label="How a project works">
          <li><strong>Tell me the problem</strong><span>A short message is enough to start.</span></li>
          <li><strong>Get a plan and quote</strong><span>Scope, timeline and price in writing before any work.</span></li>
          <li><strong>Review as it’s built</strong><span>Regular demos, then a clean handover with docs.</span></li>
        </ol>
      </section>

      <section className="wrap section" id="contact" aria-labelledby="contact-h">
        <div className="contact">
          <h2 id="contact-h">Have a project in mind?</h2>
          <p>Email works best, and I usually reply within a day.</p>
          <ContactLinks large />
        </div>
      </section>
    </>
  );
}
