import { z } from 'zod'

const urlSchema = z.string().url()

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
const parsedApiUrl = urlSchema.safeParse(rawApiUrl)

if (!parsedApiUrl.success) {
  throw new Error(`EXPO_PUBLIC_API_URL must be a valid URL (got "${rawApiUrl}")`)
}

/**
 * Environment config for the mobile app.
 *
 * `EXPO_PUBLIC_API_URL` points at the web app's API (apps/web-app). It is
 * inlined at bundle time from .env / .env.local files.
 *
 * - iOS Simulator can use http://localhost:3000
 * - Android Emulator must use http://10.0.2.2:3000 (host loopback alias)
 * - Physical devices need your machine's LAN IP or Tailscale hostname,
 *   e.g. http://my-mac.tailnet.ts.net:3000
 */
export const env = {
  apiUrl: parsedApiUrl.data.replace(/\/+$/, ''),
} as const
