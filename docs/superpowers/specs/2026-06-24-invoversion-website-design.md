# Invoversion LLC — Company Website Design

**Date:** 2026-06-24
**Status:** Approved
**Domain:** infoversion.com
**Type:** Web application only — no mobile app

---

## Overview

Invoversion LLC is a software company focused on building high-quality iOS and Android applications, web platforms, and offering IT project management, consulting, and Agile transformation services. The company targets problems in the social and technical space that affect large populations — connecting families, connecting presenters with audiences, and digitising experiences that matter.

The website serves two purposes:
1. **Lead generation** — the Contact page is the primary channel for new business enquiries
2. **Credibility** — the portfolio, services, and tech stack pages demonstrate capability to prospective clients

---

## Brand Direction

**Aesthetic:** Dark, premium, tech-forward. Clean layout with generous whitespace, sharp typography, and a gradient accent that signals innovation.

**Colour palette:**
| Token | Value | Usage |
|---|---|---|
| Background | `#0D1117` | Page background |
| Surface | `#161B22` | Cards, panels |
| Accent start | `#4F46E5` | Gradient start (indigo) |
| Accent end | `#06B6D4` | Gradient end (cyan) |
| Text primary | `#F0F6FC` | Headings, body |
| Text secondary | `#8B949E` | Captions, meta |
| Border | `#30363D` | Card borders, dividers |

**Typography:** Geist (open-source, modern, technical, highly legible at all sizes).

**Tone:** Confident and direct. No buzzword soup. Every sentence earns its place.

**Tagline:** *"We find the problem. We build the solution."*

---

## Section 1: Public Site — Pages

### Navigation

Sticky top nav: Logo (left) + Links (right): Services · Portfolio · Tech Stack · About · **Contact** (filled gradient button).

### Page 1 — Home (`/`)

| Block | Content |
|---|---|
| **Hero** | Full-width dark section. Large heading with gradient accent on key phrase. Subheading: one sentence on what Invoversion builds and why. Two CTAs: "See Our Work" (→ /portfolio) and "Get in Touch" (→ /contact) |
| **Services Overview** | 4 cards: App Development, Web Development, IT Consulting, Agile Coaching. Each card: icon, name, one-sentence description, link to /services |
| **Featured Portfolio** | 3 cards: Heritage, T3, PresentPro. Each: product name, one-line pitch, platform badges, status badge (In Development / Available) |
| **Trust Signal** | Simple stat row: platforms supported, apps in development, years combined experience |
| **CTA Strip** | Dark gradient strip: "Have a project in mind?" + "Contact Us" button |

---

### Page 2 — Services (`/services`)

Four sections, one per service line. Each section: heading, 3–4 paragraph write-up, and a list of specific deliverables.

**App Development**
Invoversion specialises in high-quality iOS and Android applications built with React Native and Expo — a single codebase that delivers genuinely native performance on both platforms. Every product we build starts with a clear problem statement: who is affected, how many people, and what a meaningful solution looks like. We do not build features for the sake of features. We build products that earn a place on people's phones because they solve a real problem better than anything else available. From game mechanics to real-time audience tools to multi-generational family platforms, our portfolio spans categories — united by a commitment to quality, performance, and thoughtful UX.

*Deliverables:* iOS + Android apps (React Native + Expo), app store submission, OTA update pipeline, push notifications, in-app purchases (RevenueCat), AR features, CI/CD via EAS.

**Web Development**
We build modern web applications using Next.js, Supabase, and Tailwind — the same stack that powers the world's fastest-growing SaaS products. Whether it is a customer-facing platform, an internal tool, or a content-driven site, we approach every web project with the same discipline as a product: clear architecture, multi-tenant data isolation where needed, accessibility from day one, and deployment pipelines that make shipping safe and fast. We do not hand off a codebase and disappear — we build things we are proud to maintain.

*Deliverables:* Next.js web apps, SaaS platforms, admin dashboards, API design, Supabase/PostgreSQL data modelling, Vercel deployment, custom domain configuration.

