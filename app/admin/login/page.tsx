'use client'

import { useActionState } from 'react'
import { signIn } from '@/actions/admin'

const initial = { error: undefined as string | undefined }

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signIn, initial)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2">Admin</h1>
        <p className="text-zinc-400 text-sm mb-8">Sign in to Invoversion admin panel.</p>
        <form action={action} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-zinc-300 text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-zinc-300 text-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {state.error && (
            <p className="text-red-400 text-sm">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
