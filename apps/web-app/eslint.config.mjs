import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import architecture from './eslint/architecture.mjs'

const sourceFiles = ['**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}']
const routeFiles = ['app/**/route.{js,jsx,ts,tsx,mjs,mts,cjs,cts}']
const actionFiles = ['actions/**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}']
const serviceFiles = ['lib/services/**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}']
const coreRouteFiles = [
  'app/**/api/core/**/route.{js,jsx,ts,tsx,mjs,mts,cjs,cts}',
]
const canonicalCoreRouteFiles = [
  'app/(routes)/api/core/**/route.{js,jsx,ts,tsx,mjs,mts,cjs,cts}',
]

const dataAccessRestrictions = [
  {
    group: [
      'drizzle-orm',
      'drizzle-orm/*',
      '@better-stack-monorepo/database/src/database',
      '@better-stack-monorepo/database/src/database.*',
      '@better-stack-monorepo/database/src/schemas',
      '@better-stack-monorepo/database/src/schemas.*',
      '**/packages/database/src/database',
      '**/packages/database/src/database.*',
      '**/packages/database/src/schemas',
      '**/packages/database/src/schemas.*',
    ],
    message:
      'Route handlers, server actions, and services must use the repository seam instead of importing Drizzle, database schemas, or db directly.',
  },
]

const actionRestrictions = [
  ...dataAccessRestrictions,
  {
    group: [
      '@/lib/services',
      '@/lib/services/**',
      '**/lib/services/**',
      '**/repositories/**',
      '@better-stack-monorepo/database',
      '@/lib/auth',
      '@/lib/auth/**',
      '**/lib/auth/**',
    ],
    message:
      'Server actions are transport adapters. Use secureFetch/publicFetch instead of importing repositories, services, or auth internals.',
  },
  {
    regex:
      '^(?!\\.{1,2}/|@/|next(?:/|$)|server-only$|@better-stack-monorepo/(?:[^/]+)(?:/|$)).+',
    message:
      'Server actions cannot import third-party SDKs. Put SDK calls behind a core route and call it with secureFetch/publicFetch.',
  },
]

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: sourceFiles,
    plugins: {
      architecture,
    },
    rules: {
      'architecture/no-client-import-server-only': 'error',
    },
  },
  {
    files: [...routeFiles, ...serviceFiles],
    rules: {
      'no-restricted-imports': ['error', { patterns: dataAccessRestrictions }],
    },
  },
  {
    files: actionFiles,
    rules: {
      'no-restricted-imports': ['error', { patterns: actionRestrictions }],
    },
  },
  {
    files: coreRouteFiles,
    ignores: canonicalCoreRouteFiles,
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            'Core route handlers must live under app/(routes)/api/core/.',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      eqeqeq: 'warn',
      curly: 'off',
      'no-duplicate-imports': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
  ]),
])
