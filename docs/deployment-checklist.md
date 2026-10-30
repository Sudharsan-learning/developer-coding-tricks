# Deployment checklist

Run through this before every deploy that changes code, and after the first deploy to a new domain.
Items marked **(auto)** are checked by `npm run audit:site`.

## 1. Before you push

- [ ] `npm run lint` passes (TypeScript, no errors).
- [ ] `npm run build` passes and every page is listed as static (○ or ●).
- [ ] `npm audit --omit=dev` reports 0 vulnerabilities. Fix or upgrade anything high or critical before deploying.
- [ ] Run the production build locally and audit it:
  ```bash
  npm run build && npx next start -p 3100
  npm run audit:site -- http://localhost:3100
  ```
- [ ] Open the site in the browser at phone width (375px) and desktop width. No sideways scrolling, nothing overlapping.
- [ ] Open the browser console on the home page and one tip page: no red errors, and no "Refused to load" messages from the Content Security Policy.
- [ ] No secrets in the code: `git grep -nE "sk-|api[_-]?key|secret|password"` finds nothing real. Secrets go in Vercel environment variables, never in `content/` or `src/`.
- [ ] Personal data check: no phone number, home address or private email in `content/`, `public/` or a PDF you added.

## 2. Content

- [ ] Each new tip in `content/posts/` has a unique `slug`, a `date`, `alt` text for the slides, and its slide images in `public/tips/<slug>/`.
- [ ] Every code snippet was run before publishing (the site promises this).
- [ ] Trick notes use only `<b>`, `<i>`, `<em>`, `<strong>` or `<code>`; any other tag is shown as plain text.
- [ ] `content/site.json`: links work, `available` is correct, and the skills match the project tags you want filterable.

## 3. SEO (each page)

- [ ] **(auto)** One `<h1>` per page.
- [ ] **(auto)** `<title>` is 30–65 characters and unique across the site.
- [ ] **(auto)** Meta description is 70–170 characters.
- [ ] **(auto)** Canonical URL, `og:title`, `og:description`, `og:image` and `twitter:card` are present.
- [ ] **(auto)** Every image has `alt` text.
- [ ] **(auto)** Structured data (JSON-LD) parses. Spot-check one tip page in Google's Rich Results Test: https://search.google.com/test/rich-results
- [ ] **(auto)** `robots.txt` points to the sitemap, and the sitemap contains no `noindex` pages.
- [ ] Scheduled tips (dated after today) are `noindex` and missing from the sitemap until their date. The daily rebuild workflow publishes them.

## 4. Security

- [ ] **(auto)** These headers are on every page: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. They are set in `next.config.ts`.
- [ ] **(auto)** No `X-Powered-By` header.
- [ ] **(auto)** Links that open a new tab use `rel="noopener noreferrer"`.
- [ ] If you add a new third-party script, font, image host or embed, add its host to the CSP in `next.config.ts`, or the browser will block it.
- [ ] After deploying, check the live headers at https://securityheaders.com (aim for grade A).
- [ ] Vercel project: only people who need it have access, and two-factor login is on for your Vercel and GitHub accounts.

## 5. Performance (Core Web Vitals)

- [ ] Run PageSpeed Insights on the home page and one tip page: https://pagespeed.web.dev
- [ ] Targets on mobile: LCP under 2.5 s, CLS under 0.1, INP under 200 ms, Performance score 90+.
- [ ] New images are compressed (JPG/WebP, slides under about 200 KB each) and have `width` and `height` set.

## 6. Deploy

- [ ] Push to `main`; Vercel builds and deploys it.
- [ ] Watch the Vercel build log for warnings.
- [ ] Audit the live site:
  ```bash
  npm run audit:site -- https://developercodingtricks.vercel.app
  ```
- [ ] Open the live site once in a private window: the logo loader plays, the search palette opens with Ctrl K, and the brief builder opens your mail app.

## 7. One-time setup

- [ ] Add the GitHub secret `VERCEL_DEPLOY_HOOK` so the daily rebuild publishes scheduled tips (see `.github/workflows/daily-rebuild.yml`).
The site runs on `https://developercodingtricks.vercel.app` for now, with no custom domain. That address is already the `url` in `content/site.json`, so canonical URLs, the sitemap and social previews all point to it.

- [ ] In Vercel, confirm the project's production domain is exactly `developercodingtricks.vercel.app`. If Vercel gave it a different name, change `url` in `content/site.json` to match.
- [ ] Google Search Console (https://search.google.com/search-console):
  1. Add property, choose **URL prefix**, and enter `https://developercodingtricks.vercel.app/`. (The "Domain" option needs DNS access, which a `vercel.app` address doesn't give you.)
  2. Pick the **HTML tag** method and copy only the code inside `content="..."`.
  3. In Vercel → Project → Settings → Environment Variables, add `GOOGLE_SITE_VERIFICATION` with that code (Production), then redeploy.
  4. Click Verify in Search Console, then go to Sitemaps and submit `sitemap.xml`.
- [ ] Bing Webmaster Tools (https://www.bing.com/webmasters): choose "Import from Google Search Console" once Google is verified.
- [ ] AdSense: leave it off for now. Google only approves sites on a domain you own, not a `vercel.app` address.

### Later, when you buy a custom domain

- [ ] Add it in Vercel → Project → Settings → Domains, and set it as the primary domain so the `vercel.app` address redirects to it.
- [ ] Change `url` in `content/site.json` to the new domain and redeploy.
- [ ] Add the new domain to Search Console (the "Domain" property now works) and submit the sitemap again.
- [ ] If you turn on AdSense, set `NEXT_PUBLIC_ADSENSE_CLIENT` in Vercel and redeploy. The CSP opens up for Google's ad hosts automatically. Visitors from the EU and UK also need a consent banner from a Google-certified consent tool.

## 8. After launch (monthly)

- [ ] Search Console: fix any pages listed under "Not indexed" or "Core Web Vitals: poor".
- [ ] `npm outdated` and `npm audit`: update Next.js and React when security releases come out.
- [ ] Re-run `npm run audit:site` against the live site.
