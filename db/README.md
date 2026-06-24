<!-- Owned by: database-reviewer -->

# Data layer

v1 runs on an in-memory store (`src/lib/store.ts`). This folder holds the target
**Postgres** schema that will back the repository functions without changing the UI.

- `schema.sql` — source of truth for tables.
- `migrations/` — append-only migrations.

## Plan
1. Provision Postgres, set `DATABASE_URL`.
2. Apply `migrations/0001_init.sql`.
3. Reimplement `src/lib/store.ts` functions against the DB (same signatures).
4. Seed from the current in-memory seed data.
