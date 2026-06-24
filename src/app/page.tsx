import Link from "next/link";
import { listRequests } from "@/lib/store";
import { RequestCard } from "@/components/RequestCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const requests = listRequests();

  return (
    <>
      <section className="container hero" aria-labelledby="hero-title">
        <span className="hero__eyebrow">Bidding inversé · pièces auto</span>
        <h1 id="hero-title" className="hero__title">
          La bonne pièce, au meilleur deal.
        </h1>
        <p className="hero__lead">
          Décrivez la pièce dont vous avez besoin. Les vendeurs à proximité
          enchérissent. On classe les offres par prix, proximité et fiabilité —
          vous finalisez en un geste.
        </p>
        <div className="hero__actions">
          <Link href="/requests/new" className="btn btn--primary">
            Poster une demande
          </Link>
          <a href="#requests" className="btn btn--ghost">
            Voir les demandes
          </a>
        </div>
      </section>

      <section className="container" id="requests" aria-labelledby="req-head">
        <div className="section-head">
          <h2 id="req-head">Demandes ouvertes</h2>
          <span className="muted">{requests.length} en cours</span>
        </div>
        {requests.length === 0 ? (
          <div className="empty">
            Aucune demande pour le moment.{" "}
            <Link href="/requests/new">Postez la première →</Link>
          </div>
        ) : (
          <div className="grid">
            {requests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
