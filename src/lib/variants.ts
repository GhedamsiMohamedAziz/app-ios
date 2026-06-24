// Variant helpers — OEM vs adaptable + manufacturer origin.
// From DARRAGI-VARIANTS-001 (Darragi enriched the model with origin country:
// "chinoise / allemand etc"). Presets cover the most common origins on the
// Tunisian / Maghreb spare-parts market; free text accepted for the rest.

import type { VariantKind } from "./types";

export const VARIANT_KINDS: readonly VariantKind[] = ["oem", "adaptable"] as const;

export interface KindMeta {
  label: string;
  emoji: string;
  short: string;
  blurb: string;
}

const KIND_META: Record<VariantKind, KindMeta> = {
  oem: {
    label: "OEM",
    emoji: "🏷",
    short: "OEM",
    blurb: "Pièce d'origine constructeur — qualité garantie, prix plus élevé.",
  },
  adaptable: {
    label: "Adaptable",
    emoji: "🧰",
    short: "Adaptable",
    blurb: "Pièce aftermarket compatible — souvent moins chère, qualité variable selon l'origine.",
  },
};

export function kindMeta(k: VariantKind): KindMeta {
  return KIND_META[k];
}

/** Common adaptable-part origins on the TN/Maghreb market. Free text still accepted. */
export interface OriginPreset {
  name: string;
  flag: string;
}

export const ADAPTABLE_ORIGIN_PRESETS: OriginPreset[] = [
  { name: "Allemagne", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Italie", flag: "🇮🇹" },
  { name: "Espagne", flag: "🇪🇸" },
  { name: "Turquie", flag: "🇹🇷" },
  { name: "Chine", flag: "🇨🇳" },
  { name: "Pologne", flag: "🇵🇱" },
  { name: "Roumanie", flag: "🇷🇴" },
];

/** Look up a flag emoji for a known origin, otherwise empty string. */
export function originFlag(origin: string | null | undefined): string {
  if (!origin) return "";
  const hit = ADAPTABLE_ORIGIN_PRESETS.find(
    (p) => p.name.toLowerCase() === origin.toLowerCase(),
  );
  return hit ? hit.flag : "";
}

/** Compact "Adaptable · 🇩🇪 Allemagne" or "OEM" string for badges. */
export function variantSummary(kind: VariantKind, origin: string | null): string {
  const meta = kindMeta(kind);
  if (kind === "oem" || !origin) return meta.short;
  const flag = originFlag(origin);
  return `${meta.short} · ${flag ? flag + " " : ""}${origin}`;
}
