import type { Metadata } from 'next'
import { Smartphone, Globe, LineChart, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Services',
  description: 'App development, web development, IT consulting, and Agile transformation services from Infoversion.',
}

const services = [
  {
    icon: Smartphone,
    title: 'App Development',
    body: `Infoversion specialises in high-quality iOS and Android applications built with React Native and Expo — a single codebase that delivers genuinely native performance on both platforms. Every product we build starts with a clear problem statement: who is affected, how many people, and what a meaningful solution looks like. We do not build features for the sake of features. We build products that earn a place on people's phones because they solve a real problem better than anything else available. From game mechanics to real-time audience tools to multi-generational family platforms, our portfolio spans categories — united by a commitment to quality, performance, and thoughtful UX.`,
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
    icon: Globe,
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
    icon: LineChart,
    title: 'IT Project Management & Consulting',
    body: `Organisations often have the right technology and the right people — but the wrong structure around them. Infoversion provides hands-on project management and technical consulting for teams that need clarity: clear scope definitions, realistic delivery roadmaps, vendor evaluation, architecture advisory, and risk identification before it becomes a problem. We have experience managing complex multi-phase digital products from discovery through delivery, working directly with stakeholders at all levels to translate business requirements into executable technical plans. We do not produce slide decks and leave. We embed where needed, align teams on what matters, and stay accountable to outcomes.`,
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
    icon: Users,
    title: 'Agile Transformation & Coaching',
    body: `Many organisations adopt the language of Agile — standups, sprints, backlogs — without capturing the principles that make it work. Infoversion helps teams close that gap. We assess where a team or organisation sits on the Agile maturity curve, identify the specific friction points (unclear ownership, bloated ceremonies, absent feedback loops, or misaligned incentives), and design a transformation approach that fits the organisation — not a generic framework imposed from the outside. Coaching is hands-on: we work in sprints alongside teams, facilitate retrospectives, coach Product Owners on prioritisation discipline, and help engineering leads build a culture where continuous improvement is the default, not the exception.`,
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
        {services.map((service) => {
          const Icon = service.icon
          return (
            <section key={service.title} id={service.title.toLowerCase().replace(/\s+/g, '-')}>
              <div className="flex items-center gap-4 mb-6">
                <div className="gradient-bg w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-text-primary">{service.title}</h2>
              </div>
              <p className="text-text-secondary leading-relaxed mb-8">{service.body}</p>
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-4">
                  Deliverables
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-text-secondary text-sm">
                      <span className="gradient-text mt-0.5 flex-shrink-0">✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
