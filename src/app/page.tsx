import Link from "next/link";
import HeroDiff, { type DiffDemo } from "@/components/HeroDiff";
import { TipRows } from "@/components/TipIndex";
import { AdSlot } from "@/components/Chrome";
import Circuit from "@/components/Circuit";
import CopyEmail from "@/components/CopyEmail";
import ProjectBrief from "@/components/ProjectBrief";
import WorkExplorer from "@/components/WorkExplorer";
import { diffStat, getPosts, getPublished, site, toRows } from "@/lib/posts";
import { highlightLines } from "@/lib/highlight";
import { jsonLd as toJsonLd } from "@/lib/safe";

const EXT: Record<string, string> = { js: "js", jsx: "jsx", css: "css", html: "html", python: "py", bash: "sh" };
const HEADLINE = "I help developers write less code.";

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

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
  const published = getPublished();
  const deleted = published.reduce((sum, p) => sum + diffStat(p).removed, 0);
  const first = site.name.split(" ")[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.brand, url: site.url, inLanguage: "en-IN", publisher: { "@id": `${site.url}/#person` } },
      { "@type": "ProfilePage", url: site.url, mainEntity: { "@id": `${site.url}/#person` } },
      {
        "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: site.url, email: site.email, jobTitle: site.role,
        ...(site.location && { address: { "@type": "PostalAddress", addressLocality: site.location.split(",")[0], addressCountry: "IN" } }),
        knowsAbout: site.skills.flatMap((g) => g.items),
        ...(site.experience[0] && { worksFor: { "@type": "Organization", name: site.experience[0].company } }),
        ...(site.education && { alumniOf: { "@type": "CollegeOrUniversity", name: site.education.school } }),
        sameAs: [site.instagram, site.linkedin, site.github].filter(Boolean),
      },
    ],
  };
  const channels = [
    site.linkedin && { label: "LinkedIn", value: bare(site.linkedin), href: site.linkedin },
    site.github && { label: "GitHub", value: bare(site.github), href: site.github },
    site.instagram && { label: "Instagram", value: site.handle, href: site.instagram },
    site.whatsapp && { label: "WhatsApp", value: `+${site.whatsapp}`, href: `https://wa.me/${site.whatsapp}` },
  ].filter((c): c is { label: string; value: string; href: string } => Boolean(c));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />
      <section className="hero spot">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="kicker">
              <span className="logo-prompt" aria-hidden="true">$</span> whoami
              <span className="kicker-out">{site.name}, {site.roleShort}{site.location ? `, ${site.location}` : ""}</span>
            </p>
            <h1 aria-label={HEADLINE}>
              {HEADLINE.split(" ").map((w, i) => (
                <span key={i} className="w" aria-hidden="true" style={{ "--i": i } as React.CSSProperties}>{w}</span>
              ))}
            </h1>
            <p className="lede rise">
              Hi, I’m {first}. Every day I post one tested trick that swaps a block of code for the line the platform
              already gives you. By day I’m a senior engineer building websites, React and Freshworks apps, and AI automations with Claude.
            </p>
            <div className="actions rise">
              <Link href="/#hire" className="btn btn-primary">Hire me</Link>
              <Link href="/tips" className="btn">Browse the tips</Link>
              {site.resume && <a href={site.resume} className="btn" download>Download résumé</a>}
            </div>
            {site.available && <p className="status rise"><span className="dot" aria-hidden="true" />Available for freelance projects</p>}
          </div>
          {demos.length > 0 && <HeroDiff demos={demos} />}
        </div>
      </section>

      <div className="wrap board">
        <Circuit />

        <section className="section about" id="about" aria-labelledby="about-h">
          <div className="about-copy">
            <h2 id="about-h" className="node-h">About me</h2>
            {site.bio.map((b) => <p key={b}>{b}</p>)}
          </div>
          <dl className="stats">
            {site.stats.map((s) => <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>)}
            {deleted > 0
              ? <div><dd className="del">−{deleted}</dd><dt>Lines deleted in the tips</dt></div>
              : <div><dd>{published.reduce((sum, p) => sum + p.tricks.length, 0)}</dd><dt>Tricks shared on Instagram</dt></div>}
          </dl>
        </section>

        <section className="section" id="tips" aria-labelledby="latest">
          <div className="section-head">
            <h2 id="latest" className="node-h">Latest tricks</h2>
            <Link href="/tips">See all {posts.length}</Link>
          </div>
          <p className="section-lede section-lede-tight">
            Free, copyable and tested. A new one every day on <a href={site.instagram} rel="noopener noreferrer" target="_blank">{site.handle}</a>.
          </p>
          <TipRows rows={toRows(published.slice(0, 5))} />
        </section>

        {site.experience.length > 0 && (
          <section className="section" id="experience" aria-labelledby="exp-h">
            <div className="section-head">
              <h2 id="exp-h" className="node-h">Where I’ve worked</h2>
              {site.resume && <a href={site.resume} download>Download résumé (PDF)</a>}
            </div>
            <ol className="jobs">
              {site.experience.map((j) => (
                <li key={j.company + j.start} className="job">
                  <p className="job-when">{j.start} – {j.end}</p>
                  <div>
                    <h3>{j.role}</h3>
                    <p className="job-at">{j.company}, {j.location}</p>
                    <ul>{j.points.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                </li>
              ))}
            </ol>
            <dl className="facts">
              {site.education && (
                <div><dt>Education</dt><dd>{site.education.degree}<span>{site.education.school}, {site.education.years}</span></dd></div>
              )}
              {site.achievements.map((a) => <div key={a.title}><dt>Recognition</dt><dd>{a.title}<span>{a.detail}</span></dd></div>)}
              {site.languages.length > 0 && <div><dt>Languages</dt><dd>{site.languages.join(", ")}</dd></div>}
            </dl>
          </section>
        )}

        {site.projects.length > 0 && (
          <section className="section" id="projects" aria-labelledby="proj-h">
            <h2 id="proj-h" className="node-h">Selected work</h2>
            <p className="section-lede">A selection of projects I’ve built, with client details left out. Pick a skill to see where I used it.</p>
            <WorkExplorer skills={site.skills} projects={site.projects} />
          </section>
        )}

        <AdSlot />

        <section className="section" id="hire" aria-labelledby="hire-h">
          <h2 id="hire-h" className="node-h">Hire me for your next project</h2>
          <p className="section-lede">
            Five years of shipping client-facing apps and integrations, now available for your project. Tell me what
            you need, and I’ll reply with a plan, a timeline and a fixed quote.
          </p>
          <div className="services">
            {site.services.map((s) => (
              <article key={s.title} className="service spot">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
          </div>
          <ol className="steps" aria-label="How a project works">
            <li><strong>Tell me the problem</strong><span>A short message is enough to start.</span></li>
            <li><strong>Get a plan and quote</strong><span>Scope, timeline and price in writing before any work.</span></li>
            <li><strong>Review as it’s built</strong><span>Regular demos, then a clean handover with docs.</span></li>
          </ol>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-h">
          <div className="contact">
            <div className="contact-top">
            <div>
              <h2 id="contact-h" className="node-h">Have a project in mind?</h2>
              <p>Pick what you need below and I’ll get a ready-made email, or just copy my address. Email works best, and I usually reply within a day.</p>
              {site.email && <CopyEmail email={site.email} />}
            </div>
            {channels.length > 0 && (
              <ul className="channels" aria-label="Other ways to reach me">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} rel="noopener noreferrer" target="_blank">
                      <span className="ch-label">{c.label}</span>
                      <span className="ch-value">{c.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            </div>
            {site.email && <ProjectBrief email={site.email} firstName={first} />}
          </div>
        </section>
      </div>
    </>
  );
}
