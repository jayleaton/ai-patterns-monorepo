type FeatureToggles = {
  features: {
    emailVerification: boolean
    /** Starter welcome page. Set false, then delete apps/web-app/template-welcome. */
    templateWelcome: boolean
  }
}

const ProdFeatureToggles: FeatureToggles = {
  features: {
    emailVerification: true,
    templateWelcome: true,
  },
}

const DevFeatureToggles: FeatureToggles = {
  features: {
    emailVerification: false,
    templateWelcome: true,
  },
}

export const FeatureConfig: FeatureToggles = (() => {
  if (process.env.NODE_ENV === 'production') {
    return ProdFeatureToggles
  }
  return DevFeatureToggles
})()

/**
 * Centralized app routes to avoid magic strings across the codebase.
 */
export const AppRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  why: '/why',
}

/**
 * Centralized API routes to avoid magic strings in server actions.
 */
export const ApiRoutes = {
  users: {
    current: '/api/core/v1/users',
  },
}
