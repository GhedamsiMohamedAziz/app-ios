// Owned by: mle-reviewer (with architect)
import type { Bid } from "../types";
import type { PriceSuggestion } from "./types";

/** Median of a numeric list (empty → 0). */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * v1 heuristic price suggester. Given historical bids for similar parts,
 * suggest a competitive-but-profitable price.
 *
 * This is intentionally a transparent heuristic, not a black box — it is the
 * seam where a trained model (mle-reviewer) plugs in later. Same signature.
 */
export function suggestPrice(
  history: Bid[],
  currency = "TND",
): PriceSuggestion {
  if (history.length < 3) {
    return {
      currency,
      suggested: 0,
      low: 0,
      high: 0,
      basis: "cold-start",
      sampleSize: history.length,
    };
  }

  const prices = history.map((b) => b.price);
  const mid = median(prices);

  // Aim slightly below median to win the bid; band is ±15%.
  return {
    currency,
    suggested: Math.round(mid * 0.95),
    low: Math.round(mid * 0.85),
    high: Math.round(mid * 1.15),
    basis: "market-history",
    sampleSize: history.length,
  };
}
