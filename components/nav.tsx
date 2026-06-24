import Link from 'next/link'
import Image from 'next/image'

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
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={44}
            height={41}
            priority
            unoptimized
          />
          <span
            className="text-xl font-semibold tracking-wide text-text-primary select-none"
            style={{
              fontFamily: 'var(--font-display)',
              textShadow: '0 0 18px rgba(240,246,252,0.55), 0 0 40px rgba(240,246,252,0.2)',
            }}
          >
            Infoversion
          </span>
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
