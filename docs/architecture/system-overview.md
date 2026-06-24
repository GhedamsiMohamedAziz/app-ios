<!-- Owned by: architect -->

# System overview

Wamia Parts is a **reverse-bidding marketplace**: buyers post a part request,
nearby sellers bid, bids are ranked, the buyer finalises.

## Layers

```
┌──────────────────────────────────────────────┐
│  UI (Next.js App Router)   src/app, src/components
├──────────────────────────────────────────────┤
│  API (route handlers)      src/app/api
│   - boundary validation (src/lib/validation)
│   - error envelope (src/lib/errors)
├──────────────────────────────────────────────┤
│  Domain                    src/lib
│   - types, ranking, geo, pricing
├──────────────────────────────────────────────┤
│  Data access (repository)  src/lib/store → db/
│   - in-memory for v1, Postgres next
└──────────────────────────────────────────────┘
```

## Key decisions
- Repository boundary: UI depends on `src/lib/store` functions, not on storage.
- Ranking is pure (`src/lib/ranking.ts`) — no I/O, easy to test.
- Pricing is a separate brick (`src/lib/pricing/`) — the differentiator.

See `adr/` for individual decisions.