**IT Project Management & Consulting**
Organisations often have the right technology and the right people — but the wrong structure around them. Invoversion provides hands-on project management and technical consulting for teams that need clarity: clear scope definitions, realistic delivery roadmaps, vendor evaluation, architecture advisory, and risk identification before it becomes a problem. We have experience managing complex multi-phase digital products from discovery through delivery, working directly with stakeholders at all levels to translate business requirements into executable technical plans. We do not produce slide decks and leave. We embed where needed, align teams on what matters, and stay accountable to outcomes.

*Deliverables:* Project discovery workshops, scope and roadmap documents, vendor evaluation reports, architecture advisory sessions, risk registers, stakeholder communication frameworks, delivery oversight.

**Agile Transformation & Coaching**
Many organisations adopt the language of Agile — standups, sprints, backlogs — without capturing the principles that make it work. Invoversion helps teams close that gap. We assess where a team or organisation sits on the Agile maturity curve, identify the specific friction points (unclear ownership, bloated ceremonies, absent feedback loops, or misaligned incentives), and design a transformation approach that fits the organisation — not a generic framework imposed from the outside. Coaching is hands-on: we work in sprints alongside teams, facilitate retrospectives, coach Product Owners on prioritisation discipline, and help engineering leads build a culture where continuous improvement is the default, not the exception. Whether a team is moving from waterfall for the first time or trying to scale Agile practices across multiple squads, we meet them where they are.

*Deliverables:* Agile maturity assessment, transformation roadmap, sprint facilitation, retrospective workshops, Product Owner coaching, team coaching (Scrum/Kanban), scaled Agile guidance (SAFe where appropriate).

---

### Page 3 — Portfolio (`/portfolio`)

Three case study cards, one per product. Each card:

| Field | Content |
|---|---|
| Product name | Heritage / T3 / PresentPro |
| Tagline | One-line problem statement |
| Problem | 2–3 sentences on the real-world problem |
| Solution | 2–3 sentences on what was built |
| Tech stack | Badge list of key technologies |
| Platform | iOS + Android / Web badges |
| Status | In Development |

**Heritage:** A private, culture-aware platform for any family worldwide to build their family tree, document their heritage, and stay connected across generations. Supports 1,000+ node trees including deceased members, RTL layout, 20+ languages, and multi-tenant data isolation via Supabase RLS.

**T3:** A premium tic-tac-toe game with adaptive AI opponents, Ultimate Tic-Tac-Toe, and AR board anchoring. Freemium model — classic 3×3 free, full experience unlocked via a one-time $4.99 purchase.

**PresentPro:** A real-time mobile presentation sharing app. The presenter's slides appear on every audience member's phone instantly, with optional Q&A, polling, and feedback — no screen required. Firebase Firestore powers sub-300ms slide propagation.

---

### Page 4 — Tech Stack (`/tech-stack`)

Organised by category. Each row: technology name, brief description, and the context in which Invoversion uses it.

**Mobile**
| Technology | What it is | How we use it |
|---|---|---|
| React Native | Cross-platform mobile framework | All iOS + Android apps — single codebase, native performance |
| Expo SDK 53 | React Native toolchain + APIs | Build pipeline, OTA updates, device APIs (camera, AR, notifications) |
| TypeScript | Typed JavaScript | All projects — catches entire classes of bugs at compile time |
| Expo Router | File-based navigation | Screen routing, deep linking, universal links |
| React Native Reanimated 3 | Native-thread animations | 60fps animations without blocking the JS thread |
| Zustand | Lightweight state management | Client-side game state, session state |
| RevenueCat | In-app purchase management | Cross-platform subscription and one-time purchase handling |
| ViroReact + Expo AR | AR framework | Board anchoring, AR family tree overlays |
| EAS (Expo Application Services) | Cloud build + OTA | Production builds, TestFlight/Play Console distribution, over-the-air updates |

