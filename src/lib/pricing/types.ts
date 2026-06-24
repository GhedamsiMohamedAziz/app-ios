// Owned by: mle-reviewer (with architect)
// The pricing-intelligence brick — Darragi's differentiator: suggest a fair
// price from market signal instead of leaving the seller to guess.

export interface PriceSuggestion {
  currency: string;
  /** Recommended bid to win while staying profitable. */
  suggested: number;
  /** Confidence band. */
  low: number;
  high: number;
  /** How the suggestion was derived, for transparency to the seller. */
  basis: "market-history" | "cold-start";
  sampleSize: number;
}
