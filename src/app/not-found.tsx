import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap section page-top">
      <h1 className="page-title"><span className="logo-prompt">$</span> 404: no such page</h1>
      <p className="section-lede">The link may be old, or the tip was renamed.</p>
      <Link href="/tips" className="btn btn-primary">Browse all tips</Link>
    </section>
  );
}
