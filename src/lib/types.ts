// Domain model for the reverse-bidding auto-parts marketplace.

export type PartCondition = "new" | "used" | "refurbished";
export type RequestStatus = "open" | "closed";

/**
 * Buyer-declared urgency. Drives the bid window duration (see lib/urgency.ts)
 * and seller-notification priority. `scheduled` reserves the slot for the v1.1
 * passive mode (target price + daily recurrence) — see DARRAGI-PASSIVE-001.
 */
export type Urgency = "critical" | "urgent" | "standard" | "scheduled";

export interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
}

/** A buyer's request for a specific part. Sellers bid on it. */
export interface PartRequest {
  id: string;
  vehicle: Vehicle;
  partName: string;
  description: string;
  buyer: GeoPoint;
  urgency: Urgency;
  status: RequestStatus;
  createdAt: string; // ISO
}

/** A seller's offer on a request. */
export interface Bid {
  id: string;
  requestId: string;
  sellerName: string;
  sellerRating: number; // 0..5
  price: number;
  currency: string;
  condition: PartCondition;
  seller: GeoPoint;
  etaDays: number;
  createdAt: string; // ISO
}

/** A bid enriched with computed distance and ranking score. */
export interface RankedBid extends Bid {
  distanceKm: number;
  score: number; // 0..1, higher is better
  breakdown: {
    price: number;
    proximity: number;
    rating: number;
  };
}

export interface NewRequestInput {
  make: string;
  model: string;
  year: number;
  partName: string;
  description: string;
  buyerLabel: string;
  buyerLat: number;
  buyerLng: number;
  urgency: Urgency;
}

export interface NewBidInput {
  sellerName: string;
  sellerRating: number;
  price: number;
  // currency removed in DARRAGI-CURRENCY-001 — locked to DEFAULT_CURRENCY at
  // the store boundary. Pivot path: re-add this field + a UI picker.
  condition: PartCondition;
  sellerLabel: string;
  sellerLat: number;
  sellerLng: number;
  etaDays: number;
}
