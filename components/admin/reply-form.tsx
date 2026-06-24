'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { replyToSubmission } from '@/actions/admin'
import type { Reply } from '@/lib/types'

interface ReplyFormProps {
  submissionId: string
  contactEmail: string
  contactName: string
  initialReplies: Reply[]
}

export function ReplyForm({
  submissionId,
  contactEmail,
  contactName,
  initialReplies,
}: ReplyFormProps) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    initialReplies,
    (state, newReply: Reply) => [...state, newReply]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setError(null)

    const optimistic: Reply = {
      id: crypto.randomUUID(),
      submission_id: submissionId,
      body: body.trim(),
      sent_at: new Date().toISOString(),
    }

    startTransition(async () => {
      addOptimisticReply(optimistic)
      const result = await replyToSubmission(submissionId, contactEmail, contactName, body.trim())
      if (!result.success) {
        setError(result.error ?? 'Failed to send reply.')
      } else {
        setBody('')
      }
    })
  }

  return (
    <div className="mt-8">
      {optimisticReplies.length > 0 && (
        <div className="mb-6 space-y-4">
          <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
            Previous replies
          </h3>
          {optimisticReplies.map((reply) => (
            <div
              key={reply.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
            >
              <p className="text-zinc-200 text-sm whitespace-pre-wrap leading-relaxed">
                {reply.body}
              </p>
              <p className="text-zinc-600 text-xs mt-2">
                {new Date(reply.sent_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Send a reply</h3>
        <p className="text-zinc-500 text-xs mb-4">
          Subject: <span className="text-zinc-400">Re: Your enquiry to Invoversion</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write your reply…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-600"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isPending || !body.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isPending ? 'Sending…' : 'Send Reply'}
          </button>
        </form>
      </div>
    </div>
  )
}
