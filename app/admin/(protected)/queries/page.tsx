import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import type { ContactSubmission } from '@/lib/types'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function QueriesPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const submissions = (data ?? []) as ContactSubmission[]
  const unread = submissions.filter((s) => s.status === 'new').length

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Queries</h1>
        <p className="text-zinc-400 text-sm">
          {submissions.length} total · {unread} unread
        </p>
      </div>

      {submissions.length === 0 ? (
        <p className="text-zinc-500 text-sm">No submissions yet.</p>
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-900/40">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
              Contact
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
              Service
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
              Date
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
              Status
            </span>
          </div>
          {submissions.map((s) => (
            <Link
              key={s.id}
              href={`/admin/queries/${s.id}`}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/60 transition-colors"
            >
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    s.status === 'new' ? 'text-white' : 'text-zinc-300'
                  }`}
                >
                  {s.name}
                </p>
                <p className="text-zinc-500 text-xs truncate">{s.email}</p>
              </div>
              <span className="text-zinc-400 text-xs whitespace-nowrap">{s.service}</span>
              <span className="text-zinc-600 text-xs whitespace-nowrap">
                {new Date(s.created_at).toLocaleDateString()}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[s.status]}`}
              >
                {s.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
