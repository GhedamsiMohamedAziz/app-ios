// Compact list row tuned for the seller feed: distance prominent on the left,
// vehicle + part in the middle, urgency + countdown + bids on the right.

import Link from "next/link";
import type { PartRequest } from "@/lib/types";
import { countBids } from "@/lib/store";
import { urgencyMeta } from "@/lib/urgency";
import { timeRemaining } from "@/lib/expiry";
import { distanceKm } from "@/lib/geo";
import { kindMeta } from "@/lib/variants";
import type { PresetLocation } from "@/lib/locations";

interface Props {
  request: PartRequest;
  sellerLocation: PresetLocation;
}

export function SellerRequestRow({ request, sellerLocation }: Props) {
  const km = distanceKm(sellerLocation, request.buyer);
  const urgency = urgencyMeta(request.urgency);
  const bids = countBids(request.id);
  return (
    <Link
      href={`/requests/${request.id}`}
      className="seller-row"
      data-urgency={request.urgency}
      aria-label={`${request.partName} à ${km} km, urgence ${urgency.label}`}
    >
      <div className="seller-row__dist">
        <span className="seller-row__dist-emoji" aria-hidden>
          📍
        </span>
        <span className="seller-row__dist-num tabular">{km}</span>
        <span className="seller-row__dist-unit">km</span>
      </div>

      <div className="seller-row__main">
        <div className="seller-row__vehicle">
          {request.vehicle.make} {request.vehicle.model} · {request.vehicle.year}
          <span className="muted"> · {request.buyer.label}</span>
        </div>
        <h3 className="seller-row__title">{request.partName}</h3>
        <p className="seller-row__desc">{request.description}</p>
      </div>

      <div className="seller-row__meta">
        <span
          className={`urgency-badge urgency-badge--${request.urgency}`}
        >
          {urgency.emoji} {urgency.label}
        </span>
        <span className="pill pill--countdown tabular">
          ⏱ {timeRemaining(request)}
        </span>
        <span className="pill">
          {request.acceptedVariants.length === 2
            ? "📦 OEM + Adapt."
            : `${kindMeta(request.acceptedVariants[0]).emoji} ${kindMeta(request.acceptedVariants[0]).label}`}
        </span>
        <span className="pill pill--bids">
          {bids} {bids > 1 ? "offres" : "offre"}
        </span>
      </div>

      <span className="seller-row__cta" aria-hidden>
        Voir et bidder →
      </span>
    </Link>
  );
}