**Web**
| Technology | What it is | How we use it |
|---|---|---|
| Next.js 15 | React framework with App Router | All web platforms — SSG for marketing, SSR for dynamic data |
| React 19 | UI library | Component model, concurrent rendering, server components |
| TypeScript | Typed JavaScript | All web projects — end-to-end type safety |
| Tailwind CSS v4 | Utility-first CSS | All styling — no custom CSS files |
| shadcn/ui | Accessible component library | UI components built on Radix primitives |
| Motion (Framer Motion v12) | Animation library | Page transitions, scroll animations, micro-interactions |
| TipTap | Rich text editor | Forum posts, memoirs, heritage documentation |
| Drizzle ORM | Type-safe SQL ORM | Database queries with full TypeScript inference |
| tRPC | End-to-end type-safe API | Internal API layer where REST would be over-engineered |

**Backend & Data**
| Technology | What it is | How we use it |
|---|---|---|
| Supabase | PostgreSQL + Auth + RLS + Realtime | Multi-tenant SaaS backends — data isolation via RLS policies |
| Neon | Serverless Postgres | Lightweight projects that don't need the full Supabase surface area |
| Firebase Firestore | NoSQL realtime database | Real-time sync (PresentPro) — sub-100ms propagation to connected clients |
| Cloudflare R2 | Object storage | Media, documents, exports — S3-compatible, no egress fees |
| Cloudflare Workers | Edge compute | Middleware, geo-routing, lightweight API at the edge |

**AI & Intelligence**
| Technology | What it is | How we use it |
|---|---|---|
| Claude API (Anthropic) | Large language model | AI personas, post-game coaching, memoir assistants, family historians |
| Vercel AI SDK | AI integration toolkit | Streaming responses, tool use, provider switching |
| Whisper | Speech-to-text | Voice note transcription in Heritage |

**Auth, Email & Payments**
| Technology | What it is | How we use it |
|---|---|---|
| Supabase Auth | Authentication service | Email/password, magic link, Google OAuth — all projects |
| Clerk | Auth + user management | Projects requiring advanced org management and user profiles |
| Resend | Transactional email | Invites, billing alerts, contact notifications — React Email templates |
| Stripe | Payment processing | Web subscriptions, Checkout, Customer Portal, Webhooks |
| RevenueCat | Mobile payments | iOS + Android in-app purchases and subscriptions |

**Infrastructure & Monitoring**
| Technology | What it is | How we use it |
|---|---|---|
| Vercel | Deployment platform | All Next.js deployments — preview branches, edge network |
| GitHub Actions | CI/CD | Automated testing, linting, deployment triggers |
| EAS Build | Mobile CI/CD | Cloud builds for iOS + Android, TestFlight/Play Console delivery |
| Sentry | Error tracking | Runtime error monitoring across web and mobile |
| PostHog | Product analytics | Feature usage, funnel analysis, session replays |
| Vitest | Unit testing | Fast unit and integration tests |
| Playwright | E2E testing | Browser automation for critical user flows |
| Detox | Mobile E2E testing | End-to-end testing on iOS and Android simulators |

---

### Page 5 — About (`/about`)

**Mission block:** Invoversion was founded on a simple conviction — that the best software solves problems that actually matter to people. Not productivity tools for knowledge workers who already have ten. Not another social feed optimised for engagement. We look for problems in the social and technical space that affect large populations and are underserved by existing solutions: families losing connection with their roots, presenters struggling to reach audiences without screens, players wanting more than the game they grew up with.

**What we value:** Quality over speed. Clarity over complexity. Products that improve with use, not just at launch.

**Company fact row:** LLC registered in the United States · iOS + Android first · Web where it matters

---

### Page 6 — Contact (`/contact`)

The primary lead-generation page. Clean, focused, no distractions.

**Form fields:**
| Field | Type | Required |
|---|---|---|
| Full name | Text | Yes |
| Email address | Email | Yes |
| Company / Organisation | Text | No |
| Service interested in | Dropdown: App Development / Web Development / IT Consulting & PM / Agile Transformation / Other | Yes |
| Message | Textarea (min 20 chars) | Yes |

**Validation:** Client-side with Zod before submission. Server-side re-validation in the server action. Honeypot field for basic spam protection.

**Success state:** Inline success message — "Thank you, [name]. We'll be in touch within 1 business day." No page reload.

**Error state:** Inline field-level errors. Generic server error message if submission fails, with retry prompt.

---

## Section 2: Admin Panel

