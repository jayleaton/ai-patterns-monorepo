# CLAUDE.md - Instructions for AI Assistants

## Project Overview

This is the **Better-Stack monorepo template**: a production-ready starting point for full-stack apps built with Next.js 16, Better Auth, Drizzle ORM, and Tailwind CSS.

Guiding principle: we create modern, easy-to-use templates for better DX when creating new software projects efficiently.

## Architecture is mandatory

The architecture in this file is a hard constraint for every change, not optional guidance. Follow it as written. If a task would require changing, bypassing, or making an exception to the architecture, stop before editing and consult the user. Explain the conflict and proceed only after the user explicitly approves that specific deviation; never infer approval.

When a developer is first defining what they are building, use the project skill `getting-started` (`.claude/skills/getting-started`, `.grok/skills/getting-started`, or `.agents/skills/getting-started` for Codex) instead of improvising a setup interview.

## What makes this template good

People clone or copy this repository to start real projects, then immediately diverge from it. It's important we maintain the things that make it a good starting point as we continue to iterate. Here's a brief list of the things we can never compromise on.

1. **Template first**

This repo is a template, not a canonical upstream. There is no downstream to contribute back to and no fleet of running instances to keep in sync. Every change should keep the template generic, minimal, and free of project-specific cruft. The example flows (like the users API) are documentation-as-code: keep them canonical and small. If a change only makes sense for one downstream project, it does not belong here.

2. **Performance without compromise**

Lots of templates have gotten bogged down with bad tech decisions and "slop". Do not add to that. Default to Server Components, keep client JavaScript to what interaction actually demands, keep data fetching on the server, and be considerate of render and bundle cost in every change.

3. **Network-ready dev servers**

Dev servers here are reachable beyond localhost on purpose. The web app binds `0.0.0.0:3000`, so it works identically at `http://localhost:3000`, on the local network, and over Tailscale at `http://<machine-hostname>:3000`. Never bake `localhost` into code, auth origins, or callbacks — that silently breaks every non-local client. New dev tooling and features must work over the network, not just from the machine that started them.

4. **Monorepo-aware**

One workspace is never the whole story. `apps/web-app`, `apps/mobile-app`, `packages/database`, and `packages/common` move together: a schema change ripples through repositories, services, validators, and UI. Every change gets a decision per workspace, even if the decision is "no change needed here".

The rest of this document is meant to help you navigate the codebase and make changes effectively. Think of these instructions less as "hard rules", more as "good defaults". The developer's preferences should be able to override anything here.

## Shared terminology

We need to be on the same page with terminology. When communicating, use this language:

- **you** means the agent reading this file and changing this template.
- **we, us, and maintainers** mean the people building this template. These are who you are talking to now.
- **user** or **developer** means the person who cloned this template and directs coding agents.
- **app** means a product surface: the Next.js website in `apps/web-app`, or the Expo mobile app in `apps/mobile-app`. Say **web app** or **mobile app** when you need to be specific.
- **packages** mean the shared workspaces: `packages/database` (schema + repositories) and `packages/common` (shared config and types).
- **schema** means a Drizzle table definition in `packages/database/src/schemas.ts`.
- **repository** means the data-access layer over Drizzle, in `packages/database/src/repositories/`.
- **service** means business logic, in `apps/web-app/lib/services/`.
- **validator** means a Zod schema in `apps/web-app/lib/validators/`.
- **server action** means a function in `apps/web-app/actions/` — the only client-triggered path into the API layer.
- **routes config** means `AppRoutes`, `ApiRoutes`, and feature flags in `apps/web-app/lib/config/featureToggles.ts`.

## Research discipline

Do not read the codebase cover to cover before starting. Long exploratory passes burn time and context without improving the change. Instead:

