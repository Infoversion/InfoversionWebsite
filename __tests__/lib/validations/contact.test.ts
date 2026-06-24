import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validations/contact'

describe('contactSchema', () => {
  const valid = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    service: 'App Development' as const,
    message: 'I have a project I would like to discuss with you.',
  }

  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain('Name is required')
    }
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Enter a valid email address')
    }
  })

  it('rejects message shorter than 20 chars', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'Too short' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toContain(
        'Message must be at least 20 characters'
      )
    }
  })

  it('rejects an invalid service value', () => {
    const result = contactSchema.safeParse({ ...valid, service: 'Hacking' })
    expect(result.success).toBe(false)
  })

  it('ignores unknown fields like _honeypot (honeypot is checked at action level)', () => {
    // Schema strips unknown keys — honeypot check happens in the server action before parsing
    const result = contactSchema.safeParse({ ...valid, _honeypot: 'bot-text' })
    expect(result.success).toBe(true)
  })

  it('accepts an optional company field', () => {
    const result = contactSchema.safeParse({ ...valid, company: 'Acme Corp' })
    expect(result.success).toBe(true)
  })
})
