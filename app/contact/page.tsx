import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Invoversion — app development, web development, consulting, and Agile coaching.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-text-primary mb-4">Get in touch</h1>
      <p className="text-text-secondary text-xl mb-12">
        Tell us about your problem. We&apos;ll be in touch within 1 business day.
      </p>
      <ContactForm />
    </div>
  )
}
