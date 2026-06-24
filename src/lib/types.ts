// Domain model for the reverse-bidding auto-parts marketplace.

export type PartCondition = "new" | "used" | "refurbished";
export type RequestStatus = "open" | "closed";

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
}

export interface NewBidInput {
  sellerName: string;
  sellerRating: number;
  price: number;
  currency: string;
  condition: PartCondition;
  sellerLabel: string;
  sellerLat: number;
  sellerLng: number;
  etaDays: number;
}
