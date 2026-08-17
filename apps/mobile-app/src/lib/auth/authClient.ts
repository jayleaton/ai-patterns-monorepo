import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'
import * as SecureStore from 'expo-secure-store'

import { env } from '@/lib/config/env'

/**
 * Better Auth client pointed at the web app (apps/web-app).
 * The expoClient plugin stores session cookies in the device keychain
 * (expo-secure-store) and attaches them to auth requests.
 */
export const authClient = createAuthClient({
  baseURL: env.apiUrl,
  plugins: [
    expoClient({
      scheme: 'betterstack',
      storagePrefix: 'better-stack',
      storage: SecureStore,
    }),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient

export type Session = typeof authClient.$Infer.Session
export type User = typeof authClient.$Infer.Session.user
