import type { Metadata } from 'next'
import { Smartphone, Globe, Database, Brain, Shield, Server } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tech Stack — React Native, Expo, Supabase, Next.js',
  description:
    'Infoversion builds with React Native, Expo, Supabase, Next.js, TypeScript, Firebase, and RevenueCat. Modern, proven technologies for iOS, Android, and web products.',
  alternates: { canonical: '/tech-stack' },
  openGraph: {
    title: 'Tech Stack — Infoversion',
    description:
      'React Native, Expo, Supabase, Next.js, TypeScript — the technology stack powering Infoversion products.',
    url: 'https://infoversion.com/tech-stack',
  },
}

const categories: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  rows: { tech: string; what: string; how: string }[]
}[] = [
  {
    title: 'Mobile',
    icon: Smartphone,
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
    icon: Globe,
    rows: [
      { tech: 'Next.js 15', what: 'React framework with App Router', how: 'All web platforms — SSG for marketing, SSR for dynamic data' },
      { tech: 'React 19', what: 'UI library', how: 'Component model, concurrent rendering, server components' },
      { tech: 'TypeScript', what: 'Typed JavaScript', how: 'All web projects — end-to-end type safety' },
      { tech: 'Tailwind CSS v4', what: 'Utility-first CSS', how: 'All styling — no custom CSS files' },
      { tech: 'shadcn/ui', what: 'Accessible component library', how: 'UI components built on Base UI primitives' },
      { tech: 'Motion (Framer Motion v12)', what: 'Animation library', how: 'Page transitions, scroll animations, micro-interactions' },
      { tech: 'TipTap', what: 'Rich text editor', how: 'Forum posts, memoirs, heritage documentation' },
      { tech: 'Drizzle ORM', what: 'Type-safe SQL ORM', how: 'Database queries with full TypeScript inference' },
      { tech: 'tRPC', what: 'End-to-end type-safe API', how: 'Internal API layer where REST would be over-engineered' },
    ],
  },
  {
    title: 'Backend & Data',
    icon: Database,
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
    icon: Brain,
    rows: [
      { tech: 'Claude API (Anthropic)', what: 'Large language model', how: 'AI personas, post-game coaching, memoir assistants, family historians' },
      { tech: 'Vercel AI SDK', what: 'AI integration toolkit', how: 'Streaming responses, tool use, provider switching' },
      { tech: 'Whisper', what: 'Speech-to-text', how: 'Voice note transcription in Heritage' },
    ],
  },
  {
    title: 'Auth, Email & Payments',
    icon: Shield,
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
    icon: Server,
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
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <section key={cat.title}>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                <div className="gradient-bg w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">{cat.title}</h2>
              </div>
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
          )
        })}
      </div>
    </div>
  )
}
