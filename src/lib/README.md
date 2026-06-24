<!-- Owned by: typescript-reviewer -->

# Domain & backend (lib)

Pure, framework-agnostic TypeScript. The API routes (`src/app/api`) are thin
wrappers over these.

| Module | Responsibility |
| --- | --- |
| `types.ts` | Domain model (PartRequest, Bid, …) |
| `store.ts` | Data-access contract (in-memory v1 → `db/` later) |
| `ranking.ts` | Pure bid ranking (price/proximity/rating) |
| `geo.ts` | Haversine proximity |
| `validation.ts` | Boundary input validation |
| `pricing/` | Price suggester (mle-reviewer) |
| `errors/` | Result + AppError (silent-failure-hunter) |
| `security/` | Security headers (security-reviewer) |
| `format.ts` | Display formatting |

## Rules

- No I/O in pure modules (`ranking`, `geo`, `pricing`) — keep them testable.
- Validate at boundaries; never trust request bodies.
- Surface errors via `errors/` — no swallowed catches.
