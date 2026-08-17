import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import { getAllowedDevOrigins } from './lib/config/networkAccess'

const withNextIntl = createNextIntlPlugin('./lib/i18n/config.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  output: 'standalone',
  allowedDevOrigins: getAllowedDevOrigins(),
  transpilePackages: ['@better-stack-monorepo/database'],
  // `next dev` otherwise writes (and appends into) AGENTS.md / CLAUDE.md
  // whenever it detects an AI agent running it. This repo maintains those
  // files deliberately; a dev server should start a dev server, not edit docs.
  agentRules: false,
}

export default withNextIntl(nextConfig)
