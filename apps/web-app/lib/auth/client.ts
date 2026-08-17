'use client'

import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  // Current page origin so Tailscale / LAN hosts work without extra config.
  // Session cookie caching and email/password are configured server-side
  // in lib/auth/auth.ts; the client needs no extra options here.
})

export const { signIn, signUp, signOut, useSession } = authClient

export function useUser() {
  const { data: session } = useSession()

  return {
    user: session ? session.user : null,
    isAuthenticated: !!session,
  }
}
