# Infoversion Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Infoversion LLC company website at infoversion.com — 6 public pages + admin panel for managing contact form submissions and replying to enquiries.

**Architecture:** Next.js 15 App Router with statically-rendered public pages and server-rendered admin pages; all form logic lives in server actions with Zod validation; Supabase handles data persistence and admin session auth; Resend delivers transactional email in both directions (admin notification on new submission, admin reply to contact); Next.js middleware guards every `/admin/*` route at the edge.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, @supabase/ssr, @supabase/supabase-js, Resend, @react-email/components, Zod, Geist font, Vitest, Vercel

---

## Global Constraints

- Next.js 15 App Router only — no Pages Router
- TypeScript strict mode — no `any` without a comment explaining why
- Tailwind CSS v4 — design tokens in `globals.css` via `@theme`, no `tailwind.config.js`
- Color tokens (exact hex values, no deviations):
  - background `#0D1117` · surface `#161B22` · accent-start `#4F46E5` · accent-end `#06B6D4`
  - text-primary `#F0F6FC` · text-secondary `#8B949E` · border `#30363D`
- Font: Geist (`geist` npm package) — no fallback to other fonts for headings
- Dark mode only — `<html>` always has class `dark`, no toggle
- Admin panel at `/admin` — zero public links to it anywhere on the site
- All Supabase data operations (SELECT, INSERT, UPDATE) in admin panel and contact form use **service role key in server actions only** — never exposed to client bundles
- SSR auth session management uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`
- No blog, CMS, social embeds, file uploads, multi-user admin, i18n, dark/light toggle
- Contact form service dropdown values (exact strings): `"App Development"`, `"Web Development"`, `"IT Consulting & PM"`, `"Agile Transformation"`, `"Other"`

---

## File Map

```
/
├── app/
│   ├── layout.tsx                          # Root layout: Geist font, dark class, metadata
│   ├── globals.css                         # Tailwind v4 @theme tokens + @utility helpers
│   ├── page.tsx                            # Home (/)
│   ├── services/page.tsx                   # Services (/services)
│   ├── portfolio/page.tsx                  # Portfolio (/portfolio)
│   ├── tech-stack/page.tsx                 # Tech Stack (/tech-stack)
│   ├── about/page.tsx                      # About (/about)
│   ├── contact/page.tsx                    # Contact (/contact)
│   └── admin/
│       ├── layout.tsx                      # Admin layout: server-side auth guard
│       ├── login/page.tsx                  # /admin/login — email + password form
│       ├── page.tsx                        # /admin — dashboard
│       └── queries/
│           ├── page.tsx                    # /admin/queries — full list
│           └── [id]/page.tsx               # /admin/queries/[id] — detail + reply
├── components/
│   ├── nav.tsx                             # Sticky top nav
│   ├── footer.tsx                          # Footer
│   ├── contact-form.tsx                    # Contact form (client component)
│   └── admin/
│       ├── sign-out-button.tsx             # Client component: Supabase signOut
│       └── reply-form.tsx                  # Client component: optimistic reply UI
├── lib/
│   ├── supabase/
│   │   ├── server.ts                       # createClient() for SSR (anon key + cookies)
│   │   └── service.ts                      # createServiceClient() (service role, no cookies)
│   ├── validations/
│   │   └── contact.ts                      # Zod schema + inferred types
│   └── types.ts                            # Shared DB row types
├── actions/
│   ├── contact.ts                          # submitContact server action
│   └── admin.ts                            # signIn, signOut, markAsRead, replyToSubmission
├── emails/
│   ├── admin-notification.tsx              # React Email: notify admin of new submission
│   └── contact-reply.tsx                   # React Email: reply email to contact
├── middleware.ts                           # Edge middleware: protect /admin/* routes
├── supabase/
│   └── migrations/
│       └── 20260624000001_initial.sql      # Tables + RLS policies
├── vitest.config.ts
└── __tests__/
    ├── lib/validations/contact.test.ts
    └── actions/
        ├── contact.test.ts
        └── admin.test.ts
```

---

## Task 1: Project Scaffold + Toolchain

**Files:**
- Create: `package.json` (via create-next-app then additional installs)
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `.env.local`
- Create: `.env.example`

**Interfaces:**
- Produces: runnable Next.js 15 dev server; Vitest test runner available via `npm test`

- [ ] **Step 1: Scaffold Next.js app in the current directory**

```bash
npx create-next-app@latest . \
  --typescript \
  --app \
  --no-tailwind \
  --no-eslint \
  --import-alias "@/*" \
  --src-dir false
```

When prompted "Ok to proceed?" press Enter. When asked about Turbopack, select **Yes**.

- [ ] **Step 2: Install all runtime dependencies**

```bash
npm install \
  tailwindcss @tailwindcss/postcss \
  geist \
  @supabase/supabase-js @supabase/ssr \
  resend @react-email/components \
  zod \
  lucide-react
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D \
  vitest @vitejs/plugin-react \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  jsdom \
  @types/node
```

- [ ] **Step 4: Configure PostCSS for Tailwind v4**

Create `postcss.config.mjs`:
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

- [ ] **Step 5: Configure Vitest**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['__tests__/setup.ts'],
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      RESEND_API_KEY: 're_test_key',
      ADMIN_EMAIL: 'admin@test.com',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

Create `__tests__/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to package.json**

Open `package.json` and add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Create .env files**

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=re_your_resend_key_here
ADMIN_EMAIL=your@email.com
```

Create `.env.example` (committed to git):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
```

Add `.env.local` to `.gitignore` if not already present.

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: `▲ Next.js 15.x.x` starts on `http://localhost:3000` with no errors.

- [ ] **Step 9: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 15 project with Tailwind v4 and Vitest"
```

---

## Task 2: Design System — Tailwind v4 Tokens + Root Layout

**Files:**
- Create: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `bg-background`, `bg-surface`, `text-text-primary`, `text-text-secondary`, `border-border`, `gradient-text`, `gradient-bg` available as Tailwind utilities in all components

- [ ] **Step 1: Write globals.css with Tailwind v4 design tokens**

Replace the contents of `app/globals.css` entirely:

```css
@import "tailwindcss";

@theme {
  --color-background: #0D1117;
  --color-surface: #161B22;
  --color-accent-start: #4F46E5;
  --color-accent-end: #06B6D4;
  --color-text-primary: #F0F6FC;
  --color-text-secondary: #8B949E;
  --color-border: #30363D;

  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
}

