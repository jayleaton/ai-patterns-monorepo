/**
 * Centralized navigation routes to avoid magic strings across the codebase.
 * Paths are validated against Expo Router's typed routes (experiments.typedRoutes).
 */
export const AppRoutes = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
} as const

/**
 * Centralized API routes, served by apps/web-app.
 * Keep in sync with ApiRoutes in apps/web-app/lib/config/featureToggles.ts.
 */
export const ApiRoutes = {
  users: {
    current: '/api/core/v1/users',
  },
} as const
