import { apiFetch } from '@/lib/api/client'
import { ApiRoutes } from '@/lib/config/routes'
import type { Session, User } from '@/lib/auth/authClient'
import type { ApiResponse } from '@better-stack-monorepo/common'

export type CurrentUser = { user: User; session: Session['session'] }
export type CurrentUserResponse = ApiResponse<CurrentUser>

/**
 * Calls GET /api/core/v1/users on the web app — the canonical example of an
 * authenticated, envelope-shaped API call from the mobile app.
 */
export function getCurrentUser(): Promise<CurrentUserResponse> {
  return apiFetch<CurrentUser>(ApiRoutes.users.current)
}
