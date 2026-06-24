// Expiry helpers for PartRequest. The bid window is driven by urgency:
//   urgency → windowMinutes → expiresAt = createdAt + windowMinutes
// At read time, the store auto-flips expired open requests to "closed"
// (lazy enforcement — a real scheduler is BIDWIN-001's production scope).
// See DARRAGI-BIDWIN-001 / BIDWIN-002 on the team canvas.

import type { PartRequest, Urgency } from "./types";
import { urgencyMeta } from "./urgency";

/** Compute `expiresAt` (ISO) for a request given its createdAt + urgency. */
export function computeExpiresAt(
  createdAt: string,
  urgency: Urgency,
): string | null {
  const w = urgencyMeta(urgency).windowMinutes;
  if (w === null) return null; // passive/scheduled mode — no fixed expiry
  return new Date(new Date(createdAt).getTime() + w * 60_000).toISOString();
}

/** True if the request's bidding window is over. */
export function isExpired(req: PartRequest, now = Date.now()): boolean {
  if (!req.expiresAt) return false;
  return new Date(req.expiresAt).getTime() <= now;
}

/**
 * Human-readable time remaining ("23 h 12", "12 min", "30 s", "Expirée").
 * Short, glanceable — meant for a badge.
 */
export function timeRemaining(req: PartRequest, now = Date.now()): string {
  if (!req.expiresAt) return "—";
  const msLeft = new Date(req.expiresAt).getTime() - now;
  if (msLeft <= 0) return "Expirée";

  const totalSec = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSec / 86_400);
  const hours = Math.floor((totalSec % 86_400) / 3_600);
  const mins = Math.floor((totalSec % 3_600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days} j ${hours} h`;
  if (hours > 0) return `${hours} h ${String(mins).padStart(2, "0")}`;
  if (mins > 0) return `${mins} min`;
  return `${secs} s`;
}
