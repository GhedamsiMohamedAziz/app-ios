import Link from "next/link";
import type { PartRequest } from "@/lib/types";
import { countBids } from "@/lib/store";
import { urgencyMeta } from "@/lib/urgency";
import { timeRemaining } from "@/lib/expiry";

export function RequestCard({ request }: { request: PartRequest }) {
  const bids = countBids(request.id);
  const urgency = urgencyMeta(request.urgency);
  const closed = request.status === "closed";
  return (
    <Link
      href={`/requests/${request.id}`}
      className={`card${closed ? " card--closed" : ""}`}
      data-urgency={request.urgency}
    >
      <div className="card__top-row">
        <div className="card__vehicle">
          {request.vehicle.make} {request.vehicle.model} · {request.vehicle.year}
        </div>
        <span
          className={`urgency-badge urgency-badge--${request.urgency}`}
          title={`Urgence : ${urgency.label}`}
        >
          {urgency.emoji} {urgency.label}
        </span>
      </div>
      <h3 className="card__title">{request.partName}</h3>
      <p className="card__desc">{request.description}</p>
      <div className="card__foot">
        <span className="pill">📍 {request.buyer.label}</span>
        {closed ? (
          <span className="pill pill--closed">Clôturée</span>
        ) : (
          <span className="pill pill--countdown" title="Temps restant">
            ⏱ {timeRemaining(request)}
          </span>
        )}
        <span className="pill pill--bids">
          {bids} {bids > 1 ? "offres" : "offre"}
        </span>
      </div>
    </Link>
  );
}
