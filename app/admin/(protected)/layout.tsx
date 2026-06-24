import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/admin/sign-out-button'

export async function generateMetadata() {
  const supabase = createServiceClient()
  const { count } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
  return {
    title: count ? `(${count}) Invoversion Admin` : 'Invoversion Admin',
  }
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm text-zinc-100">Invoversion Admin</span>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/queries"
                className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
              >
                Queries
              </Link>
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
