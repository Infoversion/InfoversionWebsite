import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { ReplyForm } from '@/components/admin/reply-form'
import type { ContactSubmission, Reply } from '@/lib/types'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function QueryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: submissionData }, { data: repliesData }] = await Promise.all([
    supabase.from('contact_submissions').select('*').eq('id', id).single(),
    supabase
      .from('replies')
      .select('*')
      .eq('submission_id', id)
      .order('sent_at', { ascending: true }),
  ])

  if (!submissionData) notFound()

  const submission = submissionData as ContactSubmission
  const replies = (repliesData ?? []) as Reply[]

  if (submission.status === 'new') {
    await supabase
      .from('contact_submissions')
      .update({ status: 'read' })
      .eq('id', id)
      .eq('status', 'new')
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/queries"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          ← All queries
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{submission.name}</h1>
            <p className="text-zinc-400 text-sm">{submission.email}</p>
            {submission.company && (
              <p className="text-zinc-500 text-sm">{submission.company}</p>
            )}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full border self-start ${STATUS_STYLES[submission.status]}`}
          >
            {submission.status}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Service</p>
            <p className="text-zinc-200">{submission.service}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Received</p>
            <p className="text-zinc-200">
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Message</p>
          <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
            {submission.message}
          </p>
        </div>
      </div>

      <ReplyForm
        submissionId={submission.id}
        contactEmail={submission.email}
        contactName={submission.name}
        initialReplies={replies}
      />
    </>
  )
}