- Let the task and the **shared terminology** above tell you which files matter. Touching a schema means `packages/database/src/schemas.ts` and its repository; touching a route means its service, validator, action, and page. That's the whole map.
- Start from the entry points named here (`apps/web-app/package.json`, `packages/database/src/schemas.ts`, `apps/web-app/lib/config/featureToggles.ts`) and only open more when the change in front of you requires it.
- Never read `node_modules/`, `pnpm-lock.yaml`, `.next/`, or `dist/` unless absolutely required.
- Search by symbol and pattern, not by browsing directories. One targeted lookup beats ten speculative reads.
- If you can name the layer a change belongs to, you have done enough research to start. Course-correct when tests or the compiler say so.

## The three ways to hurt yourself

**Killing by pattern.** Never `pkill -f`, `pgrep | kill`, or kill a PID you found by matching a name, path, or port string. This machine runs several dev servers and Node processes at once, and your own process can match the pattern. Kill only a PID you captured at spawn, or a process you have positively confirmed owns your port.

**Trusting the wrong database.** The Docker Postgres (`localhost:5432`) is the sandbox: seed it, reset it, break it. A remote database (Neon, Supabase, production) is never a playground — never point dev at one, run migrations against one, or copy real user data in or out unless explicitly asked. `docker compose down -v` destroys the local volume; be sure that is intended before you run it.

**Baking in origins.** Never hardcode `http://localhost:3000` in code, auth config, emails, or OAuth callbacks. Dev is reached over localhost, LAN IPs, and Tailscale hostnames; origins must come from `NEXT_PUBLIC_URL` and environment config, or every non-local browser silently breaks.

## Hit every layer

The most common defect in this repo is a change that works on the path you tested and is missing everywhere else. Before calling work done, walk this list and say which entries applied:

- **Entry points.** A new page needs its route, its `loading.tsx`, translations in every language under `messages/`, and navigation through `AppRoutes` — not a hardcoded path.
- **Workspaces.** A feature usually spans `packages/database` (schema, migration, repository) and each surface that should show it: `apps/web-app` and/or `apps/mobile-app`. Doing only one half is doing half the feature.
- **Contracts.** Drizzle schemas and `packages/common` types are the contract. Change them and every consumer follows: generated migrations, repositories, services, and UI.
- **Reverse states.** If you added a way in, add the way out and the way to see it. Delete needs restore. Disable needs enable. A one-way door is a bug.
- **Environments.** Dev (Docker Postgres, email verification off) and production (real providers, verification on) behave differently via `featureToggles.ts` and env vars. Both paths must work.
- **Docs.** Behavior a template user would notice belongs in the root `README.md`. Repository architecture and workflow rules live in this file.

## Dev servers

- `pnpm install` installs everything, from the repo root.
- `docker compose up -d` starts Postgres (port 5432) and pgweb (port 5050). Then `pnpm db:migrate`. Use `pnpm --filter web-app dev` for the website and `pnpm mobile:dev` for Expo. The mobile app talks to the web API, so start the web app first.
- The web dev server binds `0.0.0.0:3000` deliberately. It is reachable on localhost, the local network, and over Tailscale. Keep it that way, and remember it when testing anything origin-dependent (including the Expo app on a device).
- It is always okay for you to have the dev server running while you work. A running dev server is not something to kill or avoid starting.
- Stop what you started, by the PID you tracked. See rule 1.

## Test data

- An empty database is a bad test. Seed the local Postgres with realistic data before verifying user-facing flows. Inspect it with pgweb at `localhost:5050`.
- Bring secrets into `.env.local` only if the flow under test needs them, and never commit them.
- Copy in, never out. Real or production data never flows into the repo, and nothing from the local sandbox gets pushed anywhere.

## Verifying

- Smallest proof that the change works: run the tests you touched (`vitest run <files>` from the root), plus targeted lint (`pnpm --filter web-app lint`) and type check (`pnpm --filter web-app type-check`) for the scope you changed.
- Backend behavior changes ship with focused tests for that behavior.
- A test that needs a timeout or sleep to pass is wrong.
- User-visible frontend changes get one integrated pass in a real browser at `http://localhost:3000` (or the Tailscale URL when verifying network behavior).

## Pull requests

