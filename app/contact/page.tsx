import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact — Hire Infoversion for App Development',
  description:
    'Get in touch with Infoversion LLC for iOS app development, Android app development, web development, IT consulting, or Agile coaching. Based in Dallas, TX — working with clients worldwide.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Infoversion',
    description:
      'Tell us about your project. We build iOS apps, Android apps, and web platforms — and provide IT consulting and Agile coaching.',
    url: 'https://infoversion.com/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-4">Get in touch</h1>
      <p className="text-text-secondary text-xl mb-12">
        Tell us about your problem. We&apos;ll be in touch within 2 business days.
      </p>
      <ContactForm />
    </div>
  )
}
