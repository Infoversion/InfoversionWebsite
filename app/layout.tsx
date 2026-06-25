import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://infoversion.com'),
  title: {
    default: 'Infoversion — Mobile App & Web Development | Dallas, TX',
    template: '%s | Infoversion',
  },
  description:
    'Infoversion builds iOS and Android apps, web platforms, and provides IT consulting and Agile coaching. Based in Dallas, TX — serving clients and users worldwide.',
  keywords: [
    'mobile app development',
    'iOS app development',
    'Android app development',
    'React Native developer',
    'custom app development',
    'web development',
    'Next.js developer',
    'IT consulting',
    'Agile coaching',
    'software company Dallas TX',
    'app development company',
    'family app',
    'heritage app',
    'Infoversion',
    'Infoversion LLC',
  ],
  authors: [{ name: 'Infoversion LLC', url: 'https://infoversion.com' }],
  creator: 'Infoversion LLC',
  publisher: 'Infoversion LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://infoversion.com',
    siteName: 'Infoversion',
    title: 'Infoversion — Mobile App & Web Development',
    description:
      'iOS, Android, and web platforms built with purpose. IT consulting and Agile coaching from a team with real product experience. Dallas, TX.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infoversion — Mobile App & Web Development',
    description:
      'iOS, Android, and web platforms built with purpose. IT consulting and Agile coaching. Dallas, TX.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://infoversion.com/#organization',
      name: 'Infoversion LLC',
      url: 'https://infoversion.com',
      logo: 'https://infoversion.com/logo.png',
      description:
        'Mobile app development, web development, IT consulting, and Agile coaching. Based in Dallas, TX.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '13101 Preston Rd. Ste 110-3084',
        addressLocality: 'Dallas',
        addressRegion: 'TX',
        postalCode: '75240',
        addressCountry: 'US',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        url: 'https://infoversion.com/contact',
        contactType: 'customer service',
      },
      sameAs: ['https://github.com/Infoversion'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://infoversion.com/#website',
      url: 'https://infoversion.com',
      name: 'Infoversion',
      publisher: { '@id': 'https://infoversion.com/#organization' },
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://infoversion.com/#service',
      name: 'Infoversion LLC',
      url: 'https://infoversion.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '13101 Preston Rd. Ste 110-3084',
        addressLocality: 'Dallas',
        addressRegion: 'TX',
        postalCode: '75240',
        addressCountry: 'US',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Software Development Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'iOS App Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Android App Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'React Native Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IT Consulting' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agile Coaching' } },
        ],
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-text-primary font-sans min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