- Never make a PR unless the developer explicitly asks you to do so.
- Conventional commit titles, plain language: `fix(web-app): settings page no longer drops unsaved changes`.
- Body: the problem in a sentence or two, then how you fixed it.
- UI changes need before/after images. Motion or timing needs a short video.
- One concern per PR. If the description says "also", split it.
- When babysitting CI (GitHub Actions): poll checks newer than the last push, verify each finding against the source, fix real ones, dismiss false positives with a written reason. Stay quiet when nothing is new. Stop when checks are green on the latest commit.

## Where code lives

- `apps/web-app` — the Next.js website: `app/` (routes and pages), `actions/` (server actions), `components/`, `lib/` (auth, config, services, validators, `serverUtils.ts`, i18n, resend), `messages/` (translations).
- `apps/mobile-app` — the Expo app: `src/app/` (Expo Router), `src/lib/` (auth client, API client, services, validators). It authenticates against the web app and calls the same API. See `apps/mobile-app/README.md`.
- `packages/database` — Drizzle schema (`src/schemas.ts`), repositories (`src/repositories/`), migrations, and database config.
- `packages/common` — shared config and types.
- Repo root — `docker-compose.yml` (Postgres + pgweb), `vitest.config.mjs`, workspace scripts.

## Taste

- Complexity belongs at the layer boundary. Repositories hide Drizzle, services hide business rules, route wrappers hide auth, UI stays dumb.
- Inferred types over annotations. `any` is the enemy.
- Comments describe how a thing is used, and move when the code moves. Use them mostly to describe functions, not to annotate every line of behavior.
- If a rule here fights the task in front of you, say so loudly and get a human sign-off before breaking it.

## Additional tips

- Security is important, but should not be over-indexed on, especially for dev-mode or maintainer-only features.

## Architecture

This template's value is its patterns. Layers make code review simple, refactoring trivial, and agent workflows fast. Maintain these patterns; do not route around them.

### Layering

Data flows in one direction through layers:

`packages/database` schema → repository → service (`apps/web-app/lib/services/`) → server action / API route → Server Component page.

Each layer only talks to the layer below it. This is what makes the stack swappable — replacing Drizzle with another ORM means replacing one repository at a time, nothing else.

### Server/client contract

- Data fetching happens on the server, usually in async `page.tsx` or `layout.tsx` files. Default to Server Components; add `'use client'` only where interaction demands it.
- Never call an API route from a client component. Server actions in `apps/web-app/actions/` are the proxy — that is what they were designed for.
- Server actions must call the API through `secureFetch` (requires a session) or `publicFetch` (public) from `lib/serverUtils.ts`. These cannot be imported on the client and will fail if you try.
- API routes are wrapped in `createRouteHandler`, which is the route-level auth layer. Public routes use `{ isPublic: true }`, protected routes `{ isAuthenticated: true }`.
- Always return the envelope: `{ data: T | null, error: string | null }`.
- Always type route params as Promises and await them: `(req, { params }: { params: Promise<{ userId: string }> })`. An API route should be around 4–5 lines of actual code.

### Centralized configuration

- No magic strings for URLs. Navigate and fetch through `AppRoutes` and `ApiRoutes` from `lib/config/featureToggles.ts`.
- Environment-dependent behavior (e.g., email verification, disabled locally) lives in `featureToggles.ts`, not in scattered conditionals.

### Validation

All input validation is Zod. Schemas live in `apps/web-app/lib/validators/` with CRUD naming (`createEventSchema`, `updateEventSchema`). Never define schemas inline.

### Loading and navigation

- Every route segment has a `loading.tsx`.
- Use `LoadingLink` or `NavigationButton` for navigation and `Skeleton` components for data-fetching states.

### Monorepo boundaries

`packages/database` owns data, `packages/common` owns shared types and config, apps own product logic. App-specific services stay in the app; only genuinely shared code moves into packages.

### Invariants

- Mark server-only modules with `import 'server-only'`.
- Use `next-intl` for user-facing text and keep every language under `messages/` in sync.
- Strict TypeScript. No `any` types.
- Middleware is only for global patterns.
