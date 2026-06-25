<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Infoversion Website — Project Context

## What this is
The official website for Infoversion LLC (`infoversion.com`). A Next.js 16 App Router site deployed on Vercel. It serves as the company's public face: services, portfolio, about, CEO letter, and a contact form that routes enquiries to the admin inbox.

## Tech stack
- **Framework:** Next.js 16.2.9 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 — uses `@theme` tokens in `app/globals.css`, NOT `tailwind.config.js`
- **Fonts:** Geist Sans (body, `--font-sans`) + Space Grotesk (headings/wordmark, `--font-display`)
- **Database:** Supabase (project ID `iyacqoyvqksohtrsdrav`, region `eu-west-2`)
- **Auth:** Supabase Auth (`@supabase/ssr`) — admin-only, no public auth
- **Email:** Resend — using shared sender `onboarding@resend.dev` (see gotchas)
- **File storage:** Supabase Storage — `attachments` bucket (public)
- **Deployment:** Vercel — project `infoversion-website`, team `naprojects`
- **Repo:** `https://github.com/Infoversion/InfoversionWebsite.git`

## Environment variables (all set in Vercel + `.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://iyacqoyvqksohtrsdrav.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
ADMIN_EMAIL=1034jln@gmail.com   ← must match the Resend account email (see gotchas)
```

## Key Tailwind tokens (defined in `app/globals.css` under `@theme`)
```
--color-background: #0D1117
--color-surface: #161B22
--color-border: #30363D
--color-text-primary: #F0F6FC
--color-text-secondary: #8B949E
--color-accent-start: #4F46E5
--color-accent-end: #7C3AED
```
Utility classes `gradient-text`, `gradient-bg` are defined in globals.css.

## Pages
| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Hero, services overview, portfolio teaser, CTA |
| `/services` | `app/services/page.tsx` | Four service lines with deliverables |
| `/portfolio` | `app/portfolio/page.tsx` | Bazidpur (Live), Heritage, T3, PresentPro |
| `/tech-stack` | `app/tech-stack/page.tsx` | Technology categories with icons |
| `/about` | `app/about/page.tsx` | Mission, values, company facts, CEO teaser link |
| `/from-the-ceo` | `app/from-the-ceo/page.tsx` | 6-paragraph founder letter, signed Ozma A. |
| `/contact` | `app/contact/page.tsx` | Contact form with file attachment |
| `/admin` | `app/admin/(protected)/` | Protected admin dashboard — queries list + detail |
| `/admin/login` | `app/admin/login/page.tsx` | Admin sign-in |

## Database schema (Supabase)
- `contact_submissions` — id, name, email, company, service, message, status (`new`/`read`/`replied`), created_at
- `replies` — id, submission_id, body, sent_at
- Storage bucket `attachments` — public, anon insert allowed via RLS policy

## Key components
- `components/nav.tsx` — sticky nav, logo + wordmark, links + Contact CTA
- `components/footer.tsx` — links, company address, copyright
- `components/contact-form.tsx` — uses `useActionState` (React 19), uploads attachments via `createBrowserClient`
- `components/admin/reply-form.tsx` — reply thread UI in admin

## Server actions
- `actions/contact.ts` — saves submission to Supabase, sends admin notification email
- `actions/admin.ts` — signIn, signOut, markAsRead, replyToSubmission

---

## Critical gotchas (do NOT repeat these mistakes)

### 1. Resend — shared sender and ADMIN_EMAIL must match
Resend's `onboarding@resend.dev` shared sender **only delivers to the email address registered on the Resend account**, regardless of what `ADMIN_EMAIL` is set to. If `ADMIN_EMAIL` is set to a different address, emails silently disappear. Current Resend account email is `1034jln@gmail.com` — `ADMIN_EMAIL` must stay as this value.

### 2. Resend — domain slot is occupied by Bazidpur
The Resend free plan allows one custom domain. `infoversion.com` cannot be added because the Bazidpur project already occupies the one slot. Until the plan is upgraded or Bazidpur's domain is removed, all emails must use `onboarding@resend.dev` as `from`. Do NOT change the `from` address to anything on `infoversion.com`.

### 3. `revalidatePath` is forbidden during page render
Next.js 16 throws if `revalidatePath` is called inside a Server Component that is currently rendering. This broke the admin query detail page. Fix: do the Supabase update inline in the page without calling `revalidatePath`, or move side effects into a separate server action called from a client component.

### 4. `@react-email/components` is broken — do not use
The package throws an uncaught exception during import in this Next.js version, crashing the page with "This page couldn't load". Use plain HTML strings for all emails in Resend calls. Both `actions/contact.ts` and `actions/admin.ts` already do this correctly.

### 5. Next.js Image optimisation fails on local PNGs
`<Image>` from `next/image` throws an error for local PNG files (logo, favicon, screenshot) in this version. Always add `unoptimized` prop to any `<Image>` with a local PNG source.

### 6. Supabase Storage — anon upload requires explicit RLS policy
The `attachments` storage bucket exists but anon users can only upload if an explicit RLS policy grants `INSERT` to the `anon` role on `storage.objects` with `bucket_id = 'attachments'`. This policy has been applied. Do not remove it.

### 7. Tailwind v4 — no tailwind.config.js
All theme customisation is in `app/globals.css` under `@theme { }`. Do not create or modify `tailwind.config.js` — it is not used.

### 8. `middleware` file convention deprecated
Next.js 16 warns that `middleware` is deprecated in favour of `proxy`. Do not create new middleware files.

### 9. ImageResponse (OG image) — every div must have explicit display
`next/og` ImageResponse requires every `<div>` with children to have `display: 'flex'`, `display: 'contents'`, or `display: 'none'` set explicitly in the style prop. Omitting it throws during static generation.

---

## SEO — what's in place
- `app/sitemap.ts` → `/sitemap.xml` — all 7 public pages
- `app/robots.ts` → `/robots.txt` — blocks `/admin/`, points to sitemap
- `app/opengraph-image.tsx` → auto-generated 1200×630 OG image via `next/og`
- JSON-LD structured data (Organization, WebSite, ProfessionalService) injected in `app/layout.tsx`
- Per-page `metadata` exports with unique titles, descriptions, keywords, Open Graph, Twitter card, canonical URLs
- Google Search Console: verified, sitemap submitted (may take 24–48 h on first fetch)

---

## Pending / to-do items

### High priority
- [ ] **Resend domain verification** — when the Resend plan is upgraded (or Bazidpur's domain slot freed), verify `infoversion.com` in Resend and change both email senders:
  - `actions/contact.ts` → `from: 'Infoversion <notifications@infoversion.com>'`
  - `actions/admin.ts` → `from: 'Infoversion <hello@infoversion.com>'`
  - Also update `replyTo` and `ADMIN_EMAIL` to the preferred inbox
- [ ] **Google Business Profile** — create at business.google.com, category "Software Company" + "Mobile App Developer", use Dallas address. Await postcard verification (~5 days). This is the #1 local search visibility action.
- [ ] **Clutch.co profile** — free listing, most-searched directory for app dev agencies
- [ ] **Test attachment upload end-to-end** — confirm files upload to Supabase Storage `attachments` bucket successfully in production

### Medium priority
- [ ] **Google reviews** — once GBP is live, get 3–5 reviews from people worked with
- [ ] **Apple Maps listing** — mapsconnect.apple.com
- [ ] **Bing Places listing** — bingplaces.com
- [ ] **LinkedIn Company Page** — creates second result on branded search
- [ ] **Add phone number** — contact form and footer, helps local SEO and GBP
- [ ] **Yelp listing** — yelp.com/biz/add

### Low priority / future
- [ ] **PresentPro page** — dedicated landing page when closer to launch
- [ ] **Heritage page** — dedicated landing page with waitlist/notify
- [ ] **Blog / content** — even 2–3 articles ("How we built Bazidpur", "React Native vs native") would accelerate indexing and domain authority
- [ ] **Bazidpur screenshot** — current screenshot is a simulator image; replace with a polished App Store quality image when available
- [ ] **Resend plan upgrade** — to send from `infoversion.com` domain and remove the shared-sender restriction
- [ ] **Contact form: confirm reply-to threading** — when a contact replies to the admin's email, confirm it routes back correctly
- [ ] **Admin: pagination** — queries list has no pagination; will need it when submissions grow

---

## Company info (for copy / schema)
- **Legal name:** Infoversion LLC
- **Address:** 13101 Preston Rd. Ste 110-3084, Dallas, TX 75240
- **Website:** https://infoversion.com
- **CEO / Founder:** Ozma A.
- **Admin email:** 1034jln@gmail.com (Resend account + ADMIN_EMAIL)
