# AdsenseApprovalChecker.net — Authority Site Transformation Plan

Scope is huge (100+ pages, programmatic SEO, new tools, schema, EEAT, CWV). Shipping in **4 phases** so each is reviewable and the build stays stable. This plan covers all phases; I'll execute Phase 1 immediately after approval, then check in before each next phase.

---

## Phase 1 — Homepage rebuild, schema, EEAT foundation, CWV

**Homepage (`/`) — full SaaS redesign, 2500+ words**
New sections in this order:
1. Hero — H1 "Check If Your Website Is Ready For Google AdSense Approval", subheading per spec, analyze form, trust badges, sample score widget, live demo report preview screenshot
2. Trust bar — counters (sites analyzed, approvals predicted, avg score)
3. What Is An AdSense Approval Checker
4. How AdSense Approval Works
5. Why Google Rejects Websites
6. Common AdSense Mistakes
7. AdSense Approval Checklist (interactive 20-point)
8. How Our Tool Works (4-step + screenshots)
9. AdSense Requirements Explained
10. Sample Report preview card
11. Case Studies (3 cards)
12. Success Stories / Testimonials
13. FAQ (12 Q&A, accordion)
14. Sticky bottom CTA + Exit-intent CTA

**Schema markup (JSON-LD via Helmet)**
- Site-wide: Organization, WebSite (with SearchAction)
- Homepage: SoftwareApplication, FAQPage, BreadcrumbList
- Tool pages: SoftwareApplication + HowTo
- Articles: Article + BreadcrumbList + Author
- Helper: `src/lib/schema.ts` builders

**EEAT pages (new/upgraded)**
- `/about` — full company/about author with photo, credentials
- `/editorial-policy` (new)
- `/review-process` (new)
- `/contact` (keep, expand with company address block)
- `/privacy-policy`, `/terms-of-service`, `/disclaimer` (keep, expand)

**Conversion components**
- `StickyCTA.tsx` — appears after scrolling past hero
- `ExitIntentModal.tsx` — fires on mouseleave to top
- `TrustCounters.tsx`, `RecentAnalyses.tsx` (live-feel ticker)

**Core Web Vitals**
- Lazy-load route components via `React.lazy` + `Suspense`
- Image optimization: `loading="lazy"`, explicit width/height, AVIF/WebP where assets are generated
- Code-split heavy libs (jsPDF, recharts)
- Preconnect to Supabase + fonts in `index.html`
- Reserve space for dynamic blocks to keep CLS < 0.1

**SEO meta upgrades**
- Homepage title: "AdSense Approval Checker — Free Website Eligibility Audit Tool"
- Meta description rewritten for CTR
- All canonicals self-reference
- `public/sitemap.xml` updated with all Phase 1–4 routes
- `public/robots.txt` allows all + Sitemap directive
- `public/llms.txt` updated

---

## Phase 2 — Tool suite expansion (8 dedicated tool pages)

Each is its own route with unique H1, target keyword, 800+ word body, FAQ, schema.

| Route | Keyword |
|---|---|
| `/tools/adsense-approval-checker` (canonical of homepage tool) | adsense approval checker |
| `/tools/adsense-approval-calculator` | adsense approval score |
| `/tools/adsense-policy-checker` | adsense policy checker |
| `/tools/adsense-revenue-calculator` (existing, upgrade) | adsense revenue calculator |
| `/tools/adsense-rejection-analyzer` | adsense rejection checker |
| `/tools/website-quality-score-checker` | website quality checker |
| `/tools/content-quality-checker` | content quality |
| `/tools/seo-audit-checker` | seo audit tool |

`/tools` hub upgraded to grid all 8 with descriptions.

---

## Phase 3 — Content hub, clusters, programmatic SEO

**Content hub categories** (new index pages):
- `/guides/` (exists, upgrade)
- `/checklists/` (new)
- `/case-studies/` (new)
- `/adsense-errors/` (new)
- `/adsense-policy/` (new)

**Article cluster (15 articles)** — DB-backed (`blog_posts` already exists). I'll seed 15 full-length articles covering the cluster topics in the spec (How Many Posts For AdSense, Blogger, WordPress, AI Content, News, Movie, Checklist, Time, Rejection Reasons, Policy Violations, Score Guide, Examples, Fast Approval, New Domain, Niche Sites).

**Programmatic SEO landing pages (7 routes)**:
- `/check-wordpress-site-for-adsense`
- `/check-blog-for-adsense`
- `/check-news-site-for-adsense`
- `/check-health-site-for-adsense`
- `/check-finance-site-for-adsense`
- `/check-ai-content-for-adsense`
- `/check-ecommerce-site-for-adsense`

Driven by a single `<NicheCheckerPage>` template + niche config map (unique H1, intro, niche-specific requirements section, common-rejection list, FAQ, schema). Inlined to the checker engine with niche context passed to the audit function.

**Internal linking**: shared `<RelatedContent>` component on every page (related tool + related guide + related FAQ + homepage).

---

## Phase 4 — Blog backlog plan + final SEO polish

**Blog content plan**: ship `content/blog-plan.md` with 100 article briefs (keyword, intent, SEO title, meta description, slug, target internal links). Not 100 published posts — that's months of writing — but the structured plan the user can hand to a writer / fill with AI.

**Final polish**
- Breadcrumbs on every non-home route with BreadcrumbList schema
- Sitemap generator script that pulls slugs from DB at build time
- 404 page upgraded with related-content suggestions
- Final Lighthouse pass + fixes

---

## Technical notes
- Stack stays React 18 + Vite + RR6 + shadcn + Tailwind + Helmet + Supabase. No new heavy deps.
- All new colors via semantic tokens already defined in `src/index.css`.
- Schema builders typed and reusable.
- Niche checker pages reuse the existing `audit-website` edge function — no backend rewrite.
- DB: existing `blog_posts` and `guides` tables fit; I'll add a `category` filter use rather than new tables. New `checklists` and `case_studies` are simple enough to ship as static MDX-style React content (no migration needed) unless you want them DB-backed.

## What I need from you
1. **Approve the plan** so I can start Phase 1.
2. **Confirm**: case studies + checklists as static React pages (faster) or DB-backed (editable later)? Default = static.
3. **Author info for EEAT** (optional now, can use placeholder "Editorial Team" if not provided): real name, 1-paragraph bio, photo URL.

After approval I execute Phase 1 end-to-end in one batch, report what shipped, then ask before starting Phase 2.
