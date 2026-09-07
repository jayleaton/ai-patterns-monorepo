# Template security and performance audit — 2026-09-07

Scope: application source, web/mobile auth and API contracts, database access and indexes, network defaults, dependency advisories, and build/check workflows. This is a source and local runtime review, not a penetration test or production load benchmark.

## Confirmed issues addressed

| Issue | Change |
| --- | --- |
| Profile PATCH could replace an email without verifying ownership, retaining `emailVerified` | Strict profile validation allows only name/image; repository profile updates cannot set email. Both endpoints retain ownership checks. |
| Revoked sessions could remain usable through seven days of cookie caching | Disable cookie caching; authenticated API responses are explicitly private and not cacheable. |
| Rejected handler promises escaped the route error boundary | Await both public and authenticated handlers; centralize typed business and validation errors without leaking unexpected error messages. |
| `100.*` could trust attacker-controlled public hostnames; domain wildcards trusted unrelated machines | Trust configured and discovered local hosts, retaining LAN/Tailscale support. |
| Development database and unauthenticated pgweb UI exposed on all interfaces | Bind both host ports to loopback; the web server continues binding all interfaces. |
| Missing auth foreign-key/verification lookup indexes | Add indexes for session user ID, account user ID, and verification identifier with a generated migration. |
| Production config ran synchronous Tailscale discovery | Skip dev-origin discovery in production; separate Node config tooling from the application's server-only import guard. |
| Documented sender email gained a duplicate `noreply@` prefix; provider errors were ignored | Validate/use the complete sender address and fail on provider-reported errors. |
| Auth upgrade makes Expo cookie access asynchronous | Await SecureStore-backed cookies and preserve all supported header input forms in the mobile API client. |
| Silent localhost fallbacks in origin configuration | Require the explicitly configured public URL and reuse it for page metadata. |

Dependencies updated within supported release lines, including Next.js 16.3.4, Better Auth/Expo plugin 1.7.3, Expo 57.0.20, React Native 0.86.3, Zod, next-intl, Resend, and tooling. Expo's required React 19.2.3 remains separate from web React 19.2.8. Pin pnpm 10.34.5 and require Node 22.13+ to match the toolchain. Keep ESLint 9, Vitest 4 and the existing TypeScript release lines rather than introducing unrelated major migrations.

## Remaining dependency advisories

The initial scan reported 8 high and 6 moderate advisories. After upgrades and compatible transitive overrides, the scan reports **0 high/critical and 2 moderate**:

- [uuid buffer bounds](https://github.com/advisories/GHSA-w5hq-g745-h8pq): Expo's Xcode project tooling uses uuid 7. The fix requires uuid 11.1.1+, a major upgrade. The advisory concerns caller-provided output buffers in v3/v5/v6; this template does not call these APIs. Prefer an upstream Xcode tooling upgrade to forcing a major version.
- [decode-uri-component](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr): Expo Router → query-string still selects 0.2.2; the patched line begins at 0.5.0. Treat malformed/untrusted deep links as an outstanding mobile risk and track an upstream compatible update. No audit entries are suppressed.

The two initial image-size advisories disappeared with the compatible Expo/Metro dependency update; no local parser patch or unsafe major override was added.

## Workspace and layer review

Web: auth, route boundary, profile validation/service, email and network configuration changed. Mobile: aligned SDK dependencies and asynchronous auth-cookie transport. Database: profile update contract and additive indexes changed. Common: shared Zod dependency updated; response envelope unchanged. No new pages, translated text, navigation, or stateful feature were introduced. Image removal is supported through null. Development and production origin/auth behavior were checked separately. README documents template-visible changes.

## Sources

- [Better Auth session caching and revocation](https://better-auth.com/docs/concepts/session-management)
- [Better Auth verified email changes](https://better-auth.com/docs/concepts/users-accounts)
- [Better Auth 1.7.3 compatibility and Expo fixes](https://github.com/better-auth/better-auth/releases/tag/v1.7.3)
- [Next.js 16.3.4 release](https://github.com/vercel/next.js/releases/tag/v16.3.4)

## Validation

- 50 tests pass, including both profile PATCH endpoints, rejected cross-user access, async error envelopes, real email rendering, and asynchronous mobile cookie transport.
- Web/mobile/database/common type checks pass. Web and mobile lint pass; 11 existing web warnings remain in starter UI/auth components.
- Frozen-lockfile installation and Expo SDK compatibility checks pass. Expo iOS JavaScript/Hermes export succeeds; no native device or store build was performed.
- Next.js production build passes. The agent command environment supplied `WATCH_REPORT_DEPENDENCIES=1`, which injects incompatible messages into Next's child-worker channel; validation removed that environment variable instead of adding an application workaround.
- Generated migration applied to a fresh local Docker database. A synthetic account exercised sign-up, browser sign-in/dashboard, both profile endpoints, image removal, cross-user rejection, and immediate rejection after database session revocation.
- Production runtime rejects unverified sign-in, accepts verified sign-in, and rejects foreign origins. Development sign-in works with this machine's discovered hostname; a live request using `100.attacker.com` is rejected with 403. Host matching has regression coverage for attacker-controlled `100.*`, unrelated `.local`, and unrelated Tailscale domains.
- Email delivery used a mocked provider with real rendering; no real messages were sent. No remote database was used or migrated.

Lower-priority template consistency work remains outside this maintenance change: starter screens retain untranslated placeholder text, missing per-segment loading files, and the existing UI lint warnings. No user-facing page redesign was made here.
