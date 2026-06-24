import type { Metadata } from 'next'
import { Award, Focus, TrendingUp, Building2, Smartphone, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Infoversion LLC — software built on the conviction that the best products solve problems that actually matter.',
}

const values = [
  {
    icon: Award,
    label: 'Quality over speed',
    detail: 'We take the time to do it right. Cutting corners is just borrowing time from later.',
  },
  {
    icon: Focus,
    label: 'Clarity over complexity',
    detail: 'Every line of code and every sentence in a document should earn its place.',
  },
  {
    icon: TrendingUp,
    label: 'Products that improve with use',
    detail: 'Not just at launch. We build things we are proud to maintain.',
  },
]

const facts = [
  { icon: Building2, label: 'Structure', value: 'LLC registered in the United States' },
  { icon: Smartphone, label: 'Primary platform', value: 'iOS + Android first' },
  { icon: Globe, label: 'Web', value: 'Web where it matters' },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-16">About</h1>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Why we exist</h2>
        <div className="text-text-secondary leading-relaxed space-y-4">
          <p>
            Infoversion was founded on a simple conviction — that the best software solves problems
            that actually matter to people. Not productivity tools for knowledge workers who already
            have ten. Not another social feed optimised for engagement.
          </p>
          <p>
            We look for problems in the social and technical space that affect large populations and
            are underserved by existing solutions: families losing connection with their roots,
            presenters struggling to reach audiences without screens, players wanting more than the
            game they grew up with.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-text-primary mb-6">What we value</h2>
        <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex gap-4">
                <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold mb-1">{item.label}</p>
                  <p className="text-text-secondary text-sm">{item.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Company facts */}
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-6">The company</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {facts.map((fact) => {
            const Icon = fact.icon
            return (
              <div key={fact.label} className="bg-surface border border-border rounded-xl p-5">
                <div className="gradient-bg w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-text-secondary text-xs uppercase tracking-widest mb-2">
                  {fact.label}
                </p>
                <p className="text-text-primary font-medium text-sm">{fact.value}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
