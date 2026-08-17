---
name: getting-started
description: Walk a new clone of this template through project definition — what the app is, web vs mobile, auth, database, email, languages, and the starter welcome page. Writes a brief into AGENTS.md and CLAUDE.md. Use when the user says get started, onboard, set up this template, define the project, first setup, configure the template, or runs /getting-started.
---

# Getting started

Help someone who just cloned this template say what they are building. You are defining the project, not generating a new one and not deleting unused parts.

This repo has two apps that share one API:

- `apps/web-app` — Next.js website
- `apps/mobile-app` — Expo (React Native) iOS/Android app. It signs in against the web app’s Better Auth server and calls the same `{ data, error }` API.

Shared data lives in `packages/database` and `packages/common`. The mobile app does not have its own backend.

## Hard rules

- Ask the questions below. Do not invent answers.
- If they are unsure, pick the **safe default** in parentheses and say so.
- Confirm the filled brief in chat **before** writing any files.
- Write the same brief into root `AGENTS.md` and `CLAUDE.md`.
- Do **not** delete `apps/`, `packages/`, auth, Drizzle, i18n, `apps/mobile-app`, or `template-welcome` unless they explicitly ask after the brief is written.
- Do **not** add a second Next app, a second Expo app, or new packages.
- Do **not** turn on email verification in development.
- Do **not** point `.env.local` at a remote or production database.
- Do **not** tell them there is no mobile app.

## Questions

Ask all of these in **one** message as a numbered list. They can answer in any format.

1. **What is this?** One sentence. What does the product do?
2. **Who is it for?** Students, a sports team, a small shop — plain language.
3. **Where does it run?** `both` (default) · `web only` · `mobile only`. “Only” means ignore the other app for now; do not delete it. Mobile still needs the web API running in the background.
4. **Do people need accounts?** `yes` (default) · `not sure` · `no`. “No” means ignore auth for now; do not remove it.
5. **Do you need a database?** `yes` (default) · `not sure` · `no`. Same as auth: “no” means ignore, not delete.
6. **Do you need real emails?** Password reset, “verify your email”. `later` (default) · `now` · `no`.
7. **More than one language?** `English only` (default) · `yes, also <languages>`.
8. **Keep the student welcome page on the website `/`?** `keep` (default) · `hide`. Hide only flips a flag. Deleting the folder is a separate, explicit ask.

If they already answered some of this in the conversation, do not re-ask those. Fill gaps only.

## After they answer

Show a compact brief and wait for “yes”:

```
Product: …
Audience: …
Surfaces: …
Auth: …
Database: …
Email: …
Languages: …
Welcome page: …
```

Then apply it.

### 1. Write the brief

In **both** `AGENTS.md` and `CLAUDE.md`, replace the block between the markers if it exists. If it does not exist, insert the whole block immediately after the `## Project Overview` section (after the guiding-principle paragraph, before `## What makes this template good`).

Use this exact shape:

```markdown
## Project definition

<!-- getting-started:start -->
- **Product:** {one sentence}
- **Audience:** {who}
- **Surfaces:** {both | web only | mobile only}
- **Auth:** {yes | ignore for now}
- **Database:** {yes | ignore for now}
- **Email:** {now | later | no}
- **Languages:** {English only | English + …}
- **Welcome page:** {keep | hidden}
<!-- getting-started:end -->
```

Do not rewrite the rest of those files.

### 2. Optional flag change

Only if they chose **hide** for the welcome page:

- In `apps/web-app/lib/config/featureToggles.ts`, set `templateWelcome` to `false` in both `ProdFeatureToggles` and `DevFeatureToggles`.
- Do not delete `apps/web-app/template-welcome` or `apps/web-app/app/why` unless they ask in a follow-up.

Leave `emailVerification` as it is (off in development, on in production) even if they said email “now”. “Now” means they should add Resend keys to `.env.local`, not that you flip the prod flag in dev.

### 3. Tell them what happens next

In chat, give only the steps that match their brief:

- Copy `.env.example` to `.env.local` if they do not have one. See `.env.example` for the current keys.
- If **Database** is yes: `docker compose up -d`, then `pnpm db:migrate`.
- If **Surfaces** includes web: `pnpm --filter web-app dev` (binds `0.0.0.0:3000`, so localhost or Tailscale both work).
- If **Surfaces** includes mobile: the web API must already be running, then `pnpm mobile:dev`. Point `EXPO_PUBLIC_API_URL` at that API — see `apps/mobile-app/README.md` (simulator vs emulator vs physical device / Tailscale).
- If **Surfaces** is mobile only: still start the web API. The Expo app has no backend of its own.
- If **Auth** is yes and they use web: open `/signup`. If they use mobile: use the sign-up screen in the Expo app.
- If **Email** is now: they need `RESEND_API_KEY` and `FROM_EMAIL` in `.env.local`.
- First code change: one tiny feature that follows the existing service → repository pattern (web: server action; mobile: `src/lib/services` + `src/lib/api/client.ts`). Do not start that work unless they ask.

## Voice

Talk like a patient tutor. No jargon without a five-word translation. “Auth” = “people sign in”. “Database” = “a place that remembers data after you refresh”.
