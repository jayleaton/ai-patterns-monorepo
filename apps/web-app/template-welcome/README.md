# Template welcome (safe to delete)

This folder is the student starter landing page and the “why patterns” page.

To define the project (web vs mobile, auth, database), run the `getting-started` skill in `.claude/skills/getting-started`, `.grok/skills/getting-started`, or `.agents/skills/getting-started` (Codex).

It is **not** part of the real app. Login, signup, dashboard, auth, and the database stay if you remove it.

## Remove it

1. In `apps/web-app/lib/config/featureToggles.ts`, set `templateWelcome` to `false`.
2. Delete this folder: `apps/web-app/template-welcome`.
3. Delete `apps/web-app/app/why`.
4. In `apps/web-app/app/page.tsx`, delete the `template-welcome` import if TypeScript complains.

After that, `/` shows a tiny “your app is running” screen instead of this guide.
