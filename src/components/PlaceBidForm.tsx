"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRESET_LOCATIONS = [
  { label: "Tunis Centre", lat: 36.8065, lng: 10.1815 },
  { label: "Les Berges du Lac", lat: 36.8325, lng: 10.2299 },
  { label: "Ariana", lat: 36.8625, lng: 10.1956 },
  { label: "El Manar", lat: 36.8511, lng: 10.1647 },
  { label: "Sousse", lat: 35.8256, lng: 10.6411 },
];

export function PlaceBidForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const loc =
      PRESET_LOCATIONS.find((l) => l.label === form.get("sellerLabel")) ??
      PRESET_LOCATIONS[0];

    const payload = {
      sellerName: form.get("sellerName"),
      sellerRating: Number(form.get("sellerRating")),
      price: Number(form.get("price")),
      currency: "TND",
      condition: form.get("condition"),
      sellerLabel: loc.label,
      sellerLat: loc.lat,
      sellerLng: loc.lng,
      etaDays: Number(form.get("etaDays")),
    };

    try {
      const res = await fetch(`/api/requests/${requestId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Échec de l'offre.");
        setSubmitting(false);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setSubmitting(false);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <h3>Faire une offre (vendeur)</h3>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="field">
        <label htmlFor="sellerName">Nom du vendeur</label>
        <input id="sellerName" name="sellerName" required placeholder="AutoPièces Lac" />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Prix (TND)</label>
          <input id="price" name="price" type="number" required min={0} placeholder="85" />
        </div>
        <div className="field">
          <label htmlFor="etaDays">Délai (jours)</label>
          <input id="etaDays" name="etaDays" type="number" required min={0} defaultValue={2} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="condition">État</label>
          <select id="condition" name="condition" defaultValue="new">
            <option value="new">Neuf</option>
            <option value="used">Occasion</option>
            <option value="refurbished">Reconditionné</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="sellerRating">Note vendeur</label>
          <input
            id="sellerRating"
            name="sellerRating"
            type="number"
            step="0.1"
            min={0}
            max={5}
            required
            defaultValue={4.5}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="sellerLabel">Localisation</label>
        <select id="sellerLabel" name="sellerLabel" defaultValue="Les Berges du Lac">
          {PRESET_LOCATIONS.map((l) => (
            <option key={l.label} value={l.label}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn--primary" type="submit" disabled={submitting}>
        {submitting ? "Envoi…" : "Soumettre l'offre"}
      </button>
    </form>
  );
}
