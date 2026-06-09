## Goal

Transform the current AdSense Eligibility Checker into the full "AdSense Approval Checker" product. Keep the existing checker, AI analyzer, dashboard, and shadcn components; add the missing pages, a backend-powered blog/guides CMS, a real-data hybrid checker, dark/light theming, and DB-backed forms.

Because the spec is large, work ships in 3 phases. This plan covers **Phase 1**. Phases 2–3 are scoped at the end and shipped in follow-up turns.

---

## Phase 1 — Rebrand, theme, homepage, core new pages, backend

### 1. Rebrand + design system
- Update name to **AdSense✓Checker** everywhere (Header, footer, `index.html`, meta tags, `llms.txt`, `sitemap.xml`, JSON-LD).
- Replace current purple/violet palette with the new indigo (`#6366f1`) + cyan (`#06b6d4`) system as HSL semantic tokens in `src/index.css` and `tailwind.config.ts`. Add dark mode (default) and light mode token sets.
- Add Inter + Sora Google Fonts. Headings = Sora, body = Inter.
- Add `next-themes`-style theme provider (using `class` strategy on `<html>`) with localStorage persistence and a toggle in the Header.

### 2. Layout shell
- New `src/components/layout/Navbar.tsx` (sticky, backdrop-blur, Tools/Guides dropdowns, mobile drawer, theme toggle, "Analyze Site" CTA).
- New `src/components/layout/Footer.tsx` (4 columns, newsletter signup, social icons, legal links).
- `src/components/layout/SiteLayout.tsx` wraps every route.
- Retire current `Header.tsx` once Navbar is wired in.

### 3. Homepage rebuild (`/`)
Replace `Hero` + `InfoSection` with new sections in this order:
Hero (with trust stats + URL input) → How It Works (4 steps) → 47-Point Audit Categories (6 cards) → Live Result Demo → Why Choose Us → Tools Hub Preview → Blog Preview (pulls 3 latest posts from DB) → FAQ (accordion, 8 items) → Testimonials → CTA Banner → Footer.
Reuse existing `CheckResults` and `AIContentAnalyzer` for the live results section (already integrated).

### 4. New routes (Phase 1 set)
| Path | Purpose |
| --- | --- |
| `/` | Homepage (above) |
| `/tools` | Tools hub grid |
| `/tools/adsense-revenue-calculator` | Revenue calculator with sliders + bar chart |
| `/tools/policy-page-generator` | Tabbed Privacy / Terms / Disclaimer / Cookie / About / Contact generator |
| `/tools/seo-checklist` | Interactive 30-point checklist (localStorage) |
| `/about` | About page |
| `/contact` | Contact form (writes to `contact_submissions`) |
| `/privacy-policy`, `/terms-of-service`, `/disclaimer` | Static legal pages |
| `/sitemap` | HTML sitemap |

Existing `/resources` redirects to `/guides`; `/dashboard` stays.

### 5. Backend (Lovable Cloud)
Single migration creates four tables, all RLS-enabled:

- `blog_posts` — slug, title, excerpt, body (markdown), cover_image_url, category, published, published_at.
- `guides` — same shape as blog_posts, separate table for `/guides`.
- `contact_submissions` — name, email, subject, message.
- `newsletter_subscribers` — email (unique).

RLS:
- `blog_posts` / `guides`: public `SELECT` where `published = true`; admin role required for write.
- `contact_submissions` / `newsletter_subscribers`: public `INSERT` only; admin role required to read.
- Role system: `app_role` enum + `user_roles` table + `has_role()` security-definer function (per project conventions).

Seed 4 starter blog posts and 3 starter guides via the insert tool after migration approval.

### 6. Hybrid checker upgrade
New edge function `analyze-site`:
1. Fetches the target URL server-side.
2. Real checks: HTTPS, response status, `<title>`, meta description, H1 count, canonical, `robots.txt`, `sitemap.xml`, word count, HSTS / X-Frame-Options / CSP headers, viewport meta, favicon, internal link count.
3. Simulated (seeded by URL hash, so stable): domain age, Core Web Vitals, mobile score, CDN detection, niche check.
4. Returns the 6-category 47-point breakdown plus issues + action plan.

The existing `AIContentAnalyzer` continues to provide AI-powered content analysis on top of the report.

### 7. Forms
- Contact form → insert into `contact_submissions` (public INSERT policy).
- Footer newsletter signup → insert into `newsletter_subscribers` with `ON CONFLICT (email) DO NOTHING`.
- Validate with `zod`; show toast on success/error.

### 8. SEO upkeep
- Per-route `<Helmet>` on every new page (unique title, description, canonical, og:*).
- Update `public/sitemap.xml` with all Phase 1 routes; add blog/guide slugs (still static list — Phase 2 switches to generator script that reads DB).
- Update `public/robots.txt`, `public/llms.txt`.
- Add `FAQPage` JSON-LD on the homepage FAQ section.
- AdSense ad-slot placeholders (`<!-- AdSense Ad Slot -->`) above-the-fold, in-content, and footer on key pages.

---

## Phase 2 (next turn)
- `/blog`, `/blog/:slug`, `/guides`, `/guides/:slug` pages reading from DB.
- Markdown rendering (`react-markdown` + `remark-gfm`) with Tailwind prose.
- Sitemap generator script that pulls slugs from the DB at build time.
- Admin page (auth-gated) to create/edit posts and guides.

## Phase 3 (later)
- Real PageSpeed / Core Web Vitals via Google PSI API (requires user key).
- PDF report download.
- Email delivery for forms via Resend (requires API key).

---

## Technical notes
- Stack stays React 18 + Vite + RR6 + TanStack Query + shadcn. Add: `framer-motion`, `next-themes`, `recharts` (for revenue chart). `react-helmet-async` already pinned to v2 (React 18 compatible).
- All colors via semantic Tailwind tokens — no hex in components.
- Edge function uses `LOVABLE_API_KEY` already present; no new secrets needed for Phase 1.
- Phase 1 alone is a large change (≈25 new files). After approval I'll execute it in one batch and report what shipped.
