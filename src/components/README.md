<!-- Owned by: react-reviewer -->

# Components

Presentational + small client components for the marketplace UI.

- `RequestCard.tsx` — server component, one open request (links to detail).
- `NewRequestForm.tsx` — client, posts a new part request.
- `PlaceBidForm.tsx` — client, submits a seller bid.

## Conventions

- Server components by default; `"use client"` only for interactivity.
- Keyboard/focus + ARIA on every interactive element.
- Styling via design tokens in `src/app/globals.css` (no inline palette).
- One component per file, PascalCase.
