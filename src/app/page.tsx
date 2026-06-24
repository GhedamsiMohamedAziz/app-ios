import Link from "next/link";
import { listRequests } from "@/lib/store";
import { URGENCY_LEVELS } from "@/lib/urgency";
import type { Urgency } from "@/lib/types";
import { RequestCard } from "@/components/RequestCard";
import { HowItWorks } from "@/components/HowItWorks";
import { UrgencyFilter } from "@/components/UrgencyFilter";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: { urgency?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const all = listRequests();
  const rawUrgency = searchParams.urgency;
  const active: Urgency | null = URGENCY_LEVELS.includes(rawUrgency as Urgency)
    ? (rawUrgency as Urgency)
    : null;
  const visible = active ? all.filter((r) => r.urgency === active) : all;

  const counts = URGENCY_LEVELS.reduce(
    (acc, u) => {
      acc[u] = all.filter((r) => r.urgency === u).length;
      return acc;
    },
    { all: all.length } as Record<Urgency | "all", number>,
  );

  return (
    <>
      <section className="container hero" aria-labelledby="hero-title">
        <span className="hero__eyebrow">Bidding inversé · pièces auto</span>
        <h1 id="hero-title" className="hero__title">
          La bonne pièce, <em>au meilleur deal.</em>
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
            Voir les demandes ouvertes
          </a>
        </div>
      </section>

      <HowItWorks />

      <section className="container" id="requests" aria-labelledby="req-head">
        <div className="section-head">
          <h2 id="req-head">Demandes ouvertes</h2>
          <span className="muted tabular">
            {visible.length} sur {all.length}
          </span>
        </div>

        <UrgencyFilter active={active} counts={counts} />

        {visible.length === 0 ? (
          <div className="empty">
            <span className="empty__icon" aria-hidden>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            <h3 className="empty__title">Pas de demande pour ce filtre</h3>
            <p>
              {active
                ? "Aucune demande active en " + active + ". Essayez un autre niveau d'urgence."
                : "Aucune demande pour le moment. Postez la première."}
            </p>
            <Link href="/requests/new" className="btn btn--primary empty__cta">
              Poster une demande
            </Link>
          </div>
        ) : (
          <div className="grid">
            {visible.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
