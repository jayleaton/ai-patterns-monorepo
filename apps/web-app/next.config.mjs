import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n/config.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  output: 'standalone',
  // Allow dev-box (tailscale hostname) to hit the dev server in development
  allowedDevOrigins: ['dev-box', '*.dev-box', 'localhost'],
  transpilePackages: ['@better-stack-monorepo/database'],
}

export default withNextIntl(nextConfig)
