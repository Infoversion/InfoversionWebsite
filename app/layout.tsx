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
  title: {
    default: 'Infoversion — We find the problem. We build the solution.',
    template: '%s | Infoversion',
  },
  description:
    'Infoversion builds high-quality iOS, Android, and web platforms — and provides IT project management, consulting, and Agile transformation services.',
  metadataBase: new URL('https://infoversion.com'),
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-text-primary font-sans min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
