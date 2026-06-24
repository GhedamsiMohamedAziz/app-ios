// Shared preset locations — used by the seller view picker (and reusable by the
// existing forms whenever we refactor). Union of cities seen across the app.

export interface PresetLocation {
  label: string;
  lat: number;
  lng: number;
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  { label: "Tunis Centre", lat: 36.8065, lng: 10.1815 },
  { label: "Les Berges du Lac", lat: 36.8325, lng: 10.2299 },
  { label: "Ariana", lat: 36.8625, lng: 10.1956 },
  { label: "El Manar", lat: 36.8511, lng: 10.1647 },
  { label: "Nabeul", lat: 36.4513, lng: 10.7357 },
  { label: "Sousse", lat: 35.8256, lng: 10.6411 },
  { label: "Sfax", lat: 34.7406, lng: 10.7603 },
];

export const DEFAULT_LOCATION = PRESET_LOCATIONS[0];

export function findLocation(label: string | undefined): PresetLocation {
  if (!label) return DEFAULT_LOCATION;
  return (
    PRESET_LOCATIONS.find(
      (l) => l.label.toLowerCase() === label.toLowerCase(),
    ) ?? DEFAULT_LOCATION
  );
}
