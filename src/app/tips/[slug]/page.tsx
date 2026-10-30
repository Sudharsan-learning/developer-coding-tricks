import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import { AdSlot, ContactLinks } from "@/components/Chrome";
import { diffStat, formatDate, getPost, getPosts, site, topicLabel } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.sub} Tested before-and-after code.`,
    alternates: { canonical: `/tips/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.sub, publishedTime: p.date },
  };
}

export default async function TipPage({ params }: Props) {
  const posts = getPosts();
  const p = getPost((await params).slug);
  if (!p) notFound();
  const idx = posts.findIndex((x) => x.slug === p.slug);
  const newer = posts[idx - 1];
  const older = posts[idx + 1];
  const { removed, added } = diffStat(p);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "TechArticle", headline: p.title, description: p.sub,
    datePublished: p.date, author: { "@type": "Person", name: site.name, url: site.url },
    image: `${site.url}/tips/${p.slug}/slide-1.jpg`, mainEntityOfPage: `${site.url}/tips/${p.slug}`,
  };

  return (
    <article className="wrap article page-top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="article-head">
        <p className="article-meta">
          <Link href="/tips">{p.series ?? topicLabel(p.topic)}</Link>
          <span aria-hidden="true">/</span>
          <time dateTime={p.date}>{formatDate(p.date)}</time>
          <span className="tip-stat" aria-label={`${removed} lines removed, ${added} added`}>
            {removed > 0 && <span className="del">−{removed}</span>}<span className="add">+{added}</span>
          </span>
        </p>
        <h1>{p.title}</h1>
        <p className="lede">{p.intro} {p.sub}</p>
      </header>

      {p.tricks.map((t, n) => (
        <section className="trick" key={n} aria-labelledby={`t${n}`}>
          <h2 id={`t${n}`}><span className="trick-n">{n + 1}</span>{t.title}</h2>
          <p className="trick-eyebrow">{t.eyebrow}</p>
          {t.before && <CodeBlock kind="before" sample={t.before} />}
          <CodeBlock kind="after" sample={t.after} />
          <p className="note" dangerouslySetInnerHTML={{ __html: t.note }} />
        </section>
      ))}

      <AdSlot />

      {p.slides > 0 && (
        <section className="carousel" aria-labelledby="carousel-h">
          <h2 id="carousel-h">The Instagram carousel</h2>
          <div className="strip" tabIndex={0} aria-label="Carousel slides, scroll sideways">
            {Array.from({ length: p.slides }, (_, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={`/tips/${p.slug}/slide-${i + 1}.jpg`} alt={i === 0 ? p.alt : `Slide ${i + 1} of ${p.slides}`} width={1080} height={1350} loading="lazy" />
            ))}
          </div>
          <a href={site.instagram} rel="noopener noreferrer" target="_blank" className="text-link">Follow {site.handle} for a new one every day</a>
        </section>
      )}

      {p.sources.length > 0 && (
        <section className="sources" aria-labelledby="src-h">
          <h2 id="src-h">Sources</h2>
          <ul>{p.sources.map((s) => <li key={s}><a href={s} rel="noopener noreferrer" target="_blank">{s.replace(/^https?:\/\//, "")}</a></li>)}</ul>
        </section>
      )}

      <aside className="hire-box">
        <div>
          <h2>Need this kind of work on your project?</h2>
          <p>I build web apps and CRM/API integrations for clients.</p>
        </div>
        <ContactLinks />
      </aside>

      <nav className="pager" aria-label="More tips">
        {older ? <Link href={`/tips/${older.slug}`} rel="prev"><span>Older</span>{older.title}</Link> : <span />}
        {newer ? <Link href={`/tips/${newer.slug}`} rel="next" className="right"><span>Newer</span>{newer.title}</Link> : <span />}
      </nav>
    </article>
  );
}
