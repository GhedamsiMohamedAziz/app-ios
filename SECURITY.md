<!-- Owned by: security-reviewer -->

# Security

## Baseline (v1)
- Input validation at API boundaries (`src/lib/validation.ts`).
- No secrets in repo (`.env.example`; real values in `.env.local`).
- Security headers (`src/lib/security/headers.ts`) — wire into `next.config.mjs` `headers()` or middleware before prod.

## Before production
- [ ] Authentication + buyer/seller roles
- [ ] Rate limiting on `POST /api/requests` and `/bids`
- [ ] CSRF protection
- [ ] Content Security Policy (nonce-based)
- [ ] `npm audit` in CI

## Reporting
Report vulnerabilities privately. Do not open a public issue.
