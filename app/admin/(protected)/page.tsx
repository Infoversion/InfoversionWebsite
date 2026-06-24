import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import type { ContactSubmission } from '@/lib/types'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-zinc-700/30 text-zinc-400 border-zinc-700',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  const [{ count: unreadCount }, { data: recent }] = await Promise.all([
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const submissions = (recent ?? []) as ContactSubmission[]

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          {unreadCount ?? 0} unread{' '}
          {(unreadCount ?? 0) === 1 ? 'submission' : 'submissions'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Unread</p>
          <p className="text-3xl font-bold text-blue-400">{unreadCount ?? 0}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent submissions</h2>
          <Link
            href="/admin/queries"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            View all →
          </Link>
        </div>
        {submissions.length === 0 ? (
          <p className="text-zinc-500 text-sm">No submissions yet.</p>
        ) : (
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            {submissions.map((s) => (
              <Link
                key={s.id}
                href={`/admin/queries/${s.id}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.name}</p>
                  <p className="text-zinc-500 text-xs truncate">
                    {s.email} · {s.service}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[s.status]}`}
                >
                  {s.status}
                </span>
                <span className="text-zinc-600 text-xs flex-shrink-0">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