Accessible at `/admin`. No link from the public site. Direct URL only.

### Auth

Supabase Auth email + password. Single admin account seeded via Supabase dashboard — no sign-up flow in the app. Session stored in a Supabase cookie, expires after 24 hours of inactivity. Next.js middleware checks JWT on every `/admin/*` request at the edge — unauthenticated requests redirect to `/admin/login`.

### Admin Routes

| Route | Purpose |
|---|---|
| `/admin/login` | Email + password login form |
| `/admin` | Dashboard — unread count, recent 5 submissions |
| `/admin/queries` | Full list of all submissions, sorted newest first |
| `/admin/queries/[id]` | Submission detail + reply interface |

### Query List (`/admin/queries`)

- Status badge per row: `new` (blue), `read` (grey), `replied` (green)
- Columns: name, email, service, date, status
- Clicking a row navigates to the detail view and marks status as `read`
- Unread count shown in browser tab title: `(3) Invoversion Admin`

### Query Detail (`/admin/queries/[id]`)

- Full submission: name, email, company, service, message, timestamp
- All previous replies shown below the original message in chronological order
- Reply composer: textarea, pre-populated subject (`Re: Your enquiry to Invoversion`)
- Send button fires a server action: Resend API call → email to contact, reply saved to `replies` table, status updated to `replied`
- Optimistic UI update — reply appears immediately without reload

### Email Notification (inbound)

On new submission, Resend sends an email to the admin address containing:
- Contact's name, email, company, service interest
- Their full message
- A direct link to `/admin/queries/[id]`

---

## Section 3: Data Model

```sql
contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  company       text,
  service       text not null,         -- App Dev | Web Dev | Consulting | Agile | Other
  message       text not null,
  status        text default 'new',    -- new | read | replied
  created_at    timestamptz default now()
)

replies (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid references contact_submissions(id) on delete cascade,
  body            text not null,
  sent_at         timestamptz default now()
)
```

### RLS Policies

- `contact_submissions`: public INSERT via anon key (contact form), no public SELECT
- `replies`: no public access
- All admin reads/writes use the service role key in server-side route handlers only — never in client code

---

## Section 4: Technology Stack (for building this site)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database + Auth | Supabase |
| Email | Resend + React Email |
| Validation | Zod |
| Font | Geist |
| Deployment | Vercel |
| Domain | infoversion.com |
| Environment | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL` |

---

## Section 5: Architecture & Data Flow

### Contact Form → Admin

```
Visitor submits form
  → Client Zod validation
  → Server action (service role)
      → INSERT contact_submissions
      → Resend: notify admin (link to /admin/queries/[id])
  → Success message shown to visitor
```

### Admin Reply

```
Admin writes reply in /admin/queries/[id]
  → Server action (service role)
      → Resend: email to contact (reply-to: admin address)
      → INSERT replies (linked to submission)
      → UPDATE contact_submissions SET status = 'replied'
  → UI updates optimistically
```

### Route Protection

Next.js middleware runs at the edge on every `/admin/*` request. Checks Supabase session cookie (JWT verification — no DB call). No session → redirect to `/admin/login`.

---

## Success Criteria

- Visitor can submit a contact form in under 60 seconds with no errors
- Admin receives email notification within 30 seconds of submission
- Admin can log in, read a submission, and send a reply in under 2 minutes
- Reply email lands in the contact's inbox with correct reply-to address
- All 6 public pages render correctly on mobile (375px) and desktop (1280px+)
- Lighthouse score ≥ 90 on Performance, Accessibility, SEO for all public pages
- `/admin/*` routes are completely inaccessible without a valid session
- Contact form rejects submissions with missing required fields and invalid email addresses

---

## Out of Scope

- Blog or news section
- Live chat widget
- Social media integration or feed embeds
- CMS for the admin to edit page content (content is hardcoded in the codebase)
- Multiple admin users or role-based access
- File/attachment uploads on the contact form
- Automated follow-up email sequences
- Analytics dashboard in the admin panel (PostHog handles this externally)
- Internationalisation / multi-language support
- Dark/light mode toggle (dark mode only)
