import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Type pair: Instrument Serif for display moments (hero, large numbers),
// Inter for everything else. Tabular nums enabled site-wide on Inter so
// prices and countdowns line up.
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Wamia Parts — La bonne pièce, au meilleur deal",
  description:
    "Bidding inversé pour pièces de rechange : décrivez la pièce, les vendeurs à proximité enchérissent, le meilleur deal remonte.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <header className="topbar">
          <div className="container topbar__inner">
            <Link href="/" className="brand" aria-label="Wamia, accueil">
              <span className="brand__mark" aria-hidden>
                W
              </span>
              <span className="brand__name">
                Wamia<span className="brand__name-soft"> Parts</span>
              </span>
            </Link>
            <nav aria-label="Navigation principale">
              <Link href="/requests/new" className="btn btn--primary">
                <span aria-hidden>＋</span> Nouvelle demande
              </Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site">
          <div className="container site__inner">
            <div>
              <span className="brand__mark" aria-hidden>
                W
              </span>{" "}
              <strong>Wamia Parts</strong>{" "}
              <span className="muted">— v0.1 · démo</span>
            </div>
            <div className="muted">
              Marketplace de bidding inversé pour pièces auto. Données de
              démonstration.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
