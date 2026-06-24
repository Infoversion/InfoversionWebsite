import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex flex-col gap-1">
          <p className="text-text-primary text-sm font-medium">Infoversion LLC</p>
          <p className="text-text-secondary text-sm">13101 Preston Rd. Ste 110-3084</p>
          <p className="text-text-secondary text-sm">Dallas, TX 75240</p>
          <p className="text-text-secondary text-sm mt-2">
            © {new Date().getFullYear()} Infoversion LLC. All rights reserved.
          </p>
        </div>
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
