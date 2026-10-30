// SEO and security audit for a running copy of the site.
// Usage: node scripts/audit-site.mjs [base-url]   (default http://localhost:3000)
// It reads /sitemap.xml, fetches every page, and exits with code 1 if any check fails.

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const fails = [];
const warns = [];
const fail = (page, msg) => fails.push(`${page}: ${msg}`);
const warn = (page, msg) => warns.push(`${page}: ${msg}`);

const REQUIRED_HEADERS = {
  "content-security-policy": (v) => v.includes("frame-ancestors 'none'") && v.includes("object-src 'none'"),
  "strict-transport-security": (v) => /max-age=\d{7,}/.test(v),
  "x-content-type-options": (v) => v === "nosniff",
  "x-frame-options": (v) => v === "DENY",
  "referrer-policy": (v) => v.length > 0,
  "permissions-policy": (v) => v.includes("camera=()"),
};

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1];
const metaContent = (html, key, by = "name") => {
  const tag = html.match(new RegExp(`<meta[^>]*${by}="${key}"[^>]*>`, "i"))?.[0];
  return tag ? attr(tag, "content") : undefined;
};

async function get(path) {
  const res = await fetch(base + path, { redirect: "manual" });
  return { res, text: await res.text() };
}

async function auditPage(path) {
  const { res, text: html } = await get(path);
  if (res.status !== 200) return fail(path, `status ${res.status}`);

  for (const [name, ok] of Object.entries(REQUIRED_HEADERS)) {
    const v = res.headers.get(name);
    if (!v) fail(path, `missing header ${name}`);
    else if (!ok(v)) fail(path, `weak header ${name}: ${v}`);
  }
  if (res.headers.get("x-powered-by")) fail(path, "x-powered-by header leaks the framework");

  if (!/<html[^>]*lang="[^"]+"/i.test(html)) fail(path, "<html> has no lang");
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
  if (!title) fail(path, "no <title>");
  else if (title.length > 65) warn(path, `title is ${title.length} chars (aim for 30-65): "${title}"`);
  else if (title.length < 15) warn(path, `title is short (${title.length} chars)`);

  const desc = metaContent(html, "description");
  if (!desc) fail(path, "no meta description");
  else if (desc.length < 70 || desc.length > 170) warn(path, `description is ${desc.length} chars (aim for 70-170)`);

  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0];
  if (!canonical) fail(path, "no canonical link");
  const robots = metaContent(html, "robots") ?? "";
  const noindex = robots.includes("noindex");

  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1s !== 1) fail(path, `has ${h1s} <h1> elements (want 1)`);
  for (const key of ["og:title", "og:description", "og:image"]) {
    if (!metaContent(html, key, "property")) fail(path, `missing ${key}`);
  }
  if (!metaContent(html, "twitter:card")) warn(path, "missing twitter:card");

  for (const img of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (attr(img, "alt") === undefined) fail(path, `image without alt: ${attr(img, "src")}`);
  }
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch { fail(path, "structured data (JSON-LD) does not parse"); }
  }
  for (const a of html.match(/<a\b[^>]*target="_blank"[^>]*>/gi) ?? []) {
    if (!/rel="[^"]*noopener/i.test(a)) fail(path, `target=_blank link without rel=noopener: ${attr(a, "href")}`);
  }
  return { path, title, noindex };
}

const robots = await get("/robots.txt");
if (robots.res.status !== 200 || !/Sitemap:/i.test(robots.text)) fail("/robots.txt", "missing or has no Sitemap line");

const sitemap = await get("/sitemap.xml");
if (sitemap.res.status !== 200) {
  fail("/sitemap.xml", `status ${sitemap.res.status}`);
} else {
  const paths = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const pages = [];
  for (const p of [...new Set(paths)]) pages.push(await auditPage(p));
  for (const pg of pages) if (pg?.noindex) fail(pg.path, "is in the sitemap but marked noindex");
  const titles = pages.filter(Boolean).map((p) => p.title);
  for (const t of new Set(titles)) if (titles.filter((x) => x === t).length > 1) fail("sitemap", `duplicate title "${t}"`);
  console.log(`Checked ${paths.length} pages from the sitemap at ${base}`);
}

const missing = await get("/this-page-does-not-exist");
if (missing.res.status !== 404) fail("/this-page-does-not-exist", `returned ${missing.res.status}, want 404`);

for (const w of warns) console.log(`WARN  ${w}`);
for (const f of fails) console.log(`FAIL  ${f}`);
console.log(fails.length ? `\n${fails.length} failed, ${warns.length} warnings` : `\nAll checks passed, ${warns.length} warnings`);
process.exit(fails.length ? 1 : 0);
