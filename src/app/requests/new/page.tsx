import Link from "next/link";
import { NewRequestForm } from "@/components/NewRequestForm";

export const metadata = { title: "Nouvelle demande — Wamia Parts" };

export default function NewRequestPage() {
  return (
    <section className="container detail">
      <Link href="/" className="detail__back">
        ← Retour aux demandes
      </Link>
      <div className="detail__head">
        <h1 className="detail__title">Nouvelle demande de pièce</h1>
        <p className="muted">
          Postez votre besoin — les vendeurs à proximité recevront une
          notification et pourront enchérir.
        </p>
      </div>
      <div style={{ maxWidth: 560 }}>
        <NewRequestForm />
      </div>
    </section>
  );
}
