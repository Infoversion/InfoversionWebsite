import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null }) }
  },
}))

vi.mock('@/emails/contact-reply', () => ({ default: vi.fn().mockReturnValue(null) }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

import { replyToSubmission } from '@/actions/admin'
import { createServiceClient } from '@/lib/supabase/service'

describe('replyToSubmission', () => {
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({}) })
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    mockFrom = vi.fn().mockImplementation((table: string) => {
      if (table === 'replies') return { insert: mockInsert }
      return { update: mockUpdate }
    })
    vi.mocked(createServiceClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServiceClient>)
  })

  it('returns error for empty reply body', async () => {
    const result = await replyToSubmission('sub-id', 'user@example.com', 'Jane', '   ')
    expect(result.success).toBe(false)
    expect(result.error).toContain('empty')
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('inserts reply and updates status on success', async () => {
    const result = await replyToSubmission(
      'sub-id',
      'user@example.com',
      'Jane',
      'Thank you for reaching out!'
    )
    expect(result.success).toBe(true)
    expect(mockFrom).toHaveBeenCalledWith('replies')
    expect(mockFrom).toHaveBeenCalledWith('contact_submissions')
  })
})
