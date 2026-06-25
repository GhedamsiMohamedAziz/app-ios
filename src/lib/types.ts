// Domain model for the reverse-bidding auto-parts marketplace.

export type PartCondition = "new" | "used" | "refurbished";
export type RequestStatus = "open" | "closed";

/**
 * Part variant kind. OEM = original manufacturer; adaptable = aftermarket.
 * Sellers post one bid per (kind, origin) combo — see DARRAGI-VARIANTS-001.
 */
export type VariantKind = "oem" | "adaptable";

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
  /** Which variant kinds the buyer accepts. Must contain at least one element. */
  acceptedVariants: VariantKind[];
  status: RequestStatus;
  createdAt: string; // ISO
  /** ISO. Computed from urgency. Null only in passive mode (urgency=scheduled). */
  expiresAt: string | null;
  /** Optional target price per variant kind. Drives the green/red coding on
   *  incoming bids without altering the ranking. DARRAGI-PASSIVE-001 (visual). */
  targetPrice: Partial<Record<VariantKind, number>> | null;
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
  /** OEM original or adaptable (aftermarket). Must be in request.acceptedVariants. */
  kind: VariantKind;
  /** Manufacturer / country origin label (free text + presets, see lib/variants).
   *  Null for OEM (origin implicit = vehicle brand) or unspecified adaptable. */
  origin: string | null;
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
  acceptedVariants: VariantKind[];
  targetPrice: Partial<Record<VariantKind, number>> | null;
}

export interface NewBidInput {
  sellerName: string;
  sellerRating: number;
  price: number;
  // currency removed in DARRAGI-CURRENCY-001 — locked to DEFAULT_CURRENCY at
  // the store boundary. Pivot path: re-add this field + a UI picker.
  condition: PartCondition;
  kind: VariantKind;
  origin: string | null;
  sellerLabel: string;
  sellerLat: number;
  sellerLng: number;
  etaDays: number;
}
