import { describe, it, expect, vi, beforeEach } from 'vitest'

// Must mock before importing action
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

vi.mock('resend', () => {
  const mockSend = vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null })
  return {
    Resend: class {
      emails = { send: mockSend }
    },
  }
})

vi.mock('@/emails/admin-notification', () => ({
  default: vi.fn().mockReturnValue(null),
}))

import { submitContact } from '@/actions/contact'
import { createServiceClient } from '@/lib/supabase/service'

function makeFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  const defaults: Record<string, string> = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    service: 'App Development',
    message: 'I have a project I would like to discuss with you in detail.',
    _honeypot: '',
    ...overrides,
  }
  Object.entries(defaults).forEach(([k, v]) => fd.set(k, v))
  return fd
}

const initial = { success: false as const }

describe('submitContact', () => {
  let mockSingle: ReturnType<typeof vi.fn>
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle = vi.fn().mockResolvedValue({ data: { id: 'uuid-123' }, error: null })
    const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: mockSingle }) })
    mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    vi.mocked(createServiceClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServiceClient>)
  })

  it('returns field errors for missing name', async () => {
    const result = await submitContact(initial, makeFormData({ name: '' }))
    expect(result.success).toBe(false)
    expect(result.errors?.name).toBeDefined()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('returns field errors for invalid email', async () => {
    const result = await submitContact(initial, makeFormData({ email: 'bad' }))
    expect(result.success).toBe(false)
    expect(result.errors?.email).toBeDefined()
  })

  it('returns field errors for short message', async () => {
    const result = await submitContact(initial, makeFormData({ message: 'Too short' }))
    expect(result.success).toBe(false)
    expect(result.errors?.message).toBeDefined()
  })

  it('silently succeeds for honeypot-filled submissions without inserting', async () => {
    const result = await submitContact(initial, makeFormData({ _honeypot: 'bot' }))
    expect(result.success).toBe(true)
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('inserts submission and returns success with name on valid data', async () => {
    const result = await submitContact(initial, makeFormData())
    expect(result.success).toBe(true)
    expect(result.name).toBe('Jane Smith')
    expect(mockFrom).toHaveBeenCalledWith('contact_submissions')
  })

  it('returns form error when Supabase insert fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('DB error') })
    const result = await submitContact(initial, makeFormData())
    expect(result.success).toBe(false)
    expect(result.errors?._form).toBeDefined()
  })
})
