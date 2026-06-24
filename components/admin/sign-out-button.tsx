'use client'

import { signOut } from '@/actions/admin'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors"
    >
      Sign out
    </button>
  )
}
