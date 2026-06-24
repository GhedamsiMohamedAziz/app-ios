<!-- Owned by: e2e-runner -->

# End-to-end tests

```bash
npm i -D @playwright/test && npx playwright install
npx playwright test --config e2e/playwright.config.ts
```

Journeys in `journeys/` cover: home list, open a request + see ranked bids,
post a new request. Flaky tests get quarantined, never deleted.
