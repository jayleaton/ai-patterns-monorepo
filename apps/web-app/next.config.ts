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
}

export default withNextIntl(nextConfig)
