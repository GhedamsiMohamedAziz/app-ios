import { listRequests } from "@/lib/store";
import { distanceKm } from "@/lib/geo";
import { findLocation, DEFAULT_LOCATION } from "@/lib/locations";
import { SellerCityPicker } from "@/components/SellerCityPicker";
import { SellerRequestRow } from "@/components/SellerRequestRow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mode vendeur — Wamia Parts",
  description: "Feed des requêtes ouvertes près de vous, triées par proximité.",
};

interface SellerPageProps {
  searchParams: { city?: string };
}

export default function SellerPage({ searchParams }: SellerPageProps) {
  const seller = findLocation(searchParams.city);
  const requests = listRequests().filter((r) => r.status === "open");
  const sorted = [...requests].sort(
    (a, b) =>
      distanceKm(seller, a.buyer) - distanceKm(seller, b.buyer),
  );

  return (
    <section className="container detail">
      <div className="seller-hero">
        <span className="hero__eyebrow">Mode vendeur</span>
        <h1 className="detail__title">
          Requêtes <em>près de toi</em>
        </h1>
        <p className="muted" style={{ maxWidth: "56ch", margin: "0 0 1.2rem" }}>
          Les demandes ouvertes des acheteurs, classées par proximité. Ouvre une
          carte pour voir le détail et placer ton offre dans la fenêtre.
        </p>
        <SellerCityPicker value={seller.label} />
      </div>

      <div className="section-head" style={{ marginTop: "2rem" }}>
        <h2>
          {sorted.length} requête{sorted.length > 1 ? "s" : ""} ouvertes
        </h2>
        <span className="muted">depuis {seller.label}</span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty">
          <span className="empty__icon" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2a8 8 0 0 0-8 8c0 4.5 8 12 8 12s8-7.5 8-12a8 8 0 0 0-8-8z" />
            </svg>
          </span>
          <h3 className="empty__title">Pas de requête ouverte</h3>
          <p>Reviens dans quelques minutes ou élargis ta zone.</p>
        </div>
      ) : (
        <ol className="seller-list" role="list">
          {sorted.map((r) => (
            <li key={r.id}>
              <SellerRequestRow request={r} sellerLocation={seller} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
