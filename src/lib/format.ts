import type { PartCondition } from "./types";

export function formatPrice(value: number, currency: string): string {
  return `${value.toLocaleString("fr-FR")} ${currency}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CONDITION_LABELS: Record<PartCondition, string> = {
  new: "Neuf",
  used: "Occasion",
  refurbished: "Reconditionné",
};

export function conditionLabel(c: PartCondition): string {
  return CONDITION_LABELS[c];
}

/** Compact star string for a 0..5 rating, e.g. "★★★★☆ 4.6". */
export function stars(rating: number): string {
  const full = Math.round(rating);
  return `${"★".repeat(full)}${"☆".repeat(5 - full)} ${rating.toFixed(1)}`;
}
