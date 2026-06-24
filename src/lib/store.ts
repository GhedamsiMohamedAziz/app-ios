import type {
  Bid,
  NewBidInput,
  NewRequestInput,
  PartRequest,
} from "./types";
import { DEFAULT_CURRENCY } from "./config";

/**
 * In-memory store for v1 (no database yet). State lives for the lifetime of the
 * server process and resets on restart. Swap this module for a real repository
 * (Postgres/Supabase) without touching the UI: the exported functions are the
 * data-access contract.
 */

interface Db {
  requests: PartRequest[];
  bids: Bid[];
}

const seedRequests: PartRequest[] = [
  {
    id: "req-1001",
    vehicle: { make: "Volkswagen", model: "Golf 7", year: 2016 },
    partName: "Plaquettes de frein avant",
    description:
      "Jeu de plaquettes avant pour Golf 7 1.6 TDI. Origine ou équivalent qualité OEM.",
    buyer: { lat: 36.8065, lng: 10.1815, label: "Tunis Centre" },
    urgency: "standard",
    status: "open",
    createdAt: "2026-06-24T08:00:00.000Z",
  },
  {
    id: "req-1002",
    vehicle: { make: "Peugeot", model: "208", year: 2019 },
    partName: "Rétroviseur droit électrique",
    description:
      "Rétroviseur extérieur côté passager, électrique, peint. Couleur gris.",
    buyer: { lat: 35.8256, lng: 10.6411, label: "Sousse" },
    urgency: "urgent",
    status: "open",
    createdAt: "2026-06-24T09:30:00.000Z",
  },
  {
    id: "req-1003",
    vehicle: { make: "Renault", model: "Clio 4", year: 2014 },
    partName: "Alternateur",
    description: "Alternateur reconditionné accepté. 1.5 dCi.",
    buyer: { lat: 36.4513, lng: 10.7357, label: "Nabeul" },
    urgency: "critical",
    status: "open",
    createdAt: "2026-06-24T10:15:00.000Z",
  },
];

const seedBids: Bid[] = [
  {
    id: "bid-2001",
    requestId: "req-1001",
    sellerName: "AutoPièces Lac",
    sellerRating: 4.6,
    price: 85,
    currency: "TND",
    condition: "new",
    seller: { lat: 36.8325, lng: 10.2299, label: "Les Berges du Lac" },
    etaDays: 1,
    createdAt: "2026-06-24T08:45:00.000Z",
  },
  {
    id: "bid-2002",
    requestId: "req-1001",
    sellerName: "Garage El Manar",
    sellerRating: 4.1,
    price: 72,
    currency: "TND",
    condition: "refurbished",
    seller: { lat: 36.8511, lng: 10.1647, label: "El Manar" },
    etaDays: 2,
    createdAt: "2026-06-24T09:05:00.000Z",
  },
  {
    id: "bid-2003",
    requestId: "req-1001",
    sellerName: "Pièces Express Ariana",
    sellerRating: 4.8,
    price: 95,
    currency: "TND",
    condition: "new",
    seller: { lat: 36.8625, lng: 10.1956, label: "Ariana" },
    etaDays: 1,
    createdAt: "2026-06-24T09:20:00.000Z",
  },
  {
    id: "bid-2004",
    requestId: "req-1002",
    sellerName: "Sousse Auto Parts",
    sellerRating: 4.3,
    price: 140,
    currency: "TND",
    condition: "used",
    seller: { lat: 35.8278, lng: 10.6, label: "Sousse Riadh" },
    etaDays: 3,
    createdAt: "2026-06-24T10:00:00.000Z",
  },
];

const globalForDb = globalThis as unknown as { __wamiaDb?: Db };

const db: Db =
  globalForDb.__wamiaDb ??
  (globalForDb.__wamiaDb = {
    requests: [...seedRequests],
    bids: [...seedBids],
  });

let counter = 0;
const nowIso = (): string => new Date().toISOString();
const nextId = (prefix: string): string => `${prefix}-${Date.now()}-${counter++}`;

export function listRequests(): PartRequest[] {
  return [...db.requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getRequest(id: string): PartRequest | undefined {
  return db.requests.find((r) => r.id === id);
}

export function listBidsForRequest(requestId: string): Bid[] {
  return db.bids.filter((b) => b.requestId === requestId);
}

export function countBids(requestId: string): number {
  return db.bids.reduce((n, b) => (b.requestId === requestId ? n + 1 : n), 0);
}

export function createRequest(input: NewRequestInput): PartRequest {
  const request: PartRequest = {
    id: nextId("req"),
    vehicle: { make: input.make, model: input.model, year: input.year },
    partName: input.partName,
    description: input.description,
    buyer: { lat: input.buyerLat, lng: input.buyerLng, label: input.buyerLabel },
    urgency: input.urgency,
    status: "open",
    createdAt: nowIso(),
  };
  db.requests.push(request);
  return request;
}

export function createBid(requestId: string, input: NewBidInput): Bid {
  const bid: Bid = {
    id: nextId("bid"),
    requestId,
    sellerName: input.sellerName,
    sellerRating: input.sellerRating,
    price: input.price,
    currency: DEFAULT_CURRENCY,
    condition: input.condition,
    seller: { lat: input.sellerLat, lng: input.sellerLng, label: input.sellerLabel },
    etaDays: input.etaDays,
    createdAt: nowIso(),
  };
  db.bids.push(bid);
  return bid;
}
