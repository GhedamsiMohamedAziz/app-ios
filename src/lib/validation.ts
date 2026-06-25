import type { NewBidInput, NewRequestInput, PartCondition, Urgency, VariantKind } from "./types";
import { URGENCY_LEVELS, urgencyMeta } from "./urgency";
import { VARIANT_KINDS } from "./variants";

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
  const urgencyRaw = (b.urgency ?? "standard") as string;
  if (!URGENCY_LEVELS.includes(urgencyRaw as Urgency)) {
    throw new ValidationError(
      `"urgency" must be one of: ${URGENCY_LEVELS.join(", ")}.`,
    );
  }
  const urgency = urgencyRaw as Urgency;
  if (!urgencyMeta(urgency).enabledInV1) {
    throw new ValidationError(`"urgency" "${urgency}" is not available in v1.`);
  }
  // acceptedVariants — default to both. Must be a non-empty subset of VARIANT_KINDS.
  const rawAccepted = Array.isArray(b.acceptedVariants)
    ? (b.acceptedVariants as unknown[])
    : ["oem", "adaptable"];
  const acceptedVariants = rawAccepted.filter(
    (v): v is VariantKind => typeof v === "string" && VARIANT_KINDS.includes(v as VariantKind),
  );
  if (acceptedVariants.length === 0) {
    throw new ValidationError(
      `"acceptedVariants" must contain at least one of: ${VARIANT_KINDS.join(", ")}.`,
    );
  }

  // targetPrice — optional; per accepted variant. Drop entries for variants
  // not in acceptedVariants (a buyer who only accepts adaptable should not be
  // able to set an OEM target). Empty object → null.
  let targetPrice: Partial<Record<VariantKind, number>> | null = null;
  const rawTarget = b.targetPrice;
  if (rawTarget && typeof rawTarget === "object") {
    const obj = rawTarget as Record<string, unknown>;
    const acc: Partial<Record<VariantKind, number>> = {};
    for (const kind of acceptedVariants) {
      const raw = obj[kind];
      if (raw === undefined || raw === null || raw === "") continue;
      const n = typeof raw === "string" ? Number(raw) : raw;
      if (typeof n !== "number" || Number.isNaN(n) || n <= 0 || n > 1_000_000) {
        throw new ValidationError(
          `"targetPrice.${kind}" must be a positive number under 1 000 000.`,
        );
      }
      acc[kind] = Math.round(n);
    }
    if (Object.keys(acc).length > 0) targetPrice = acc;
  }

  return {
    make: asString(b.make, "make", 60),
    model: asString(b.model, "model", 60),
    year: asNumber(b.year, "year", 1950, 2100),
    partName: asString(b.partName, "partName", 120),
    description: asString(b.description, "description", 1000),
    buyerLabel: asString(b.buyerLabel, "buyerLabel", 120),
    buyerLat: asNumber(b.buyerLat, "buyerLat", -90, 90),
    buyerLng: asNumber(b.buyerLng, "buyerLng", -180, 180),
    urgency,
    acceptedVariants,
    targetPrice,
  };
}

export function parseNewBid(body: unknown): NewBidInput {
  const b = (body ?? {}) as Record<string, unknown>;
  const condition = asString(b.condition, "condition", 20) as PartCondition;
  if (!CONDITIONS.includes(condition)) {
    throw new ValidationError(`"condition" must be one of: ${CONDITIONS.join(", ")}.`);
  }
  // kind — mandatory; must be a known variant kind.
  const kindRaw = asString(b.kind, "kind", 20);
  if (!VARIANT_KINDS.includes(kindRaw as VariantKind)) {
    throw new ValidationError(
      `"kind" must be one of: ${VARIANT_KINDS.join(", ")}.`,
    );
  }
  const kind = kindRaw as VariantKind;
  // origin — optional free string; only meaningful for adaptable. Trim + cap.
  const originRaw = typeof b.origin === "string" ? b.origin.trim() : "";
  const origin = originRaw.length > 0 ? originRaw.slice(0, 60) : null;

  return {
    sellerName: asString(b.sellerName, "sellerName", 80),
    sellerRating: asNumber(b.sellerRating, "sellerRating", 0, 5),
    price: asNumber(b.price, "price", 0, 1_000_000),
    // currency intentionally omitted — locked to DEFAULT_CURRENCY in createBid().
    condition,
    kind,
    origin,
    sellerLabel: asString(b.sellerLabel, "sellerLabel", 120),
    sellerLat: asNumber(b.sellerLat, "sellerLat", -90, 90),
    sellerLng: asNumber(b.sellerLng, "sellerLng", -180, 180),
    etaDays: asNumber(b.etaDays, "etaDays", 0, 365),
  };
}
