# Wamia Parts — marketplace de bidding inversé pour pièces auto

v0.1 — première version issue des idées de **#darragi-ideas**.

> L'acheteur décrit une pièce → les vendeurs à proximité enchérissent → les
> offres sont classées par **prix / proximité / note vendeur** → l'acheteur
> finalise dans l'app.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- Aucune dépendance UI externe — CSS maison avec design tokens
- **Store en mémoire** pour la v1 (pas encore de base de données)

## Démarrer

```bash
npm install
npm run dev
# http://localhost:3000
```

Build de production :

```bash
npm run build && npm start
```

## Structure (par propriétaire)

Voir `docs/team/OWNERSHIP.md` et `.github/CODEOWNERS`. Chaque agent ECC possède sa partie : architecture, sécurité, perf, e2e, pricing, data, frontend, backend, fiabilité, docs.

## Modèle de classement

```
score = 0.45·prix + 0.30·proximité + 0.25·note
```

Chaque critère normalisé sur l'ensemble des offres d'une demande.

## Roadmap

- [ ] Bidding window (fenêtre de bid adaptative — issue de #darragi-ideas)
- [ ] Targeting top-N + équité vendeur (Gini < 0.6)
- [ ] Pricing intelligence (suggesteur de prix + analytics) — différenciateur
- [ ] Auth + rôles + Postgres
- [ ] Notifications push vendeurs

---

Données 100 % de démonstration. Aucune transaction réelle.
