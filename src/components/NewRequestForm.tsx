"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Urgency } from "@/lib/types";
import { URGENCY_LEVELS, urgencyMeta } from "@/lib/urgency";

const PRESET_LOCATIONS = [
  { label: "Tunis Centre", lat: 36.8065, lng: 10.1815 },
  { label: "Ariana", lat: 36.8625, lng: 10.1956 },
  { label: "Sousse", lat: 35.8256, lng: 10.6411 },
  { label: "Sfax", lat: 34.7406, lng: 10.7603 },
  { label: "Nabeul", lat: 36.4513, lng: 10.7357 },
];

const PICKABLE_URGENCY: Urgency[] = URGENCY_LEVELS.filter(
  (u) => urgencyMeta(u).enabledInV1,
);

export function NewRequestForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [urgency, setUrgency] = useState<Urgency>("standard");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const loc =
      PRESET_LOCATIONS.find((l) => l.label === form.get("buyerLabel")) ??
      PRESET_LOCATIONS[0];

    const payload = {
      make: form.get("make"),
      model: form.get("model"),
      year: Number(form.get("year")),
      partName: form.get("partName"),
      description: form.get("description"),
      buyerLabel: loc.label,
      buyerLat: loc.lat,
      buyerLng: loc.lng,
      urgency,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Échec de l'envoi.");
        setSubmitting(false);
        return;
      }
      router.push(`/requests/${json.data.id}`);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <h3>Décrivez la pièce recherchée</h3>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="make">Marque</label>
          <input id="make" name="make" required placeholder="Volkswagen" />
        </div>
        <div className="field">
          <label htmlFor="model">Modèle</label>
          <input id="model" name="model" required placeholder="Golf 7" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="year">Année</label>
          <input
            id="year"
            name="year"
            type="number"
            required
            min={1950}
            max={2100}
            defaultValue={2018}
          />
        </div>
        <div className="field">
          <label htmlFor="buyerLabel">Votre ville</label>
          <select id="buyerLabel" name="buyerLabel" defaultValue="Tunis Centre">
            {PRESET_LOCATIONS.map((l) => (
              <option key={l.label} value={l.label}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="partName">Pièce</label>
        <input
          id="partName"
          name="partName"
          required
          placeholder="Plaquettes de frein avant"
        />
      </div>

      <div className="field">
        <label htmlFor="description">Détails</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          placeholder="Référence, motorisation, neuf ou occasion accepté…"
        />
        <p className="form-note">
          Plus c'est précis, plus le matching vendeur est juste.
        </p>
      </div>

      <fieldset className="urgency-picker">
        <legend>Urgence</legend>
        <div className="urgency-picker__row">
          {PICKABLE_URGENCY.map((u) => {
            const meta = urgencyMeta(u);
            const selected = urgency === u;
            return (
              <label
                key={u}
                className={`urgency-chip${selected ? " is-selected" : ""}`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={u}
                  checked={selected}
                  onChange={() => setUrgency(u)}
                />
                <span className="urgency-chip__emoji">{meta.emoji}</span>
                <span className="urgency-chip__label">{meta.label}</span>
              </label>
            );
          })}
        </div>
        <p className="form-note urgency-tradeoff" role="status">
          {urgencyMeta(urgency).tradeoff}
        </p>
      </fieldset>

      <button className="btn btn--primary" type="submit" disabled={submitting}>
        {submitting ? "Envoi…" : "Publier la demande"}
      </button>
    </form>
  );
}
