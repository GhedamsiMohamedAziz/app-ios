// Buyer-declared urgency → bid-window duration + UX metadata.
// Drives BIDWIN-001 (window length) and FANOUT-001 (seller notif priority).
// See discussion in #darragi-ideas → DARRAGI-URGENCY-001.

import type { Urgency } from "./types";

export const URGENCY_LEVELS: readonly Urgency[] = [
  "critical",
  "urgent",
  "standard",
  "scheduled",
] as const;

export interface UrgencyMeta {
  label: string;
  emoji: string;
  /** Bid window in minutes; null = passive (scheduled, v1.1). */
  windowMinutes: number | null;
  /**
   * Anti-abuse contract shown to the buyer ("coût visible"). Picking 🔥 must
   * cost something so the signal stays meaningful — see DARRAGI-URGENCY-001.
   */
  tradeoff: string;
  /** v1 = pickable on the form. scheduled is v1.1, disabled for now. */
  enabledInV1: boolean;
}

const META: Record<Urgency, UrgencyMeta> = {
  critical: {
    label: "Critique",
    emoji: "🔥",
    windowMinutes: 5,
    tradeoff:
      "Fenêtre 5 min : moins d'offres reçues, prix probablement plus élevé. À réserver à une panne.",
    enabledInV1: true,
  },
  urgent: {
    label: "Urgent",
    emoji: "⚡",
    windowMinutes: 30,
    tradeoff: "Fenêtre 30 min : compromis raisonnable pour cette semaine.",
    enabledInV1: true,
  },
  standard: {
    label: "Standard",
    emoji: "🕒",
    windowMinutes: 24 * 60,
    tradeoff:
      "Fenêtre 24 h : vous recevrez les meilleures offres, prix optimisé. Recommandé.",
    enabledInV1: true,
  },
  scheduled: {
    label: "Planifié",
    emoji: "🐢",
    windowMinutes: null,
    tradeoff: "Mode passif avec prix cible — disponible en v1.1.",
    enabledInV1: false,
  },
};

export function urgencyMeta(u: Urgency): UrgencyMeta {
  return META[u];
}

/** Human-readable window, e.g. "5 min", "30 min", "24 h". */
export function formatWindow(u: Urgency): string {
  const m = META[u].windowMinutes;
  if (m === null) return "Planifié (passif)";
  if (m < 60) return `${m} min`;
  const h = m / 60;
  return h < 24 ? `${h} h` : `${h / 24} j`;
}