@utility gradient-text {
  background-image: linear-gradient(135deg, var(--color-accent-start), var(--color-accent-end));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@utility gradient-bg {
  background-image: linear-gradient(135deg, var(--color-accent-start), var(--color-accent-end));
}

@utility gradient-border {
  border-image: linear-gradient(135deg, var(--color-accent-start), var(--color-accent-end)) 1;
}

html {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Write root layout with Geist font**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: 'Invoversion — We find the problem. We build the solution.',
    template: '%s | Invoversion',
  },
  description:
    'Invoversion builds high-quality iOS, Android, and web platforms — and provides IT project management, consulting, and Agile transformation services.',
  metadataBase: new URL('https://infoversion.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable}`}>
      <body className="bg-background text-text-primary font-sans min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

This adds `components/ui/` and updates `globals.css` with shadcn's CSS variable block. The shadcn variables will coexist with our `@theme` block.

- [ ] **Step 4: Add shadcn components used throughout the project**

```bash
npx shadcn@latest add button input textarea label select badge card
```

- [ ] **Step 5: Verify no build errors**

```bash
npm run build
```

Expected: Build succeeds (may warn about missing Nav/Footer imports — that's fine, we add them next task).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind v4 design tokens, Geist font, shadcn/ui"
```

---

## Task 3: Database Setup + Supabase Clients

**Files:**
- Create: `supabase/migrations/20260624000001_initial.sql`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/service.ts`
- Create: `lib/types.ts`

**Interfaces:**
- Produces:
  - `createClient(): Promise<SupabaseClient>` — SSR client using anon key + cookies (for auth session)
  - `createServiceClient(): SupabaseClient` — service role client (for data operations)
  - `ContactSubmission`, `Reply` TypeScript types

- [ ] **Step 1: Write the database migration**

Create `supabase/migrations/20260624000001_initial.sql`:

```sql
-- contact_submissions: public INSERT via anon key, no public SELECT
create table if not exists contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  company     text,
  service     text not null,
  message     text not null,
  status      text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at  timestamptz not null default now()
);

-- replies: no public access at all
create table if not exists replies (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid not null references contact_submissions(id) on delete cascade,
  body            text not null,
  sent_at         timestamptz not null default now()
);

-- RLS
alter table contact_submissions enable row level security;
alter table replies enable row level security;

-- Anyone can insert (contact form via anon key in server action — but we use service role so this is belt-and-suspenders)
create policy "public can insert contact submissions"
  on contact_submissions for insert
  to anon
  with check (true);

-- No public reads on either table
-- Admin operations use service role key which bypasses RLS entirely
```

Apply this migration in the Supabase dashboard SQL editor or via Supabase CLI:
```bash
# If Supabase CLI is installed and linked:
supabase db push
# Otherwise, copy-paste the SQL into Supabase dashboard > SQL Editor > Run
```

- [ ] **Step 2: Write the SSR Supabase client (anon key + cookies)**

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Calling setAll from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Write the service role client (bypasses RLS, server-only)**

Create `lib/supabase/service.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 4: Write shared TypeScript types**

Create `lib/types.ts`:

```typescript
export type SubmissionStatus = 'new' | 'read' | 'replied'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  service: string
  message: string
  status: SubmissionStatus
  created_at: string
}

export interface Reply {
  id: string
  submission_id: string
  body: string
  sent_at: string
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Supabase migration, SSR client, service client, shared types"
```

---

## Task 4: Admin Route Middleware

**Files:**
- Create: `middleware.ts`

**Interfaces:**
- Consumes: `createServerClient` from `@supabase/ssr`, Next.js `NextRequest`/`NextResponse`
- Produces: All `/admin/*` routes (except `/admin/login`) redirect to `/admin/login` when no valid session; `/admin/login` redirects to `/admin` when already authenticated

- [ ] **Step 1: Write the middleware**

Create `middleware.ts` at the project root:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (!user && isAdminRoute && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify middleware compiles**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add edge middleware to protect /admin/* routes"
```

---

## Task 5: Nav + Footer + Root Layout

**Files:**
- Create: `components/nav.tsx`
- Create: `components/footer.tsx`

**Interfaces:**
- Produces: `<Nav />` (sticky top nav with gradient Contact button), `<Footer />` (simple footer)

- [ ] **Step 1: Write the Nav component**

Create `components/nav.tsx`:

```tsx
import Link from 'next/link'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Tech Stack', href: '/tech-stack' },
  { label: 'About', href: '/about' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-text-primary font-semibold text-lg tracking-tight">
          Invoversion
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="gradient-bg text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Contact
          </Link>
        </div>
        {/* Mobile: show just the Contact link */}
        <div className="md:hidden">
          <Link
            href="/contact"
            className="gradient-bg text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Write the Footer component**

Create `components/footer.tsx`:

```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-secondary text-sm">
          © {new Date().getFullYear()} Invoversion LLC. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/services" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Services
          </Link>
          <Link href="/portfolio" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Portfolio
          </Link>
          <Link href="/contact" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Start dev server and verify nav + footer render**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: sticky nav visible with Invoversion logo and links; footer at bottom of page.

- [ ] **Step 4: Commit**

```bash
git add components/nav.tsx components/footer.tsx app/layout.tsx
git commit -m "feat: add sticky nav and footer to root layout"
```

---

## Task 6: Home Page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `Footer` (via layout)
- Produces: `/` renders Hero, Services Overview, Featured Portfolio, Trust Signals, CTA Strip

- [ ] **Step 1: Write the home page**

Replace `app/page.tsx`:

```tsx
import Link from 'next/link'
import { Smartphone, Globe, LineChart, Users } from 'lucide-react'

const services = [
  {
    icon: Smartphone,
    name: 'App Development',
    description: 'iOS and Android apps built with React Native — a single codebase, genuinely native performance.',
  },
  {
    icon: Globe,
    name: 'Web Development',
    description: 'Modern web platforms with Next.js and Supabase — from SaaS products to internal tools.',
  },
  {
    icon: LineChart,
    name: 'IT Consulting',
    description: 'Hands-on project management and technical advisory from discovery through delivery.',
  },
  {
    icon: Users,
    name: 'Agile Coaching',
    description: 'Close the gap between Agile language and Agile outcomes — coaching that sticks.',
  },
]

const portfolio = [
  {
    name: 'Heritage',
    pitch: 'A private platform for families worldwide to build their family tree and document their heritage.',
    stack: ['React Native', 'Expo', 'Supabase'],
    platforms: ['iOS', 'Android'],
    status: 'In Development',
  },
  {
    name: 'T3',
    pitch: 'Premium tic-tac-toe with adaptive AI, Ultimate mode, and AR board anchoring.',
    stack: ['React Native', 'Expo', 'ViroReact'],
    platforms: ['iOS', 'Android'],
    status: 'In Development',
  },
  {
    name: 'PresentPro',
    pitch: 'Real-time slide sharing — the presenter\'s screen on every audience member\'s phone instantly.',
    stack: ['React Native', 'Expo', 'Firebase'],
    platforms: ['iOS', 'Android'],
    status: 'In Development',
  },
]

const stats = [
  { value: '2', label: 'Platforms supported' },
  { value: '3', label: 'Apps in development' },
  { value: '10+', label: 'Years combined experience' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.08)_0%,_transparent_60%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-tight tracking-tight mb-6">
            We find the problem.{' '}
            <span className="gradient-text">We build the solution.</span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Invoversion builds high-quality iOS, Android, and web platforms — and provides IT project management, consulting, and Agile transformation services.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/portfolio"
              className="px-6 py-3 rounded-md border border-border text-text-primary hover:bg-surface transition-colors text-sm font-medium"
            >
              See Our Work
            </Link>
            <Link
              href="/contact"
              className="gradient-bg px-6 py-3 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-6 py-20 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-3">What we do</h2>
          <p className="text-text-secondary mb-12">
            Four service lines. One standard of quality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.name}
                  href="/services"
                  className="group bg-surface border border-border rounded-xl p-6 hover:border-accent-start/50 transition-colors"
                >
                  <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-text-primary font-semibold mb-2">{service.name}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-3">What we're building</h2>
          <p className="text-text-secondary mb-12">
            Three products in active development across mobile and web.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div
                key={item.name}
                className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-text-primary font-bold text-xl">{item.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent-start/10 text-accent-start border border-accent-start/20">
                    {item.status}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed flex-1">{item.pitch}</p>
                <div className="flex flex-wrap gap-2">
                  {item.platforms.map((p) => (
                    <span key={p} className="text-xs px-2 py-1 bg-background rounded border border-border text-text-secondary">
                      {p}
                    </span>
                  ))}
                  {item.stack.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 bg-background rounded border border-border text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="px-6 py-16 bg-surface/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="gradient-bg rounded-2xl px-10 py-14 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Have a project in mind?</h2>
            <p className="text-white/80 mb-8">
              Tell us about your problem. We'll tell you how we'd build the solution.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-accent-start font-semibold px-8 py-3 rounded-md hover:bg-white/90 transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify home page renders**

With dev server running (`npm run dev`), open `http://localhost:3000`. Verify:
- Gradient on hero heading renders correctly
- 4 service cards visible
- 3 portfolio cards visible
- Stats row and CTA strip render

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page with hero, services, portfolio, trust signals, CTA"
```

---

## Task 7: Services Page

**Files:**
- Create: `app/services/page.tsx`

**Interfaces:**
- Produces: `/services` renders four service sections (App Development, Web Development, IT Consulting, Agile Coaching)

- [ ] **Step 1: Write the services page**

Create `app/services/page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'App development, web development, IT consulting, and Agile transformation services from Invoversion.',
}

const services = [
  {
    title: 'App Development',
    body: `Invoversion specialises in high-quality iOS and Android applications built with React Native and Expo — a single codebase that delivers genuinely native performance on both platforms. Every product we build starts with a clear problem statement: who is affected, how many people, and what a meaningful solution looks like. We do not build features for the sake of features. We build products that earn a place on people's phones because they solve a real problem better than anything else available. From game mechanics to real-time audience tools to multi-generational family platforms, our portfolio spans categories — united by a commitment to quality, performance, and thoughtful UX.`,
    deliverables: [
      'iOS + Android apps (React Native + Expo)',
      'App store submission',
      'OTA update pipeline',
      'Push notifications',
      'In-app purchases (RevenueCat)',
      'AR features',
      'CI/CD via EAS',
    ],
  },
  {
    title: 'Web Development',
    body: `We build modern web applications using Next.js, Supabase, and Tailwind — the same stack that powers the world's fastest-growing SaaS products. Whether it is a customer-facing platform, an internal tool, or a content-driven site, we approach every web project with the same discipline as a product: clear architecture, multi-tenant data isolation where needed, accessibility from day one, and deployment pipelines that make shipping safe and fast. We do not hand off a codebase and disappear — we build things we are proud to maintain.`,
    deliverables: [
      'Next.js web apps',
      'SaaS platforms',
      'Admin dashboards',
      'API design',
      'Supabase/PostgreSQL data modelling',
      'Vercel deployment',
      'Custom domain configuration',
    ],
  },
  {
    title: 'IT Project Management & Consulting',
    body: `Organisations often have the right technology and the right people — but the wrong structure around them. Invoversion provides hands-on project management and technical consulting for teams that need clarity: clear scope definitions, realistic delivery roadmaps, vendor evaluation, architecture advisory, and risk identification before it becomes a problem. We have experience managing complex multi-phase digital products from discovery through delivery, working directly with stakeholders at all levels to translate business requirements into executable technical plans. We do not produce slide decks and leave. We embed where needed, align teams on what matters, and stay accountable to outcomes.`,
    deliverables: [
      'Project discovery workshops',
      'Scope and roadmap documents',
      'Vendor evaluation reports',
      'Architecture advisory sessions',
      'Risk registers',
      'Stakeholder communication frameworks',
      'Delivery oversight',
    ],
  },
  {
    title: 'Agile Transformation & Coaching',
    body: `Many organisations adopt the language of Agile — standups, sprints, backlogs — without capturing the principles that make it work. Invoversion helps teams close that gap. We assess where a team or organisation sits on the Agile maturity curve, identify the specific friction points (unclear ownership, bloated ceremonies, absent feedback loops, or misaligned incentives), and design a transformation approach that fits the organisation — not a generic framework imposed from the outside. Coaching is hands-on: we work in sprints alongside teams, facilitate retrospectives, coach Product Owners on prioritisation discipline, and help engineering leads build a culture where continuous improvement is the default, not the exception. Whether a team is moving from waterfall for the first time or trying to scale Agile practices across multiple squads, we meet them where they are.`,
    deliverables: [
      'Agile maturity assessment',
      'Transformation roadmap',
      'Sprint facilitation',
      'Retrospective workshops',
      'Product Owner coaching',
      'Team coaching (Scrum/Kanban)',
      'Scaled Agile guidance (SAFe where appropriate)',
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-4">Services</h1>
      <p className="text-text-secondary text-xl mb-16 max-w-2xl">
        We build software and teams. Every engagement starts with the problem, not the solution.
      </p>
      <div className="flex flex-col gap-20">
        {services.map((service) => (
          <section key={service.title} id={service.title.toLowerCase().replace(/\s+/g, '-')}>
            <h2 className="text-3xl font-bold text-text-primary mb-6">{service.title}</h2>
            <p className="text-text-secondary leading-relaxed mb-8">{service.body}</p>
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
                Deliverables
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-text-secondary text-sm">
                    <span className="gradient-text mt-0.5">→</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify page renders**

Open `http://localhost:3000/services`. Check all 4 service sections render with deliverable lists.

- [ ] **Step 3: Commit**

```bash
git add app/services/page.tsx
git commit -m "feat: add services page with four service sections"
```

---

## Task 8: Portfolio Page

**Files:**
- Create: `app/portfolio/page.tsx`

**Interfaces:**
- Produces: `/portfolio` renders three case study cards (Heritage, T3, PresentPro)

- [ ] **Step 1: Write the portfolio page**

Create `app/portfolio/page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Heritage, T3, and PresentPro — three products in active development by Invoversion.',
}

const projects = [
  {
    name: 'Heritage',
    tagline: 'Every family has a story. Heritage makes it last.',
    problem:
      'Families worldwide are losing connection with their cultural roots, ancestors, and shared history. Existing genealogy tools are built for Western nuclear families and fail cultures with large extended families, Arabic naming conventions, or right-to-left languages.',
    solution:
      'Heritage is a private, culture-aware platform where any family worldwide can build their family tree, document their heritage, and stay connected across generations. It supports 1,000+ node trees including deceased members, RTL layout, 20+ languages, and multi-tenant data isolation via Supabase RLS.',
    stack: ['React Native', 'Expo SDK 53', 'Supabase', 'TypeScript', 'Expo Router'],
    platforms: ['iOS', 'Android'],
    status: 'In Development',
  },
  {
    name: 'T3',
    tagline: 'The game you grew up with. Rebuilt for players who want more.',
    problem:
      "Tic-tac-toe hasn't been reimagined for a generation of players who expect adaptive difficulty, premium UX, and experiences that extend into the real world.",
    solution:
      'T3 is a premium tic-tac-toe game with adaptive AI opponents, Ultimate Tic-Tac-Toe mode, and AR board anchoring on real surfaces. Freemium model — classic 3×3 is free, the full experience unlocks for a one-time $4.99 purchase.',
    stack: ['React Native', 'Expo SDK 53', 'ViroReact', 'RevenueCat', 'TypeScript'],
    platforms: ['iOS', 'Android'],
    status: 'In Development',
  },
  {
    name: 'PresentPro',
    tagline: 'Your slides on every phone in the room. No screen required.',
    problem:
      "Presenters struggle to reach audiences in settings without projectors or shared screens. Q&A is noisy and one-directional. Audience engagement tools require laptops, slow setup, and separate platforms.",
    solution:
      "PresentPro is a real-time mobile presentation sharing app. The presenter's slides appear on every audience member's phone instantly, with optional Q&A, polling, and live feedback. Firebase Firestore powers sub-300ms slide propagation across all connected devices.",
    stack: ['React Native', 'Expo SDK 53', 'Firebase Firestore', 'TypeScript'],
    platforms: ['iOS', 'Android'],
    status: 'In Development',
  },
]

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-4">Portfolio</h1>
      <p className="text-text-secondary text-xl mb-16 max-w-2xl">
        Three products in active development. Each started with a problem that mattered.
      </p>
      <div className="flex flex-col gap-10">
        {projects.map((project) => (
          <article
            key={project.name}
            className="bg-surface border border-border rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-1">{project.name}</h2>
                <p className="text-text-secondary">{project.tagline}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-accent-start/10 text-accent-start border border-accent-start/20 self-start">
                {project.status}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
                  The Problem
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm">{project.problem}</p>
              </div>
              <div>
                <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
                  The Solution
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm">{project.solution}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.platforms.map((p) => (
                <span
                  key={p}
                  className="text-xs px-3 py-1 rounded-full border border-border text-text-secondary"
                >
                  {p}
                </span>
              ))}
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full bg-background border border-border text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify page renders**

Open `http://localhost:3000/portfolio`. Verify 3 project cards with problem/solution grids and badge rows.

- [ ] **Step 3: Commit**

```bash
git add app/portfolio/page.tsx
git commit -m "feat: add portfolio page with Heritage, T3, PresentPro case studies"
```

---

## Task 9: Tech Stack Page

**Files:**
- Create: `app/tech-stack/page.tsx`

**Interfaces:**
- Produces: `/tech-stack` renders 6 technology category tables

- [ ] **Step 1: Write the tech stack page**

Create `app/tech-stack/page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Stack',
  description: 'The technologies Invoversion uses to build iOS, Android, and web products.',
}

const categories: { title: string; rows: { tech: string; what: string; how: string }[] }[] = [
  {
    title: 'Mobile',
    rows: [
      { tech: 'React Native', what: 'Cross-platform mobile framework', how: 'All iOS + Android apps — single codebase, native performance' },
      { tech: 'Expo SDK 53', what: 'React Native toolchain + APIs', how: 'Build pipeline, OTA updates, device APIs (camera, AR, notifications)' },
      { tech: 'TypeScript', what: 'Typed JavaScript', how: 'All projects — catches entire classes of bugs at compile time' },
      { tech: 'Expo Router', what: 'File-based navigation', how: 'Screen routing, deep linking, universal links' },
      { tech: 'React Native Reanimated 3', what: 'Native-thread animations', how: '60fps animations without blocking the JS thread' },
      { tech: 'Zustand', what: 'Lightweight state management', how: 'Client-side game state, session state' },
      { tech: 'RevenueCat', what: 'In-app purchase management', how: 'Cross-platform subscription and one-time purchase handling' },
      { tech: 'ViroReact + Expo AR', what: 'AR framework', how: 'Board anchoring, AR family tree overlays' },
      { tech: 'EAS', what: 'Cloud build + OTA', how: 'Production builds, TestFlight/Play Console distribution, over-the-air updates' },
    ],
  },
  {
    title: 'Web',
    rows: [
      { tech: 'Next.js 15', what: 'React framework with App Router', how: 'All web platforms — SSG for marketing, SSR for dynamic data' },
      { tech: 'React 19', what: 'UI library', how: 'Component model, concurrent rendering, server components' },
      { tech: 'TypeScript', what: 'Typed JavaScript', how: 'All web projects — end-to-end type safety' },
      { tech: 'Tailwind CSS v4', what: 'Utility-first CSS', how: 'All styling — no custom CSS files' },
      { tech: 'shadcn/ui', what: 'Accessible component library', how: 'UI components built on Radix primitives' },
      { tech: 'Motion (Framer Motion v12)', what: 'Animation library', how: 'Page transitions, scroll animations, micro-interactions' },
      { tech: 'TipTap', what: 'Rich text editor', how: 'Forum posts, memoirs, heritage documentation' },
      { tech: 'Drizzle ORM', what: 'Type-safe SQL ORM', how: 'Database queries with full TypeScript inference' },
      { tech: 'tRPC', what: 'End-to-end type-safe API', how: 'Internal API layer where REST would be over-engineered' },
    ],
  },
  {
    title: 'Backend & Data',
    rows: [
      { tech: 'Supabase', what: 'PostgreSQL + Auth + RLS + Realtime', how: 'Multi-tenant SaaS backends — data isolation via RLS policies' },
      { tech: 'Neon', what: 'Serverless Postgres', how: "Lightweight projects that don't need the full Supabase surface area" },
      { tech: 'Firebase Firestore', what: 'NoSQL realtime database', how: 'Real-time sync (PresentPro) — sub-100ms propagation to connected clients' },
      { tech: 'Cloudflare R2', what: 'Object storage', how: 'Media, documents, exports — S3-compatible, no egress fees' },
      { tech: 'Cloudflare Workers', what: 'Edge compute', how: 'Middleware, geo-routing, lightweight API at the edge' },
    ],
  },
  {
    title: 'AI & Intelligence',
    rows: [
      { tech: 'Claude API (Anthropic)', what: 'Large language model', how: 'AI personas, post-game coaching, memoir assistants, family historians' },
      { tech: 'Vercel AI SDK', what: 'AI integration toolkit', how: 'Streaming responses, tool use, provider switching' },
      { tech: 'Whisper', what: 'Speech-to-text', how: 'Voice note transcription in Heritage' },
    ],
  },
  {
    title: 'Auth, Email & Payments',
    rows: [
      { tech: 'Supabase Auth', what: 'Authentication service', how: 'Email/password, magic link, Google OAuth — all projects' },
      { tech: 'Clerk', what: 'Auth + user management', how: 'Projects requiring advanced org management and user profiles' },
      { tech: 'Resend', what: 'Transactional email', how: 'Invites, billing alerts, contact notifications — React Email templates' },
      { tech: 'Stripe', what: 'Payment processing', how: 'Web subscriptions, Checkout, Customer Portal, Webhooks' },
      { tech: 'RevenueCat', what: 'Mobile payments', how: 'iOS + Android in-app purchases and subscriptions' },
    ],
  },
  {
    title: 'Infrastructure & Monitoring',
    rows: [
      { tech: 'Vercel', what: 'Deployment platform', how: 'All Next.js deployments — preview branches, edge network' },
      { tech: 'GitHub Actions', what: 'CI/CD', how: 'Automated testing, linting, deployment triggers' },
      { tech: 'EAS Build', what: 'Mobile CI/CD', how: 'Cloud builds for iOS + Android, TestFlight/Play Console delivery' },
      { tech: 'Sentry', what: 'Error tracking', how: 'Runtime error monitoring across web and mobile' },
      { tech: 'PostHog', what: 'Product analytics', how: 'Feature usage, funnel analysis, session replays' },
      { tech: 'Vitest', what: 'Unit testing', how: 'Fast unit and integration tests' },
      { tech: 'Playwright', what: 'E2E testing', how: 'Browser automation for critical user flows' },
      { tech: 'Detox', what: 'Mobile E2E testing', how: 'End-to-end testing on iOS and Android simulators' },
    ],
  },
]

export default function TechStackPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-4">Tech Stack</h1>
      <p className="text-text-secondary text-xl mb-16 max-w-2xl">
        We choose tools based on what ships great products, not trends. This is what we reach for.
      </p>
      <div className="flex flex-col gap-14">
        {categories.map((cat) => (
          <section key={cat.title}>
            <h2 className="text-2xl font-bold text-text-primary mb-6 pb-3 border-b border-border">
              {cat.title}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="text-text-secondary font-semibold pb-3 pr-6 w-48">Technology</th>
                    <th className="text-text-secondary font-semibold pb-3 pr-6">What it is</th>
                    <th className="text-text-secondary font-semibold pb-3">How we use it</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.rows.map((row) => (
                    <tr key={row.tech} className="border-t border-border">
                      <td className="py-3 pr-6 font-medium text-text-primary align-top">{row.tech}</td>
                      <td className="py-3 pr-6 text-text-secondary align-top">{row.what}</td>
                      <td className="py-3 text-text-secondary align-top">{row.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify page renders**

Open `http://localhost:3000/tech-stack`. Verify 6 category sections render with tables.

- [ ] **Step 3: Commit**

```bash
git add app/tech-stack/page.tsx
git commit -m "feat: add tech stack page with six technology category tables"
```

---

## Task 10: About Page

**Files:**
- Create: `app/about/page.tsx`

**Interfaces:**
- Produces: `/about` renders mission block, values, company fact row

- [ ] **Step 1: Write the about page**

Create `app/about/page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Invoversion LLC — software built on the conviction that the best products solve problems that actually matter.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-16">About</h1>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Why we exist</h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            Invoversion was founded on a simple conviction — that the best software solves problems that actually matter to people. Not productivity tools for knowledge workers who already have ten. Not another social feed optimised for engagement.
          </p>
          <p>
            We look for problems in the social and technical space that affect large populations and are underserved by existing solutions: families losing connection with their roots, presenters struggling to reach audiences without screens, players wanting more than the game they grew up with.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text-primary mb-6">What we value</h2>
        <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
          {[
            { value: 'Quality over speed', detail: 'We take the time to do it right. Cutting corners is just borrowing time from later.' },
            { value: 'Clarity over complexity', detail: 'Every line of code and every sentence in a document should earn its place.' },
            { value: 'Products that improve with use', detail: 'Not just at launch. We build things we are proud to maintain.' },
          ].map((item) => (
            <div key={item.value} className="flex gap-4">
              <span className="gradient-text font-bold mt-0.5">→</span>
              <div>
                <p className="text-text-primary font-semibold mb-1">{item.value}</p>
                <p className="text-text-secondary text-sm">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company facts */}
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-6">The company</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Structure', value: 'LLC registered in the United States' },
            { label: 'Primary platform', value: 'iOS + Android first' },
            { label: 'Web', value: 'Web where it matters' },
          ].map((fact) => (
            <div key={fact.label} className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-secondary text-xs uppercase tracking-widest mb-2">{fact.label}</p>
              <p className="text-text-primary font-medium text-sm">{fact.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify page renders**

Open `http://localhost:3000/about`. Verify mission, values, and company fact blocks render.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add about page with mission, values, company facts"
```

---

## Task 11: Contact Form + Validation + Server Action + Email

**Files:**
- Create: `lib/validations/contact.ts`
- Create: `actions/contact.ts`
- Create: `emails/admin-notification.tsx`
- Create: `components/contact-form.tsx`
- Create: `app/contact/page.tsx`
- Create: `__tests__/lib/validations/contact.test.ts`
- Create: `__tests__/actions/contact.test.ts`

**Interfaces:**
- Produces:
  - `contactSchema` — Zod schema; `ContactFormData` — inferred type
  - `submitContact(prevState: ContactFormState, formData: FormData): Promise<ContactFormState>` — server action
  - `AdminNotification(props)` — React Email component
  - `<ContactForm />` — client component using `useActionState`

- [ ] **Step 1: Write the Zod validation schema**

Create `lib/validations/contact.ts`:

```typescript
import { z } from 'zod'

export const SERVICE_OPTIONS = [
  'App Development',
  'Web Development',
  'IT Consulting & PM',
  'Agile Transformation',
  'Other',
] as const

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  company: z.string().optional(),
  service: z.enum(SERVICE_OPTIONS, {
    errorMap: () => ({ message: 'Please select a service' }),
  }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  _honeypot: z.string().max(0, '').optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

export type ContactFormState = {
  success: boolean
  name?: string
  errors?: {
    name?: string[]
    email?: string[]
    company?: string[]
    service?: string[]
    message?: string[]
    _form?: string[]
  }
}
```

- [ ] **Step 2: Write the failing validation tests**

Create `__tests__/lib/validations/contact.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validations/contact'

describe('contactSchema', () => {
  const valid = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    service: 'App Development' as const,
    message: 'I have a project I would like to discuss with you.',
  }

  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain('Name is required')
    }
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Enter a valid email address')
    }
  })

  it('rejects message shorter than 20 chars', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'Too short' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toContain(
        'Message must be at least 20 characters'
      )
    }
  })

  it('rejects an invalid service value', () => {
    const result = contactSchema.safeParse({ ...valid, service: 'Hacking' })
    expect(result.success).toBe(false)
  })

  it('rejects a filled honeypot field', () => {
    const result = contactSchema.safeParse({ ...valid, _honeypot: 'bot-text' })
    expect(result.success).toBe(false)
  })

  it('accepts an optional company field', () => {
    const result = contactSchema.safeParse({ ...valid, company: 'Acme Corp' })
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail (schema doesn't exist yet)**

```bash
npm test
```

Expected: FAIL — `Cannot find module '@/lib/validations/contact'`

Step 1 already creates the file, so re-run after step 1 is done:

```bash
npm test
```

Expected: All 7 tests PASS.

- [ ] **Step 4: Write the admin notification email template**

Create `emails/admin-notification.tsx`:

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components'

interface AdminNotificationProps {
  name: string
  email: string
  company?: string
  service: string
  message: string
  submissionId: string
}

export default function AdminNotification({
  name,
  email,
  company,
  service,
  message,
  submissionId,
}: AdminNotificationProps) {
  const adminUrl = `https://infoversion.com/admin/queries/${submissionId}`

  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name} — {service}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f5', padding: '32px 0' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            New enquiry from {name}
          </Text>
          <Text style={{ color: '#71717a', marginTop: '0' }}>{service}</Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ margin: '4px 0' }}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={{ margin: '4px 0' }}>
            <strong>Email:</strong> {email}
          </Text>
          {company && (
            <Text style={{ margin: '4px 0' }}>
              <strong>Company:</strong> {company}
            </Text>
          )}
          <Text style={{ margin: '4px 0' }}>
            <strong>Service:</strong> {service}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ fontWeight: 'bold', marginBottom: '8px' }}>Message</Text>
          <Text
            style={{
              backgroundColor: '#f4f4f5',
              padding: '16px',
              borderRadius: '6px',
              color: '#3f3f46',
              lineHeight: '1.6',
            }}
          >
            {message}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Link
            href={adminUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            View in admin panel →
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 5: Write the contact server action**

Create `actions/contact.ts`:

```typescript
'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'
import { contactSchema, type ContactFormState } from '@/lib/validations/contact'
import AdminNotification from '@/emails/admin-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    company: (formData.get('company') as string) || undefined,
    service: formData.get('service') as string,
    message: formData.get('message') as string,
    _honeypot: (formData.get('_honeypot') as string) || '',
  }

  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  // Silently discard spam without revealing rejection
  if (result.data._honeypot) {
    return { success: true, name: result.data.name }
  }

  const supabase = createServiceClient()
  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: result.data.name,
      email: result.data.email,
      company: result.data.company ?? null,
      service: result.data.service,
      message: result.data.message,
    })
    .select('id')
    .single()

  if (error || !submission) {
    return {
      success: false,
      errors: { _form: ['Something went wrong. Please try again.'] },
    }
  }

  await resend.emails.send({
    from: 'Invoversion <notifications@infoversion.com>',
    to: process.env.ADMIN_EMAIL!,
    subject: `New enquiry from ${result.data.name}`,
    react: AdminNotification({
      name: result.data.name,
      email: result.data.email,
      company: result.data.company,
      service: result.data.service,
      message: result.data.message,
      submissionId: submission.id,
    }),
  })

  return { success: true, name: result.data.name }
}
```

- [ ] **Step 6: Write the server action tests**

Create `__tests__/actions/contact.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Must mock before importing action
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null }) },
  })),
}))

vi.mock('@/emails/admin-notification', () => ({
  default: vi.fn().mockReturnValue(null),
}))

import { submitContact } from '@/actions/contact'
import { createServiceClient } from '@/lib/supabase/service'

function makeFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  const defaults: Record<string, string> = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    service: 'App Development',
    message: 'I have a project I would like to discuss with you in detail.',
    _honeypot: '',
    ...overrides,
  }
  Object.entries(defaults).forEach(([k, v]) => fd.set(k, v))
  return fd
}

const initial = { success: false as const }

describe('submitContact', () => {
  let mockSingle: ReturnType<typeof vi.fn>
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle = vi.fn().mockResolvedValue({ data: { id: 'uuid-123' }, error: null })
    const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) })
    mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    vi.mocked(createServiceClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServiceClient>)
  })

  it('returns field errors for missing name', async () => {
    const result = await submitContact(initial, makeFormData({ name: '' }))
    expect(result.success).toBe(false)
    expect(result.errors?.name).toBeDefined()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('returns field errors for invalid email', async () => {
    const result = await submitContact(initial, makeFormData({ email: 'bad' }))
    expect(result.success).toBe(false)
    expect(result.errors?.email).toBeDefined()
  })

  it('returns field errors for short message', async () => {
    const result = await submitContact(initial, makeFormData({ message: 'Too short' }))
    expect(result.success).toBe(false)
    expect(result.errors?.message).toBeDefined()
  })

  it('silently succeeds for honeypot-filled submissions without inserting', async () => {
    const result = await submitContact(initial, makeFormData({ _honeypot: 'bot' }))
    expect(result.success).toBe(true)
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('inserts submission and returns success with name on valid data', async () => {
    const result = await submitContact(initial, makeFormData())
    expect(result.success).toBe(true)
    expect(result.name).toBe('Jane Smith')
    expect(mockFrom).toHaveBeenCalledWith('contact_submissions')
  })

  it('returns form error when Supabase insert fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('DB error') })
    const result = await submitContact(initial, makeFormData())
    expect(result.success).toBe(false)
    expect(result.errors?._form).toBeDefined()
  })
})
```

- [ ] **Step 7: Run tests**

```bash
npm test
```

Expected: All tests in `contact.test.ts` and `contact.test.ts` PASS.

- [ ] **Step 8: Write the ContactForm client component**

Create `components/contact-form.tsx`:

```tsx
'use client'

import { useActionState } from 'react'
import { submitContact } from '@/actions/contact'
import { SERVICE_OPTIONS, type ContactFormState } from '@/lib/validations/contact'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const initial: ContactFormState = { success: false }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.success && state.name) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <p className="text-text-primary font-semibold text-lg mb-2">Message received.</p>
        <p className="text-text-secondary">
          Thank you, {state.name}. We'll be in touch within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="_honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
      />

      <div className="space-y-2">
        <Label htmlFor="name">Full name <span aria-hidden>*</span></Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="bg-surface border-border text-text-primary"
        />
        {state.errors?.name && (
          <p className="text-red-400 text-sm">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address <span aria-hidden>*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="bg-surface border-border text-text-primary"
        />
        {state.errors?.email && (
          <p className="text-red-400 text-sm">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company / Organisation</Label>
        <Input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className="bg-surface border-border text-text-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service interested in <span aria-hidden>*</span></Label>
        <select
          id="service"
          name="service"
          required
          defaultValue=""
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start"
        >
          <option value="" disabled>Select a service</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {state.errors?.service && (
          <p className="text-red-400 text-sm">{state.errors.service[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message <span aria-hidden>*</span></Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={5}
          className="bg-surface border-border text-text-primary resize-none"
        />
        {state.errors?.message && (
          <p className="text-red-400 text-sm">{state.errors.message[0]}</p>
        )}
      </div>

      {state.errors?._form && (
        <p className="text-red-400 text-sm">{state.errors._form[0]}</p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="gradient-bg w-full text-white hover:opacity-90 transition-opacity"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 9: Write the contact page**

Create `app/contact/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Invoversion — app development, web development, consulting, and Agile coaching.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-4">Get in touch</h1>
      <p className="text-text-secondary text-xl mb-12">
        Tell us about your problem. We'll be in touch within 1 business day.
      </p>
      <ContactForm />
    </div>
  )
}
```

- [ ] **Step 10: Test the contact form manually**

With dev server running, open `http://localhost:3000/contact`:
1. Submit the form with missing fields — verify field-level errors appear inline
2. Fill in all fields with valid data and submit — verify success message with the name appears
3. Note: email sending will fail in dev (no real Resend key) — that's expected, the success message should still render because the Supabase insert will also fail in dev without a real DB. Connect Supabase to test end-to-end.

- [ ] **Step 11: Commit**

```bash
git add lib/validations/contact.ts actions/contact.ts emails/admin-notification.tsx \
  components/contact-form.tsx app/contact/page.tsx __tests__/
git commit -m "feat: add contact form with Zod validation, server action, admin email notification"
```

---

## Task 12: Admin Login

**Files:**
- Create: `actions/admin.ts` (signIn + signOut)
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`

**Interfaces:**
- Produces:
  - `signIn(formData: FormData): Promise<{ error?: string }>` — server action
  - `signOut(): Promise<void>` — server action
  - `/admin/login` — email + password form; on success redirects to `/admin`
  - `AdminLayout` — wraps all `/admin/*` routes, server-side confirms auth

- [ ] **Step 1: Write admin server actions (signIn + signOut)**

Create `actions/admin.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import ContactReply from '@/emails/contact-reply'
import type { ContactFormState } from '@/lib/validations/contact'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function signIn(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  redirect('/admin')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function markAsRead(submissionId: string) {
  const supabase = createServiceClient()
  await supabase
    .from('contact_submissions')
    .update({ status: 'read' })
    .eq('id', submissionId)
    .eq('status', 'new')
  revalidatePath('/admin/queries')
  revalidatePath('/admin')
}

export async function replyToSubmission(
  submissionId: string,
  contactEmail: string,
  contactName: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  if (!body.trim()) {
    return { success: false, error: 'Reply body cannot be empty.' }
  }

  const { error: emailError } = await resend.emails.send({
    from: 'Invoversion <hello@infoversion.com>',
    to: contactEmail,
    replyTo: process.env.ADMIN_EMAIL,
    subject: 'Re: Your enquiry to Invoversion',
    react: ContactReply({ contactName, replyBody: body }),
  })

  if (emailError) {
    return { success: false, error: 'Failed to send email. Please try again.' }
  }

  const supabase = createServiceClient()
  await supabase.from('replies').insert({ submission_id: submissionId, body })
  await supabase
    .from('contact_submissions')
    .update({ status: 'replied' })
    .eq('id', submissionId)

  revalidatePath(`/admin/queries/${submissionId}`)
  revalidatePath('/admin/queries')
  revalidatePath('/admin')

  return { success: true }
}
```

- [ ] **Step 2: Write the reply email template**

Create `emails/contact-reply.tsx`:

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Preview,
} from '@react-email/components'

interface ContactReplyProps {
  contactName: string
  replyBody: string
}

export default function ContactReply({ contactName, replyBody }: ContactReplyProps) {
  return (
    <Html>
      <Head />
      <Preview>A reply from Invoversion</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f5', padding: '32px 0' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <Text style={{ fontSize: '16px', marginBottom: '8px' }}>Hi {contactName},</Text>
          <Text style={{ color: '#3f3f46', lineHeight: '1.6' }}>
            Thank you for reaching out to Invoversion. Here is our response:
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text
            style={{
              backgroundColor: '#f4f4f5',
              padding: '16px',
              borderRadius: '6px',
              color: '#3f3f46',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}
          >
            {replyBody}
          </Text>
          <Hr style={{ borderColor: '#e4e4e7', margin: '24px 0' }} />
          <Text style={{ color: '#71717a', fontSize: '12px' }}>
            Invoversion LLC · infoversion.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 3: Write the admin layout (server-side auth guard)**

Create `app/admin/layout.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/admin/sign-out-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm text-zinc-100">Invoversion Admin</span>
            <nav className="flex items-center gap-4">
              <Link href="/admin" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/queries" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
                Queries
              </Link>
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Write the SignOutButton client component**

Create `components/admin/sign-out-button.tsx`:

```tsx
'use client'

import { signOut } from '@/actions/admin'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
    >
      Sign out
    </button>
  )
}
```

- [ ] **Step 5: Write the admin login page**

Create `app/admin/login/page.tsx`:

```tsx
'use client'

import { useActionState } from 'react'
import { signIn } from '@/actions/admin'

const initial = { error: undefined }

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signIn, initial)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
        <p className="text-zinc-400 text-sm mb-8">Sign in to Invoversion admin panel.</p>
        <form action={action} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-zinc-300 text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-zinc-300 text-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {state.error && (
            <p className="text-red-400 text-sm">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify login flow**

Open `http://localhost:3000/admin`. Expected: redirects to `/admin/login`.
Try submitting empty form. Expected: "Email and password are required." error.
(Full auth test requires a real Supabase project with a seeded admin user.)

- [ ] **Step 7: Commit**

```bash
git add actions/admin.ts emails/contact-reply.tsx app/admin/layout.tsx \
  app/admin/login/page.tsx components/admin/sign-out-button.tsx
git commit -m "feat: add admin auth (login/logout), route protection layout, reply email template"
```

---

## Task 13: Admin Dashboard + Query List

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/queries/page.tsx`

**Interfaces:**
- Consumes: `createServiceClient()`, `ContactSubmission` type, `markAsRead` server action
- Produces:
  - `/admin` — shows unread count + 5 most recent submissions
  - `/admin/queries` — full list sorted newest-first with status badges, clicking a row marks it `read` and navigates to detail

- [ ] **Step 1: Write the admin dashboard page**

Create `app/admin/page.tsx`:

```tsx
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import type { ContactSubmission } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  const [{ count: unreadCount }, { data: recent }] = await Promise.all([
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const submissions = (recent ?? []) as ContactSubmission[]

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          {unreadCount ?? 0} unread {(unreadCount ?? 0) === 1 ? 'submission' : 'submissions'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Unread</p>
          <p className="text-3xl font-bold text-blue-400">{unreadCount ?? 0}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent submissions</h2>
          <Link href="/admin/queries" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            View all →
          </Link>
        </div>
        {submissions.length === 0 ? (
          <p className="text-zinc-500 text-sm">No submissions yet.</p>
        ) : (
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            {submissions.map((s) => (
              <Link
                key={s.id}
                href={`/admin/queries/${s.id}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.name}</p>
                  <p className="text-zinc-500 text-xs truncate">{s.email} · {s.service}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[s.status]}`}
                >
                  {s.status}
                </span>
                <span className="text-zinc-600 text-xs flex-shrink-0">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Write the query list page**

Create `app/admin/queries/page.tsx`:

```tsx
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import type { ContactSubmission } from '@/lib/types'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function QueriesPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const submissions = (data ?? []) as ContactSubmission[]
  const unread = submissions.filter((s) => s.status === 'new').length

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Queries</h1>
        <p className="text-zinc-400 text-sm">{submissions.length} total · {unread} unread</p>
      </div>

      {submissions.length === 0 ? (
        <p className="text-zinc-500 text-sm">No submissions yet.</p>
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Contact</span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Service</span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Date</span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Status</span>
          </div>
          {submissions.map((s) => (
            <Link
              key={s.id}
              href={`/admin/queries/${s.id}`}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/60 transition-colors"
            >
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${s.status === 'new' ? 'text-white' : 'text-zinc-300'}`}>
                  {s.name}
                </p>
                <p className="text-zinc-500 text-xs truncate">{s.email}</p>
              </div>
              <span className="text-zinc-400 text-xs whitespace-nowrap">{s.service}</span>
              <span className="text-zinc-600 text-xs whitespace-nowrap">
                {new Date(s.created_at).toLocaleDateString()}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[s.status]}`}
              >
                {s.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 3: Verify admin pages render (with real Supabase)**

After connecting Supabase and seeding an admin user via Supabase dashboard:
1. Sign in at `/admin/login`
2. Verify dashboard shows unread count and recent submissions
3. Navigate to `/admin/queries` — verify full list with status badges

- [ ] **Step 4: Commit**

```bash
git add app/admin/page.tsx app/admin/queries/page.tsx
git commit -m "feat: add admin dashboard and query list with status badges"
```

---

## Task 14: Admin Query Detail + Reply

**Files:**
- Create: `app/admin/queries/[id]/page.tsx`
- Create: `components/admin/reply-form.tsx`
- Create: `__tests__/actions/admin.test.ts`

**Interfaces:**
- Consumes:
  - `replyToSubmission(submissionId, contactEmail, contactName, body): Promise<{success, error?}>` from `actions/admin.ts`
  - `markAsRead(submissionId): Promise<void>` from `actions/admin.ts`
  - `ContactSubmission`, `Reply` from `lib/types.ts`
- Produces:
  - `/admin/queries/[id]` — full submission detail + reply history + reply composer with optimistic update
  - `<ReplyForm />` — client component with `useOptimistic` + `useTransition`

- [ ] **Step 1: Write the server action tests**

Create `__tests__/actions/admin.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null }) },
  })),
}))

vi.mock('@/emails/contact-reply', () => ({ default: vi.fn().mockReturnValue(null) }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

import { replyToSubmission } from '@/actions/admin'
import { createServiceClient } from '@/lib/supabase/service'

describe('replyToSubmission', () => {
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({}) })
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    mockFrom = vi.fn().mockImplementation((table: string) => {
      if (table === 'replies') return { insert: mockInsert }
      return { update: mockUpdate }
    })
    vi.mocked(createServiceClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServiceClient>)
  })

  it('returns error for empty reply body', async () => {
    const result = await replyToSubmission('sub-id', 'user@example.com', 'Jane', '   ')
    expect(result.success).toBe(false)
    expect(result.error).toContain('empty')
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('inserts reply and updates status on success', async () => {
    const result = await replyToSubmission(
      'sub-id',
      'user@example.com',
      'Jane',
      'Thank you for reaching out!'
    )
    expect(result.success).toBe(true)
    expect(mockFrom).toHaveBeenCalledWith('replies')
    expect(mockFrom).toHaveBeenCalledWith('contact_submissions')
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: All tests PASS including new `admin.test.ts`.

- [ ] **Step 3: Write the ReplyForm client component**

Create `components/admin/reply-form.tsx`:

```tsx
'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { replyToSubmission } from '@/actions/admin'
import type { Reply } from '@/lib/types'

interface ReplyFormProps {
  submissionId: string
  contactEmail: string
  contactName: string
  initialReplies: Reply[]
}

export function ReplyForm({
  submissionId,
  contactEmail,
  contactName,
  initialReplies,
}: ReplyFormProps) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    initialReplies,
    (state, newReply: Reply) => [...state, newReply]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setError(null)

    const optimistic: Reply = {
      id: crypto.randomUUID(),
      submission_id: submissionId,
      body: body.trim(),
      sent_at: new Date().toISOString(),
    }

    startTransition(async () => {
      addOptimisticReply(optimistic)
      const result = await replyToSubmission(submissionId, contactEmail, contactName, body.trim())
      if (!result.success) {
        setError(result.error ?? 'Failed to send reply.')
      } else {
        setBody('')
      }
    })
  }

  return (
    <div className="mt-8">
      {/* Reply history */}
      {optimisticReplies.length > 0 && (
        <div className="mb-6 space-y-4">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
            Previous replies
          </h3>
          {optimisticReplies.map((reply) => (
            <div
              key={reply.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
            >
              <p className="text-zinc-200 text-sm whitespace-pre-wrap leading-relaxed">
                {reply.body}
              </p>
              <p className="text-zinc-600 text-xs mt-2">
                {new Date(reply.sent_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply composer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Send a reply</h3>
        <p className="text-zinc-500 text-xs mb-4">
          Subject: <span className="text-zinc-400">Re: Your enquiry to Invoversion</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write your reply…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-600"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isPending || !body.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isPending ? 'Sending…' : 'Send Reply'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write the query detail page**

Create `app/admin/queries/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { markAsRead } from '@/actions/admin'
import { ReplyForm } from '@/components/admin/reply-form'
import type { ContactSubmission, Reply } from '@/lib/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function QueryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: submissionData }, { data: repliesData }] = await Promise.all([
    supabase.from('contact_submissions').select('*').eq('id', id).single(),
    supabase.from('replies').select('*').eq('submission_id', id).order('sent_at', { ascending: true }),
  ])

  if (!submissionData) notFound()

  const submission = submissionData as ContactSubmission
  const replies = (repliesData ?? []) as Reply[]

  // Mark as read if it was new (fire and forget — no await)
  if (submission.status === 'new') {
    markAsRead(id)
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/queries"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          ← All queries
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{submission.name}</h1>
            <p className="text-zinc-400 text-sm">{submission.email}</p>
            {submission.company && (
              <p className="text-zinc-500 text-sm">{submission.company}</p>
            )}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full border self-start ${STATUS_STYLES[submission.status]}`}
          >
            {submission.status}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Service</p>
            <p className="text-zinc-200">{submission.service}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Received</p>
            <p className="text-zinc-200">
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Message</p>
          <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
            {submission.message}
          </p>
        </div>
      </div>

      <ReplyForm
        submissionId={submission.id}
        contactEmail={submission.email}
        contactName={submission.name}
        initialReplies={replies}
      />
    </>
  )
}
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 6: Verify admin query flow end-to-end**

With a real Supabase connection and admin user:
1. Submit the contact form at `/contact`
2. Log into admin at `/admin` — verify unread count increments
3. Navigate to `/admin/queries` — verify new submission appears with `new` badge
4. Click the submission — verify it navigates to detail page and status changes to `read`
5. Write a reply and click Send — verify reply appears immediately (optimistic), then email lands in contact's inbox
6. Verify status changes to `replied` in the list

- [ ] **Step 7: Commit**

```bash
git add app/admin/queries/[id]/page.tsx components/admin/reply-form.tsx \
  __tests__/actions/admin.test.ts
git commit -m "feat: add query detail page with optimistic reply UI and email delivery"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Home `/` — Hero, Services Overview (4 cards), Featured Portfolio (3 cards), Trust Signals, CTA Strip → Task 6
- [x] Services `/services` — 4 service sections with deliverables → Task 7
- [x] Portfolio `/portfolio` — 3 case study cards → Task 8
- [x] Tech Stack `/tech-stack` — 6 category tables → Task 9
- [x] About `/about` — Mission, values, company facts → Task 10
- [x] Contact `/contact` — Form with honeypot, Zod client+server validation, success/error states → Task 11
- [x] Admin notification email on new submission → Task 11
- [x] Admin login `/admin/login` — email+password, error state → Task 12
- [x] Admin dashboard `/admin` — unread count, recent 5 → Task 13
- [x] Query list `/admin/queries` — status badges (new/read/replied), newest-first → Task 13
- [x] Clicking a row marks status as `read` and navigates → Task 14
- [x] Query detail `/admin/queries/[id]` — full submission + reply history → Task 14
- [x] Reply composer — pre-populated subject, optimistic UI, Resend email to contact → Task 14
- [x] RLS policies: public INSERT, no public SELECT → Task 3
- [x] Service role key: server-only, never in client bundles → Tasks 3, 11, 12, 13, 14
- [x] Middleware protecting `/admin/*` at the edge → Task 4
- [x] Browser tab unread count — covered by dashboard unread count display; browser tab title requires client-side update outside scope of SSR pages. Note: the spec mentions "(3) Invoversion Admin" tab title — add this in `app/admin/layout.tsx` metadata export:

  Add to `app/admin/layout.tsx` before the default export:
  ```typescript
  // Dynamic metadata for unread count is not supported in static exports;
  // the layout fetches count and sets title server-side on each navigation.
  export async function generateMetadata() {
    const supabase = createServiceClient()
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
    return {
      title: count ? `(${count}) Invoversion Admin` : 'Invoversion Admin',
    }
  }
  ```

  Add this function to `app/admin/layout.tsx` (Task 12 file).

- [x] Dark mode only — `<html class="dark">` in root layout → Task 2
- [x] Geist font → Task 2
- [x] Color tokens → Task 2
- [x] `NEXT_PUBLIC_` prefix on Supabase URL + anon key → Task 3
- [x] Sticky nav + gradient Contact button → Task 5
- [x] Success state on contact form: "Thank you, [name]. We'll be in touch within 1 business day." → Task 11
- [x] Error state: inline field-level errors + generic server error with retry → Task 11
- [x] Resend: reply-to admin address on contact reply → Task 12 (`replyTo: process.env.ADMIN_EMAIL`)
- [x] All 6 public pages have `<Metadata>` titles and descriptions → Tasks 6–11

**Type consistency:** All types flow from `lib/types.ts` (`ContactSubmission`, `Reply`). `ContactFormState` defined once in `lib/validations/contact.ts` and imported in both `actions/contact.ts` and `components/contact-form.tsx`. `replyToSubmission` signature is consistent between `actions/admin.ts` and `components/admin/reply-form.tsx`.

**No placeholders found.**

---

## Deployment Checklist (post-build)

Before deploying to Vercel:

1. Create a Supabase project and run the migration SQL
2. Seed an admin user: Supabase dashboard → Authentication → Users → Add user (set email + password)
3. Set all env vars in Vercel project settings: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`
4. In Resend: verify `infoversion.com` domain and configure DNS records
5. Link Vercel project to `infoversion.com` domain

Run before first deploy:
```bash
npm run build
```
Expected: Zero TypeScript errors, zero ESLint errors, successful static export of public pages.
