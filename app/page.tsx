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
    pitch: "Real-time slide sharing — the presenter's screen on every audience member's phone instantly.",
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
          <p className="inline-flex items-center gap-2 mb-6 text-xs font-semibold tracking-[0.2em] uppercase gradient-text">
            Build Smart Apps, Transform Boldly
          </p>
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
          <h2 className="text-3xl font-bold text-text-primary mb-3">What we&apos;re building</h2>
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
              Tell us about your problem. We&apos;ll tell you how we&apos;d build the solution.
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
