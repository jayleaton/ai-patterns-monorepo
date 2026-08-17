import type { z } from 'zod'

/**
 * Flattens a ZodError into a `{ field: message }` map for form display.
 */
export function getFieldErrors(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(error.issues.map(issue => [String(issue.path[0] ?? ''), issue.message]))
}
