import type { Bid, GeoPoint, RankedBid } from "./types";
import { distanceKm } from "./geo";

/**
 * Ranking weights. Price dominates, proximity next, rating as a tie-breaker.
 * Default "best deal" ordering from Darragi's idea: prix / proximité / rating.
 */
export const WEIGHTS = {
  price: 0.45,
  proximity: 0.3,
  rating: 0.25,
} as const;

const MAX_RATING = 5;

/** Normalise so that the best value in the set scores 1 and the worst scores 0. */
function normaliseInverse(value: number, min: number, max: number): number {
  if (max === min) return 1;
  return (max - value) / (max - min);
}

/**
 * Rank a set of bids for one request, best deal first.
 * - price: lower is better (relative to the set)
 * - proximity: closer to the buyer is better
 * - rating: higher seller rating is better
 */
export function rankBids(bids: Bid[], buyer: GeoPoint): RankedBid[] {
  if (bids.length === 0) return [];

  const withDistance = bids.map((bid) => ({
    bid,
    distance: distanceKm(buyer, bid.seller),
  }));

  const prices = withDistance.map((b) => b.bid.price);
  const distances = withDistance.map((b) => b.distance);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  const ranked = withDistance.map(({ bid, distance }): RankedBid => {
    const priceScore = normaliseInverse(bid.price, minPrice, maxPrice);
    const proximityScore = normaliseInverse(distance, minDist, maxDist);
    const ratingScore = bid.sellerRating / MAX_RATING;

    const score =
      WEIGHTS.price * priceScore +
      WEIGHTS.proximity * proximityScore +
      WEIGHTS.rating * ratingScore;

    return {
      ...bid,
      distanceKm: distance,
      score: Math.round(score * 1000) / 1000,
      breakdown: {
        price: Math.round(priceScore * 100) / 100,
        proximity: Math.round(proximityScore * 100) / 100,
        rating: Math.round(ratingScore * 100) / 100,
      },
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}
