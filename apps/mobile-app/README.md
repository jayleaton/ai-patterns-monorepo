# mobile-app

Expo (React Native) app for the Better Stack monorepo. It authenticates against
the web app's Better Auth server and calls its envelope API.

- **Framework**: Expo SDK 57, Expo Router (typed routes), React Compiler
- **Auth**: Better Auth via `@better-auth/expo` — session cookies live in the
  device keychain (`expo-secure-store`)
- **API**: `src/lib/api/client.ts` attaches the session cookie to requests and
  returns the web app's `{ data, error }` envelope

## Run it

```bash
# from the repo root
pnpm install
pnpm web:dev          # the API must be running
pnpm mobile:dev       # then press i (iOS) or a (Android)
```

The app needs `EXPO_PUBLIC_API_URL` (see `.env`) pointing at the web app:

| Client              | URL                                   |
| ------------------- | ------------------------------------- |
| iOS Simulator       | `http://localhost:3000`               |
| Android Emulator    | `http://10.0.2.2:3000`                |
| Physical device     | LAN IP or Tailscale host, e.g. `http://my-mac.tailnet.ts.net:3000` |

Env vars are inlined at bundle time — restart `expo start` after changing them.

## Structure

Mirrors the web app's conventions:

```
src/
  app/            Expo Router routes ((auth) and (app) groups)
  components/     Themed UI components
  constants/      Theme colors, spacing
  lib/
    api/          apiFetch client + envelope helpers (unit tested)
    auth/         Better Auth client (SecureStore cookies)
    config/       env.ts (EXPO_PUBLIC_API_URL) and routes.ts (AppRoutes/ApiRoutes)
    services/     Business logic (userService)
    validators/   Zod schemas (authSchemas)
```

## Server-side setup (already wired in apps/web-app)

`apps/web-app/lib/auth/auth.ts` mounts the `expo()` plugin and trusts the app's
`betterstack://` scheme (plus `exp://` dev URLs) as origins. If you change the
scheme in `app.json`, update the client in `src/lib/auth/authClient.ts` and the
server's `trustedOrigins` to match.

## Notes

- Expo majors change quickly — check the versioned docs for the SDK pinned in
  `package.json` before upgrading: https://docs.expo.dev/versions/
- Web output is intentionally not configured; this template targets iOS and
  Android with native auth flows.
