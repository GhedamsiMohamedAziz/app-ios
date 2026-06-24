"use client";

// Client component — updates ?city= via the router. Server page re-renders
// with the new sort. Keeps the rest of the seller view fully server-rendered.

import { useRouter } from "next/navigation";
import { PRESET_LOCATIONS } from "@/lib/locations";

export function SellerCityPicker({ value }: { value: string }) {
  const router = useRouter();
  return (
    <label className="city-picker">
      <span className="city-picker__lead">Tu es à</span>
      <select
        className="city-picker__select"
        value={value}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set("city", e.target.value);
          router.push(`${url.pathname}?${url.searchParams.toString()}`);
          router.refresh();
        }}
        aria-label="Ville de référence (vendeur)"
      >
        {PRESET_LOCATIONS.map((l) => (
          <option key={l.label} value={l.label}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
