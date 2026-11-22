# Auverme

Site professionnel d'une **orthopédagogue**, conçu pour accompagner les parents, enfants et enseignants
face aux difficultés d'apprentissage.
Généré avec [Astro](https://astro.build/).

## Prérequis

| Outil   | Version minimale |
|---------|------------------|
| Node.js | **22.12+** (exigé par Astro 6) |
| npm     | 10+              |
| Git     | 2.x              |

## Lancer le site en local

```bash
git clone https://github.com/ojauze/auverme.git
cd auverme
npm install
npm run dev
```

Le site est accessible sur http://localhost:4321.

## Construire le site

```bash
npm run build
```

Les fichiers statiques sont générés dans le dossier `dist/`.

---

## Déploiement

Le site a **deux cibles de déploiement**, alimentées par le même dépôt.

| | Préversion | Production |
|---|---|---|
| Branche | `preview` | `main` |
| Hébergeur | Cloudflare **Workers** | GitHub Pages |
| Adresse | `auverme-preview.auverme.workers.dev` | `auverme-orthopedagogie.fr` |
| Indexation | `noindex` sur tout | indexable |
| Délai | ~75 s | ~2 min |

```
  vos modifications
         │
         ▼
   ┌──────────┐   push    ┌──────────────────────────────┐
   │ preview  │ ────────► │ Cloudflare Workers           │
   └──────────┘           │ relecture · test · noindex   │
         │                └──────────────────────────────┘
         │ merge une fois validé
         ▼
   ┌──────────┐   push    ┌──────────────────────────────┐
   │   main   │ ────────► │ GitHub Pages — PRODUCTION    │
   └──────────┘           └──────────────────────────────┘
         ▲
         └── le bot Instagram commite ici chaque jour à 7h UTC
```

### Les trois gestes

**Travailler et faire relire** — tout push sur `preview` relance un build Cloudflare :

```bash
git switch preview && git pull
# ... modifications, commits ...
git push origin preview
```

**Publier en production** — seul geste irréversible :

```bash
git switch main && git pull && git merge preview && git push
```

**Redescendre le contenu du bot vers la préversion** — à faire régulièrement,
sinon la préversion affiche un fil Instagram périmé :

```bash
git switch preview && git pull && git merge main && git push origin preview
```

### À savoir

- **Le flux est bidirectionnel.** Vos changements montent de `preview` vers `main`,
  le contenu du bot Instagram descend de `main` vers `preview`. Sans resynchronisation,
  `preview` dérive.
- **Tout push sur `main` publie immédiatement**, y compris ceux du bot Instagram,
  qui ne passent jamais par la préversion.
- **Ne jamais forcer `preview`** (`git push --force`) : Cloudflare déploie depuis cette
  branche. Passer par des merges.
- **Seule la branche `preview` est construite** par Cloudflare. Une branche de feature
  n'aura pas d'URL de préversion ; il faut la merger dans `preview` pour la voir en ligne.

### Comment la préversion est isolée

Une préversion indexable ferait doublon avec le vrai site et lui nuirait. La protection
est pilotée par [`src/config/siteUrl.mjs`](src/config/siteUrl.mjs), qui détecte la variable
`WORKERS_CI` que Cloudflare injecte pendant ses builds :

- `noindex,nofollow` sur toutes les pages, plus un en-tête `X-Robots-Tag` via `dist/_headers` ;
- canonicals, `og:url` et données structurées **auto-référents**, jamais vers la production ;
- sitemap non généré, et ligne `Sitemap:` retirée de `robots.txt` ;
- redirections désactivées, car leurs pages portaient une canonique vers la production.

> ⚠️ **Le point critique :** une canonique désignant la production, servie avec un `noindex`,
> peut conduire Google à appliquer ce `noindex` à l'URL canonique — donc à déréférencer le
> vrai site. Aucune URL absolue de la préversion ne doit jamais pointer vers la production.

`robots.txt` autorise volontairement le crawl sur la préversion : un `Disallow: /` empêcherait
Google de lire le `noindex`, et il pourrait indexer les URLs malgré tout.

La configuration du Worker est dans [`wrangler.jsonc`](wrangler.jsonc). Son champ `name` doit
correspondre exactement au nom du Worker dans le tableau de bord Cloudflare, sinon le build échoue.

### Workflows GitHub Actions

| Fichier | Rôle |
|---|---|
| `deploy.yml` | Déploie sur GitHub Pages à chaque push sur `main` |
| `sync-instagram.yml` | Récupère les derniers posts Instagram chaque jour à 7h UTC et les commite |
| `refresh-instagram-token.yml` | Renouvelle le token Instagram le 1er de chaque mois |

Voir [`docs/runbook-instagram.md`](docs/runbook-instagram.md) pour l'exploitation du bot.

---

## Ajouter du contenu

Le contenu vit dans `src/content/`, réparti en collections déclarées dans
[`src/content.config.ts`](src/content.config.ts) :

| Dossier | Contenu |
|---|---|
| `pages/` | Pages éditoriales, routées par `src/pages/[...regular].astro` |
| `about/`, `contact/`, `homepage/` | Contenu des pages correspondantes |
| `temoignages/`, `partenariats/`, `events/` | Collections affichées en listes |
| `instagram/` | Alimenté automatiquement par le bot — **ne pas modifier à la main** |
| `sections/` | Blocs réutilisables (appel à l'action, témoignages) |

### Créer une page métier

Les pages de `src/content/pages/` acceptent trois champs optionnels qui alimentent le
référencement. Les sous-dossiers deviennent des URLs imbriquées :
`pages/accompagnement/tdah.md` → `/accompagnement/tdah/`.

```md
---
title: "Accompagnement TDAH"
meta_title: "TDAH : accompagnement orthopédagogique à Royat"
description: "Attention, organisation, impulsivité : un travail sur les fonctions exécutives."
draft: false

service:            # → JSON-LD Service
  name: "Accompagnement orthopédagogique du TDAH"
  type: "Accompagnement des troubles de l'attention"
  audience: "Enfants, adolescents et adultes"

faq:                # → JSON-LD FAQPage, ET affiché en bas de page
  - q: "L'orthopédagogue peut-il diagnostiquer un TDAH ?"
    a: "Non. Le diagnostic est médical."

related:            # → bloc « À lire aussi »
  - label: "Accompagnement des troubles dys"
    url: "/accompagnement/troubles-dys/"
    text: "souvent associés"
---

Le corps de la page, en Markdown.
```

Deux règles à respecter :

- **`meta_title` ne doit pas dépasser ~49 caractères.** Le suffixe « | Auver'me » est ajouté
  automatiquement, et Google tronque au-delà d'une soixantaine de caractères.
- **Les liens internes prennent un slash final** (`/contact/`, pas `/contact`). Le site est servi
  en `trailingSlash: "always"` ; sans le slash, chaque lien déclenche une redirection 301.

Les questions de `faq:` sont **affichées sur la page** en plus d'être balisées : Google interdit
de baliser du contenu invisible.

## Documentation

| Fichier | Contenu |
|---|---|
| [`docs/audit-seo-2026-11-21.md`](docs/audit-seo-2026-11-21.md) | Audit SEO et plan d'action |
| [`docs/recherche-metier-orthopedagogue.md`](docs/recherche-metier-orthopedagogue.md) | Cadre du métier (France / Québec) |
| [`docs/recherche-concurrence.md`](docs/recherche-concurrence.md) | Analyse des sites concurrents |
| [`docs/runbook-instagram.md`](docs/runbook-instagram.md) | Exploitation du bot Instagram |

## Licence

MIT (déclarée dans `package.json` ; le dépôt ne contient pas de fichier `LICENSE`).
