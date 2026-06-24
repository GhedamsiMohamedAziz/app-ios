import Link from "next/link";
import type { PartRequest } from "@/lib/types";
import { countBids } from "@/lib/store";

export function RequestCard({ request }: { request: PartRequest }) {
  const bids = countBids(request.id);
  return (
    <Link href={`/requests/${request.id}`} className="card">
      <div className="card__vehicle">
        {request.vehicle.make} {request.vehicle.model} · {request.vehicle.year}
      </div>
      <h3 className="card__title">{request.partName}</h3>
      <p className="card__desc">{request.description}</p>
      <div className="card__foot">
        <span className="pill">📍 {request.buyer.label}</span>
        <span className="pill pill--bids">
          {bids} {bids > 1 ? "offres" : "offre"}
        </span>
      </div>
    </Link>
  );
}
