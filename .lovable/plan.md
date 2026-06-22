# Full SaaS Transformation Plan — AdSenseApprovalChecker.net

This is a large, multi-phase build. I'll break it into 4 shippable phases so you can review and approve work as it lands, rather than dumping ~40+ files in one go.

---

## Phase 1 — Foundation: Auth + Roles + Schema (ship first)

**Database migration (single SQL migration):**
- `profiles` (user_id, full_name, avatar_url, bio)
- `app_role` enum already exists (`admin`, `moderator`, `user`) — extend to add `super_admin`, `editor`, `author`
- `blog_categories` (name, slug, description, parent_id)
- `blog_tags` (name, slug)
- `post_tags` (post_id, tag_id) join table
- Extend existing `blog_posts` with: author_id, category_id, status enum (draft/scheduled/published), featured_image, meta_title, meta_description, focus_keyword, canonical_url, og_title, og_description, twitter_card, schema_json, robots_index, views
- `audit_reports` (user_id nullable, domain, overall_score, seo_score, content_score, technical_score, trust_score, issues jsonb, recommendations jsonb)
- `media_library` (uploader_id, url, alt_text, title, caption, mime_type, size_bytes, folder)
- `site_settings` (key, value jsonb)
- `activity_logs` (user_id, action, entity_type, entity_id, metadata)
- Update trigger `auto-create profile + default 'user' role` on signup
- RLS + GRANTs on every table (public read for published posts/categories/tags; admin/editor/author scoped writes via `has_role`)
- Storage bucket: `media` (public read, admin/editor write)

**Auth:**
- Email/password + Google sign-in enabled
- `/auth` page (login + signup tabs, password validation)
- `useAuth` hook + `<ProtectedRoute roles={[...]}>` wrapper
- Password reset flow (`/reset-password`)

---

## Phase 2 — Admin Dashboard Shell + Blog CMS

- `/admin` route guarded by `admin`/`super_admin`/`editor` roles
- Sidebar layout (Ahrefs-style): Dashboard, Posts, Categories, Tags, Media, Audits, SEO, Newsletter, Messages, Users, Settings, Logs
- **Dashboard home:** stat cards (posts, subscribers, audits, messages) + recent activity feed
- **Blog CMS:**
  - Posts list (search, filter by status/category, bulk actions)
  - Post editor: title → auto-slug, markdown editor (already have react-markdown), featured image picker (from media library), category, tags, excerpt, status, schedule
  - SEO tab inside editor: meta title/desc, focus keyword, canonical, OG, Twitter, robots, schema JSON preview
  - Auto reading-time calc on save
- **Categories & Tags:** CRUD pages
- **Media Library:** grid view, upload (to Supabase Storage `media` bucket), alt/title/caption edit, delete

---

## Phase 3 — SEO Center + Audit History + Newsletter + Users

- **SEO Center:** auto-sitemap edge function reading `blog_posts` + static routes; RSS feed edge function; schema generator helpers (Article/FAQ/HowTo/Breadcrumb already in `src/lib/schema.ts` — extend)
- **Audit Reports admin:** table of all audits with filters, click to view full JSON report
- **Audit history (frontend):** logged-in users see `/dashboard/my-audits` with their saved reports; new audits write to `audit_reports`
- **Newsletter admin:** subscriber table, CSV export, simple growth chart
- **Contact Messages admin:** inbox view of `contact_submissions`
- **User Management:** list users + roles, promote/demote (super_admin only)
- **Activity Logs:** simple table view

---

## Phase 4 — Frontend Blog Polish + Performance + Security

- Public blog: category pages `/blog/category/:slug`, tag pages `/blog/tag/:slug`, author pages `/blog/author/:slug`, search `/blog/search?q=`
- Single post: related posts (by category + tags), author box, breadcrumbs, share buttons (exists), view counter (RPC increment)
- Sitemap generator script (`scripts/generate-sitemap.ts`) pulling from DB at build time
- `robots.txt` already exists — add `Sitemap:` line
- Performance: lazy-load admin routes via `React.lazy`, image lazy-loading already standard
- Security: zod validation on all forms (contact, newsletter, post editor), rate limiting on edge functions, RLS double-checked

---

## Technical Details

**Stack additions:**
- `@uiw/react-md-editor` for rich markdown editing (or keep textarea + preview)
- `recharts` (already in shadcn) for admin charts
- `date-fns` for scheduling
- Supabase Storage for media

**Roles enforcement:** all writes gated by `has_role(auth.uid(), 'admin'|'editor'|'author')` SECURITY DEFINER function (already exists, will extend enum).

**No breaking changes** to current public pages — phases 1–3 add infrastructure; phase 4 polishes the existing blog/guides.

---

## What I need from you before starting

1. **Confirm role list:** `super_admin`, `admin`, `editor`, `author`, `user` — OK? (Current enum has admin/moderator/user; I'll migrate moderator→editor.)
2. **First admin user:** after Phase 1 ships, sign up via `/auth` and tell me the email — I'll grant you `super_admin` via a one-line insert.
3. **Google sign-in:** enable by default? (Yes/No)
4. **Approve Phase 1 to begin** — I'll start with the migration, then auth UI, then move to Phase 2 in the next round.

Reply "go" (with answers to 1–3) and I'll ship Phase 1.