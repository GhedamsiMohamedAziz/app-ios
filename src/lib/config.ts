// Single-source product config. Locked values that the UI never asks about.
// Keep this file the one place to flip a switch when scope changes (multi-currency,
// multi-country, etc.) so the pivot is explicit and grep-able.

/**
 * Locked launch currency. We ship Tunisia-only in v1 — the seller form has no
 * currency picker. Bids are always TND. See DARRAGI-CURRENCY-001 in the team
 * canvas for the decision and the pivot path.
 */
export const DEFAULT_CURRENCY = "TND" as const;
export type DefaultCurrency = typeof DEFAULT_CURRENCY;
