# Project context

Shared knowledge for maintainers, developers, and agents. Keep these three sections under roughly 800 words total. Record only context that changes how someone works; link to details and prune stale entries. Architecture and workflow rules live in [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md).

## Shared language

Use these meanings when interpreting prompts and discussing changes. Paths are relative to the repository root; **web** below means `apps/web-app`, and **mobile** means `apps/mobile-app`.

| Term | Meaning here |
| --- | --- |
| **You / we / maintainers** | “You” is the agent reading instructions; “we,” “us,” and “maintainers” are the people building this template. |
| **Developer / user** | In template discussions, the person cloning the template and directing agents. In auth, API, or database code, `user` means an app's authenticated identity. |
| **Template / app / workspace** | Better-Stack is the reusable starting point. An app is a product surface: Next.js **web app** or Expo **mobile app**. A workspace is an app or shared package managed by pnpm. |
| **Packages** | `packages/database` owns data; `packages/common` owns shared types and config. App-specific business logic stays in its app. |
| **Schema / migration** | A schema is a Drizzle table in `packages/database/src/schemas.ts`. A migration is a versioned database change in `packages/database/migrations/`. “Zod schema” means a validator instead. |
| **Repository** | Drizzle data access in `packages/database/src/repositories/`: `UserRepository`, constructed by `createUserRepository`. In version-control discussions, “repo” means this whole project. |
| **Service** | Web business logic in `web/lib/services/`: `UserService`, constructed by `createUserService(req)`. Mobile services in `mobile/src/lib/services/` coordinate calls to the web API. |
| **Service context** | `ServiceContext` in `web/lib/types.ts`: the request with authenticated `user` and `session` passed into a web service. |
| **Validator / input** | Zod input validation in `web/lib/validators/` or `mobile/src/lib/validators/`. Use CRUD names such as `updateUserSettingsSchema`; `UpdateUserSettingsInput` is its inferred TypeScript type. |
| **API route / core route** | An HTTP endpoint in `web/app/(routes)/api/core/`, currently versioned under `v1`. `(routes)` is a filesystem route group, absent from the URL. |
| **Route handler / route wrapper** | A route handler is a `GET`, `PATCH`, etc. export in `route.ts`. `createRouteHandler` in `web/lib/auth/route-handler.ts` wraps core handlers with public or authenticated access; authenticated handlers receive `req.user` and `req.session`. |
| **Page / layout / loading** | Next.js `page.tsx` is a screen, `layout.tsx` its shared shell, and `loading.tsx` its loading boundary. Mobile screens use Expo Router under `mobile/src/app/`. Qualify “route” as page or API when ambiguous. |
| **Server action** | A server function in `web/actions/`. For API access, it proxies through `secureFetch` or `publicFetch`; it does not call services or repositories directly. |
| **Fetch helper / API client** | Web: `secureFetch` (session required) and `publicFetch` (no session required) in `web/lib/serverUtils.ts`. Native: `apiFetch` in `mobile/src/lib/api/client.ts`, which attaches the stored session cookie. |
| **Envelope / API response** | `{ data: T \| null, error: string \| null }`, represented by `ApiResponse<T>` in `packages/common/src/types.ts`. |
| **Routes config / feature flags** | Web `AppRoutes` names page paths, `ApiRoutes` names API paths, and `FeatureConfig` selects environment-dependent flags in `web/lib/config/featureToggles.ts`. Mobile route constants live in `mobile/src/lib/config/routes.ts`. |
| **Auth / session / account** | Better Auth handles authentication. A session tracks a signed-in user; the database `account` stores a user's provider credentials, not a team or organization. |
| **Locale / messages** | Web `next-intl` language selection and translated text. Supported locales live in `web/lib/i18n/constants.ts`; keep every language in `web/messages/` synchronized. |
| **Template welcome** | Removable starter guidance in `web/template-welcome/`, controlled by `FeatureConfig.features.templateWelcome`. |

## Bugs & in-progress features

No shared items recorded yet; this is not a claim that the project has no bugs.

Keep each confirmed item to one bullet: **issue/feature — current state; affected area; next step; issue or source link**. Include deployment status only when verified. Remove items after the fix or required deployment is verified; this is not a backlog or changelog.

## Critical memories

- **Reuse fetch helpers.** Check `web/lib/serverUtils.ts` before adding HTTP wrappers. These helpers already resolve the base URL and forward request cookies/headers. They are server-only; the mobile counterpart is `apiFetch`.
- **Origins are network-dependent.** Web dev binds `0.0.0.0:3000` for localhost, LAN, and Tailscale. Reuse `getBaseUrl()` in `web/lib/utils.ts` (`INTERNAL_URL` then `NEXT_PUBLIC_URL` on the server). Mobile uses `EXPO_PUBLIC_API_URL`; a physical device needs a reachable host.
- **Local Postgres is the sandbox.** Do not infer permission to migrate or seed a remote database from ordinary development work. See the database and process-safety rules in the agent instructions.
