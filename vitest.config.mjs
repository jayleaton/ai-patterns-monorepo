import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    passWithNoTests: true,
    setupFiles: ['./apps/web-app/tests/setup.ts'],
    include: [
      'apps/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/.next/**', // Build output copies sources; without this, tests run twice
      '**/.expo/**',
      '**/app/**', // Exclude Next.js app directory from tests
      '**/components/**', // Exclude React components from unit tests
    ],
  },
  resolve: {
    alias: {
      // `@` means apps/web-app, matching its tsconfig paths. The mobile app
      // maps `@` to its own src/, so mobile tests use relative imports.
      '@': path.resolve(__dirname, 'apps/web-app'),
    },
  },
  esbuild: {
    target: 'node20',
  },
})
