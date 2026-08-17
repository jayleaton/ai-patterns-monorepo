import { authClient } from '@/lib/auth/authClient'
import { ApiError, parseEnvelope } from '@/lib/api/envelope'
import { env } from '@/lib/config/env'
import type { ApiResponse } from '@better-stack-monorepo/common'

/**
 * Fetch wrapper for the web app's API (the native counterpart of
 * secureFetch/publicFetch in apps/web-app/lib/serverUtils.ts).
 *
 * Sends the Better Auth session cookie from SecureStore with every request
 * and always resolves to the `{ data, error }` envelope. Only unreachable
 * networks throw (ApiError) — HTTP and validation failures arrive as
 * envelope errors, like on the web.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const cookie = authClient.getCookie()

  let response: Response
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      // Cookies are set explicitly above; let the OS handle the rest.
      credentials: 'omit',
    })
  } catch {
    throw new ApiError(
      `Could not reach the API at ${env.apiUrl}. Is the web app running and EXPO_PUBLIC_API_URL correct for this device?`,
      0
    )
  }

  const body = await response.json().catch(() => null)
  const envelope = parseEnvelope<T>(body)

  if (!response.ok && !envelope.error) {
    return { data: null, error: `Request failed: ${response.status} ${response.statusText}` }
  }

  return envelope
}
