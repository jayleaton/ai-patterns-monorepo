import { execFileSync } from 'node:child_process'
import os from 'node:os'

const TAILSCALE_BINS = [
  'tailscale',
  '/Applications/Tailscale.app/Contents/MacOS/Tailscale',
  '/usr/local/bin/tailscale',
  '/opt/homebrew/bin/tailscale',
]

/**
 * A DNS label as it can legally appear in a Host header. macOS computer names
 * ("Macbook Pro (3)") and other friendly names are not, and would only ever be
 * dead entries in an allowlist.
 */
const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/

function addHostAliases(hosts: Set<string>, value: string) {
  const host = value.trim().replace(/\.$/, '').toLowerCase()
  if (!host || !HOSTNAME_PATTERN.test(host)) return
  hosts.add(host)
  hosts.add(host.split('.')[0]!)
}

function getTailscaleHosts(): string[] {
  const hosts = new Set<string>()

  for (const bin of TAILSCALE_BINS) {
    try {
      const output = execFileSync(bin, ['status', '--json'], {
        encoding: 'utf8',
        timeout: 2000,
        stdio: ['ignore', 'pipe', 'ignore'],
      })
      const status = JSON.parse(output) as {
        Self?: { DNSName?: string; HostName?: string }
      }
      // Only this machine's own names. MagicDNSSuffix is the tailnet domain
      // rather than a host, and `*.ts.net` already covers the tailnet.
      if (status.Self?.HostName) addHostAliases(hosts, status.Self.HostName)
      if (status.Self?.DNSName) addHostAliases(hosts, status.Self.DNSName)
      break
    } catch {
      // Tailscale CLI is optional; fall through to reverse DNS.
    }
  }

  return Array.from(hosts)
}

/**
 * Hosts this machine is reachable on (hostname, MagicDNS short name, LAN/Tailscale IPs).
 * Used so the Next.js / Better Auth allowlists work on any machine without hardcoding.
 */
export function getLocalNetworkHosts(): string[] {
  const hosts = new Set<string>()
  const hostname = os.hostname()

  addHostAliases(hosts, hostname)
  addHostAliases(hosts, hostname.replace(/\.local$/i, ''))

  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.internal) continue
      // Link-local IPv6 is only routable with its zone index (`%en0`), which
      // never survives into a Host header — skip it rather than allowlist a
      // host nothing can actually connect to.
      if (address.family === 'IPv6' && address.address.toLowerCase().startsWith('fe80:')) {
        continue
      }
      const ip = address.address.split('%')[0]
      // IPv6 literals appear bracketed in Host headers (`[::1]:3000`).
      if (ip) hosts.add(address.family === 'IPv6' ? `[${ip}]` : ip)
    }
  }

  for (const tailscaleHost of getTailscaleHosts()) {
    addHostAliases(hosts, tailscaleHost)
  }

  for (const extra of process.env.DEV_ALLOWED_ORIGINS?.split(',') ?? []) {
    addHostAliases(hosts, extra)
  }

  return Array.from(hosts)
}

/**
 * Next.js `allowedDevOrigins` entries (hostnames only, no protocol/port).
 * `**.ts.net` covers Tailscale MagicDNS (`machine.tailnet.ts.net`).
 */
export function getAllowedDevOrigins(): string[] {
  return [
    'localhost',
    '127.0.0.1',
    '**.ts.net',
    '*.local',
    ...getLocalNetworkHosts(),
  ]
}

/**
 * Better Auth `baseURL.allowedHosts` entries.
 * Host headers often include the port, so each host is listed with and without `:*`.
 */
export function getAuthAllowedHosts(): string[] {
  const hosts = new Set<string>([
    'localhost',
    '127.0.0.1',
    '*.ts.net',
    '*.local',
    '100.*',
    ...getLocalNetworkHosts(),
  ])

  // Hosts arrive already formatted for a Host header (IPv6 bracketed), so each
  // one only needs its port-bearing variant alongside the bare form.
  return Array.from(hosts).flatMap(host => [host, `${host}:*`])
}
