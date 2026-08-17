import { describe, expect, it } from 'vitest'
import { matchesHostPattern } from 'better-auth'

import { getAllowedDevOrigins, getAuthAllowedHosts } from './networkAccess'

/**
 * The dev auth allowlist is matched by Better Auth against the request's
 * `host` header, which carries the port (`macbook:3000`). These tests pin
 * that contract using Better Auth's own matcher, so a change to either side
 * shows up here instead of as a 500 on a LAN or Tailscale client.
 */
const allows = (host: string) =>
  getAuthAllowedHosts().some(pattern => matchesHostPattern(host, pattern))

describe('getAuthAllowedHosts', () => {
  it('allows loopback with and without a port', () => {
    expect(allows('localhost')).toBe(true)
    expect(allows('localhost:3000')).toBe(true)
    expect(allows('127.0.0.1:3000')).toBe(true)
  })

  it('allows Tailscale MagicDNS names and CGNAT addresses', () => {
    expect(allows('macbook.prawn-penny.ts.net:3000')).toBe(true)
    expect(allows('macbook.prawn-penny.ts.net')).toBe(true)
    expect(allows('100.111.125.20:3000')).toBe(true)
  })

  it('allows mDNS .local hostnames used on the LAN', () => {
    expect(allows('some-machine.local:3000')).toBe(true)
  })

  it('rejects unrelated public hosts', () => {
    expect(allows('evil.com')).toBe(false)
    expect(allows('evil.com:3000')).toBe(false)
    expect(allows('ts.net.evil.com')).toBe(false)
  })

  it('emits only hosts that can appear in a Host header', () => {
    // macOS computer names ("Macbook Pro (3)") and IPv6 literals are the two
    // ways junk used to reach the allowlist.
    for (const pattern of getAuthAllowedHosts()) {
      const bare = pattern.replace(/:\*$/, '')
      expect(bare).not.toMatch(/[\s()]/)
      if (bare.includes('::')) expect(bare).toMatch(/^\[.+\]$/)
    }
  })

  it('honours DEV_ALLOWED_ORIGINS entries', () => {
    process.env.DEV_ALLOWED_ORIGINS = 'dev-box,build-server.example.com'
    try {
      expect(allows('dev-box:3000')).toBe(true)
      expect(allows('build-server.example.com:3000')).toBe(true)
    } finally {
      delete process.env.DEV_ALLOWED_ORIGINS
    }
  })
})

describe('getAllowedDevOrigins', () => {
  it('returns bare hostnames for Next.js, never URLs or ports', () => {
    for (const origin of getAllowedDevOrigins()) {
      expect(origin).not.toMatch(/^https?:\/\//)
      expect(origin).not.toMatch(/:\d+$/)
    }
  })

  it('covers loopback and Tailscale MagicDNS', () => {
    const origins = getAllowedDevOrigins()
    expect(origins).toContain('localhost')
    expect(origins).toContain('**.ts.net')
  })
})
