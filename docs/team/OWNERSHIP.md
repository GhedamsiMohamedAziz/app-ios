# Team ownership — who owns which part

Each agent owns the structure of its part of the marketplace. This maps the
ECC agent team to concrete paths. See `.github/CODEOWNERS` for the enforced view.

| Agent | Part | Paths |
| --- | --- | --- |
| **architect** | Architecture & decisions | `docs/architecture/**` |
| **code-reviewer** | Review process | `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/review-checklist.md` |
| **build-error-resolver** | CI / build | `.github/workflows/**`, `tsconfig.json`, `next.config.mjs` |
| **security-reviewer** | Security & auth | `src/lib/security/**`, `.env.example`, `SECURITY.md` |
| **performance-optimizer** | Performance budgets | `docs/performance/**` |
| **e2e-runner** | End-to-end tests | `e2e/**` |
| **mle-reviewer** | Pricing intelligence (differentiator) | `src/lib/pricing/**` |
| **database-reviewer** | Data layer & schema | `db/**` |
| **doc-updater** | Docs & codemap | `docs/CODEMAP.md`, `docs/README.md` |
| **react-reviewer** | Frontend components | `src/components/**`, `src/app/**` (UI) |
| **react-build-resolver** | Frontend build | `next.config.mjs`, `docs/frontend/**` |
| **typescript-reviewer** | Backend TS | `src/lib/**`, `src/app/api/**` |
| **silent-failure-hunter** | Error handling | `src/lib/errors/**` |
