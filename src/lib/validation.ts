import type { NewBidInput, NewRequestInput, PartCondition } from "./types";

/** Thrown when boundary input fails validation. API routes map it to HTTP 400. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function asString(v: unknown, field: string, max = 280): string {
  if (typeof v !== "string" || v.trim() === "") {
    throw new ValidationError(`"${field}" is required.`);
  }
  if (v.length > max) {
    throw new ValidationError(`"${field}" is too long (max ${max}).`);
  }
  return v.trim();
}

function asNumber(v: unknown, field: string, min: number, max: number): number {
  const n = typeof v === "string" ? Number(v) : v;
  if (typeof n !== "number" || Number.isNaN(n)) {
    throw new ValidationError(`"${field}" must be a number.`);
  }
  if (n < min || n > max) {
    throw new ValidationError(`"${field}" must be between ${min} and ${max}.`);
  }
  return n;
}

const CONDITIONS: PartCondition[] = ["new", "used", "refurbished"];

export function parseNewRequest(body: unknown): NewRequestInput {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    make: asString(b.make, "make", 60),
    model: asString(b.model, "model", 60),
    year: asNumber(b.year, "year", 1950, 2100),
    partName: asString(b.partName, "partName", 120),
    description: asString(b.description, "description", 1000),
    buyerLabel: asString(b.buyerLabel, "buyerLabel", 120),
    buyerLat: asNumber(b.buyerLat, "buyerLat", -90, 90),
    buyerLng: asNumber(b.buyerLng, "buyerLng", -180, 180),
  };
}

export function parseNewBid(body: unknown): NewBidInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const condition = asString(b.condition, "condition", 20) as PartCondition;
  if (!CONDITIONS.includes(condition)) {
    throw new ValidationError(`"condition" must be one of: ${CONDITIONS.join(", ")}.`);
  }
  return {
    sellerName: asString(b.sellerName, "sellerName", 80),
    sellerRating: asNumber(b.sellerRating, "sellerRating", 0, 5),
    price: asNumber(b.price, "price", 0, 1_000_000),
    currency: asString(b.currency, "currency", 8),
    condition,
    sellerLabel: asString(b.sellerLabel, "sellerLabel", 120),
    sellerLat: asNumber(b.sellerLat, "sellerLat", -90, 90),
    sellerLng: asNumber(b.sellerLng, "sellerLng", -180, 180),
    etaDays: asNumber(b.etaDays, "etaDays", 0, 365),
  };
}
