import type { ApiResponse } from '@better-stack-monorepo/common'

/**
 * Thrown when the API cannot be reached at all (offline, wrong URL, dev
 * server not running). HTTP-level errors are not thrown; they come back in
 * the envelope's `error` field, matching the web app's API contract.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Normalizes a decoded JSON body into the API envelope `{ data, error }`.
 * Guards against non-envelope bodies (proxies, HTML error pages, etc.).
 */
export function parseEnvelope<T>(body: unknown): ApiResponse<T> {
  if (typeof body !== 'object' || body === null || !('data' in body)) {
    return { data: null, error: 'Malformed response from server' }
  }

  const raw = body as { data?: unknown; error?: unknown }

  return {
    data: (raw.data ?? null) as T | null,
    error: typeof raw.error === 'string' ? raw.error : raw.error ? 'Unknown error' : null,
  }
}
