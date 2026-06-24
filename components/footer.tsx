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
