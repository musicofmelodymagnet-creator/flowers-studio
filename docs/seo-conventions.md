# SEO Conventions

## Site name signal

Google reads the site name shown in search results from (priority order): `WebSite.name` (JSON-LD) → `og:site_name` → homepage `<title>` → homepage `<h1>`. All three of the first signals are set **only on the homepage** (`index.html`):

- `WebSite.name`: `"FLORINSKY Flower Walls"`, `alternateName`: `"FLORINSKY"` — in the homepage's `@graph` JSON-LD.
- `<meta property="og:site_name" content="FLORINSKY Flower Walls">`
- Homepage `<title>` starts with `FLORINSKY Flower Walls |`.

Do not duplicate `og:site_name` or a second `WebSite` entity on any other page — Google applies the homepage signal to the whole domain.

## Brand in `<title>`

- Brand (`FLORINSKY`) appears in the `<title>` **only on the homepage**. Once the site-name signal is established, Google shows the brand as the second line in search results, so repeating it in every internal page's title wastes characters that could hold a differentiator.
- Exception: legal documents (`privacy-policy.html`, `terms-of-use.html`) keep `FLORINSKY Atelier` in the title — legal identification, not a ranking/CTR lever.
- `og:title` / `twitter:title` mirror `<title>` exactly on every page.

## Title length & separators

- Hard limit: **60 characters**, counted on the plain-text (unescaped) string — always verify with an actual character count, not by eye.
- One separator style per position: `—` (em dash) between a page's own H1-style label and its descriptor; `|` reserved for the homepage's brand/tagline split. Don't mix separator styles within a single title, and don't stack two separators back to back.
- Spend freed-up space (after dropping the brand suffix) on a real differentiator: a color synonym, a size range, "Real Touch," a count of cities served — not filler words.

## Brand spelling

Brand is written `FLORINSKY` (all caps) everywhere it appears as prose, in meta tags, in JSON-LD `name`/`author`/`publisher` values, and in image `alt` text. Lowercase `florinsky` is expected only inside URLs, the domain, email addresses, and file/handle names (e.g. `florinskyflowers` Instagram handle) — never in human-readable text.

## Schema entities (one each, homepage only)

- `LocalBusiness` (`@id: #business`) — the operating business: address, geo, hours, reviews, offer catalog.
- `Organization` (`@id: #organization`) — the brand: short `name: "FLORINSKY"`, `logo`, `sameAs`. Added specifically to make the real logo (not a product photo) eligible to replace the generic globe icon in search results.
- `WebSite` (`@id: #website`) — the site-name signal described above.

Internal pages that need to reference the business/brand/site in their own schema (Article `author`/`publisher`, Service `provider`, breadcrumb publisher, etc.) must link by `"@id": "https://florinsky.ca/#..."` rather than repeating a full inline copy of the entity. Exception: a page's `Service.provider` may keep a few redundant inline fields (`name`, `url`, `telephone`) alongside the `@id` so the page's schema is self-contained if crawled in isolation — that's a deliberate redundancy, not a duplicate declaration of a second entity.

## Logo file

Canonical logo URL: `https://florinsky.ca/assets/logo.png` (512×512, RGB, no transparency artifacts, from `Photos/Logo of FLORINSKY.jpg`). Use this — not a product/hero photo — for any `logo` field in schema. Favicon files (`assets/favicon*.png`, `assets/favicon.ico`) are a separate asset set for the browser-tab icon; don't reuse the word "favicon" in a `logo` field or vice versa.
