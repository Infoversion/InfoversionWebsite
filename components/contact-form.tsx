'use client'

import { useActionState } from 'react'
import { submitContact } from '@/actions/contact'
import { SERVICE_OPTIONS, type ContactFormState } from '@/lib/validations/contact'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const initial: ContactFormState = { success: false }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.success && state.name) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <p className="text-text-primary font-semibold text-lg mb-2">Message received.</p>
        <p className="text-text-secondary">
          Thank you, {state.name}. We&apos;ll be in touch within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="_honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
      />

      <div className="space-y-2">
        <Label htmlFor="name">Full name <span aria-hidden="true">*</span></Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="bg-surface border-border text-text-primary"
        />
        {state.errors?.name && (
          <p className="text-red-400 text-sm">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address <span aria-hidden="true">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="bg-surface border-border text-text-primary"
        />
        {state.errors?.email && (
          <p className="text-red-400 text-sm">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company / Organisation</Label>
        <Input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className="bg-surface border-border text-text-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service interested in <span aria-hidden="true">*</span></Label>
        <select
          id="service"
          name="service"
          required
          defaultValue=""
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start"
        >
          <option value="" disabled>Select a service</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {state.errors?.service && (
          <p className="text-red-400 text-sm">{state.errors.service[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message <span aria-hidden="true">*</span></Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={5}
          className="bg-surface border-border text-text-primary resize-none"
        />
        {state.errors?.message && (
          <p className="text-red-400 text-sm">{state.errors.message[0]}</p>
        )}
      </div>

      {state.errors?._form && (
        <p className="text-red-400 text-sm">{state.errors._form[0]}</p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="gradient-bg w-full text-white hover:opacity-90 transition-opacity"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
