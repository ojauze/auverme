# Auverme

Site statique grand public généré avec [Astro](https://astro.build/).

## Prérequis

| Outil  | Version minimale |
|--------|-----------------|
| Node.js | 18+            |
| npm    | 9+              |
| Git    | 2.x             |

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

## Déploiement

Le site est déployé automatiquement via **GitHub Pages** à chaque push sur la branche `main`.

## Ajouter du contenu

Les articles et pages se trouvent dans le dossier `src/content/`. Pour créer un nouvel article, ajoutez un fichier Markdown dans `src/content/posts/` :

```md
---
title: "Mon article"
date: 2026-05-25
---

Contenu de l'article...
```

## Licence

[MIT](LICENSE)
