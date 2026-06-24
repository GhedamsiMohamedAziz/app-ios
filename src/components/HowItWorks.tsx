// Owned by: react-reviewer — 3-step "how it works" section on the home.

const STEPS = [
  {
    n: 1,
    title: "Décrivez la pièce",
    body:
      "Marque, modèle, année, et un mot sur l'état. Plus c'est précis, mieux les vendeurs ciblent.",
  },
  {
    n: 2,
    title: "Les vendeurs enchérissent",
    body:
      "Les vendeurs à proximité reçoivent une notif et placent leur offre dans la fenêtre (5 min à 24 h selon l'urgence).",
  },
  {
    n: 3,
    title: "Vous prenez le meilleur deal",
    body:
      "On classe par prix, proximité et note vendeur. Vous validez en un geste.",
  },
];

export function HowItWorks() {
  return (
    <section className="container" aria-labelledby="how-head">
      <div className="section-head">
        <h2 id="how-head">Comment ça marche</h2>
        <span className="muted">3 étapes — 5 minutes à 24 heures</span>
      </div>
      <ol className="steps" role="list">
        {STEPS.map((s) => (
          <li key={s.n} className="step">
            <span className="step__num" aria-hidden>
              {s.n}.
            </span>
            <h3 className="step__title">{s.title}</h3>
            <p className="step__body">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
