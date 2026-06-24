import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequest, listBidsForRequest } from "@/lib/store";
import { rankBids } from "@/lib/ranking";
import { conditionLabel, formatPrice, stars } from "@/lib/format";
import { formatWindow, urgencyMeta } from "@/lib/urgency";
import { PlaceBidForm } from "@/components/PlaceBidForm";

export const dynamic = "force-dynamic";

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const request = getRequest(params.id);
  if (!request) notFound();

  const ranked = rankBids(listBidsForRequest(request.id), request.buyer);

  return (
    <section className="container detail">
      <Link href="/" className="detail__back">
        ← Retour aux demandes
      </Link>

      <div className="detail__head">
        <div className="card__top-row">
          <div className="card__vehicle">
            {request.vehicle.make} {request.vehicle.model} ·{" "}
            {request.vehicle.year}
          </div>
          <span
            className={`urgency-badge urgency-badge--${request.urgency}`}
            title={`Urgence : ${urgencyMeta(request.urgency).label}`}
          >
            {urgencyMeta(request.urgency).emoji}{" "}
            {urgencyMeta(request.urgency).label}
          </span>
        </div>
        <h1 className="detail__title">{request.partName}</h1>
        <p className="muted" style={{ margin: "0 0 0.6rem" }}>
          {request.description}
        </p>
        <div className="meta-row">
          <span>📍 {request.buyer.label}</span>
          <span>⏱ Fenêtre de bid : {formatWindow(request.urgency)}</span>
          <span>
            {ranked.length} {ranked.length > 1 ? "offres reçues" : "offre reçue"}
          </span>
        </div>
      </div>

      <div className="layout-2col">
        <div>
          <div className="section-head">
            <h2>Offres classées</h2>
            <span className="muted">prix · proximité · note</span>
          </div>

          {ranked.length === 0 ? (
            <div className="empty">
              Aucune offre pour l'instant. Soyez le premier à enchérir →
            </div>
          ) : (
            ranked.map((bid, i) => (
              <article
                key={bid.id}
                className={`bid${i === 0 ? " bid--best" : ""}`}
                aria-label={`Offre #${i + 1} — ${bid.sellerName}`}
              >
                <div className="bid__top">
                  <div>
                    <span className="bid__rank">#{i + 1}</span>{" "}
                    <span className="bid__seller">{bid.sellerName}</span>
                    <div className="bid__rating">{stars(bid.sellerRating)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {i === 0 && <span className="badge-best">Meilleur deal</span>}
                    <div className="bid__price">
                      {formatPrice(bid.price, bid.currency)}
                    </div>
                  </div>
                </div>

                <div className="bid__grid">
                  <div className="bid__stat">
                    <span>Proximité</span>
                    <strong>{bid.distanceKm} km</strong>
                  </div>
                  <div className="bid__stat">
                    <span>État</span>
                    <strong>{conditionLabel(bid.condition)}</strong>
                  </div>
                  <div className="bid__stat">
                    <span>Délai</span>
                    <strong>
                      {bid.etaDays} {bid.etaDays > 1 ? "jours" : "jour"}
                    </strong>
                  </div>
                </div>

                <div
                  className="scorebar"
                  role="img"
                  aria-label={`Score ${Math.round(bid.score * 100)} sur 100`}
                >
                  <div
                    className="scorebar__fill"
                    style={{ width: `${Math.round(bid.score * 100)}%` }}
                  />
                </div>
              </article>
            ))
          )}
        </div>

        <aside>
          <PlaceBidForm requestId={request.id} />
        </aside>
      </div>
    </section>
  );
}
