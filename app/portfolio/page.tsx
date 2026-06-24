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
