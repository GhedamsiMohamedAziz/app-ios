// Owned by: react-reviewer — server-rendered filter chips on the home.
// URL-param based (?urgency=critical), no client JS needed. Stays inside the
// App Router idioms.

import Link from "next/link";
import type { Urgency } from "@/lib/types";
import { urgencyMeta } from "@/lib/urgency";

interface UrgencyFilterProps {
  active: Urgency | null;
  counts: Record<Urgency | "all", number>;
}

const PICKABLE: Urgency[] = ["critical", "urgent", "standard"];

export function UrgencyFilter({ active, counts }: UrgencyFilterProps) {
  return (
    <nav className="urgency-filter" aria-label="Filtrer par urgence">
      <Link
        href="/"
        className={`urgency-filter__chip${active === null ? " is-active" : ""}`}
        aria-current={active === null ? "page" : undefined}
      >
        Toutes
        <span className="urgency-filter__count">{counts.all}</span>
      </Link>
      {PICKABLE.map((u) => {
        const meta = urgencyMeta(u);
        const isActive = active === u;
        return (
          <Link
            key={u}
            href={`/?urgency=${u}`}
            className={`urgency-filter__chip${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span aria-hidden>{meta.emoji}</span> {meta.label}
            <span className="urgency-filter__count">{counts[u]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
