<!-- Owned by: react-build-resolver -->

# Frontend build

- Next.js 14 (App Router), TypeScript.
- `next.config.mjs` — `reactStrictMode: true`; wire `src/lib/security/headers.ts` via `headers()` or middleware before prod.
- Build: `npm run build`.

## Watch
- `"use client"` only for interactivity (forms).
- Hydration deterministic (no `Date.now()` in render).
- Lazy-load heavy libs (maps/charts).
