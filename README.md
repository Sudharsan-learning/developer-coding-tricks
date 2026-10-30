# developer-coding-tricks

Website for [@developer_coding_tricks](https://www.instagram.com/developer_coding_tricks/): every before-and-after
trick from the Instagram page as a searchable, copyable page, plus Sudharsan A's freelance portfolio.

**Stack:** Next.js 16 (App Router, fully static), React 19, TypeScript, Shiki (build-time syntax highlighting),
self-hosted Bricolage Grotesque + Fira Code. No client JS except the hero diff, tip search, and copy buttons.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; every page is pre-rendered
```

## Content

- `content/site.json`: name, contact links (`email`, `whatsapp` as country code + number, e.g. `919876543210`, `linkedin`), services, projects.
  Empty values are hidden automatically.
- `content/posts/<slug>.json`: one file per tip, exported from the Instagram pipeline (`export_to_next.py`).
- `public/tips/<slug>/slide-N.jpg`: the carousel images.

Adding a tip = add its JSON + slides and push. Vercel rebuilds on every push.

## Deploy (Vercel)

1. vercel.com/new → Import `Sudharsan-learning/developer-coding-tricks` → Framework: Next.js → Deploy.
2. Project name `developercodingtricks` gives `developercodingtricks.vercel.app`.
3. Optional: create a Deploy Hook and save it as the GitHub secret `VERCEL_DEPLOY_HOOK` (see `.github/workflows/daily-rebuild.yml`).

## Environment variables (Vercel)

| Name | What it does |
| --- | --- |
| `GOOGLE_SITE_VERIFICATION` | Search Console "HTML tag" code. Adds the verification meta tag. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-…` id. Turns on AdSense slots. Needs a custom domain first, so leave it unset on `vercel.app`. |

The site currently runs on `developercodingtricks.vercel.app` with no custom domain. See
[docs/deployment-checklist.md](docs/deployment-checklist.md) for Search Console setup and the full pre-deploy checklist,
and run `npm run audit:site -- <url>` to check SEO tags and security headers.

## SEO

Per-page metadata and canonical URLs, generated Open Graph images (`/tips/<slug>/opengraph-image`),
`sitemap.xml`, `robots.txt`, and JSON-LD (`WebSite`, `Person`, `TechArticle`).
