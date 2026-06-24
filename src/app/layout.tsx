import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wamia — Marketplace de pièces auto",
  description:
    "Bidding inversé pour pièces de rechange : décrivez la pièce, les vendeurs à proximité enchérissent, le meilleur deal remonte.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header className="topbar">
          <div className="container topbar__inner">
            <Link href="/" className="brand" aria-label="Wamia, accueil">
              <span className="brand__mark">W</span>
              <span>Wamia&nbsp;Parts</span>
            </Link>
            <nav aria-label="Navigation principale">
              <Link href="/requests/new" className="btn btn--primary">
                + Nouvelle demande
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site">
          <div className="container">
            Wamia Parts — v0.1 · marketplace de bidding inversé pour pièces
            automobiles. Données de démonstration.
          </div>
        </footer>
      </body>
    </html>
  );
}
