# Auverme

Site statique grand public généré avec [Hugo](https://gohugo.io/).

## Prérequis

| Outil | Version minimale |
|-------|-----------------|
| Hugo  | 0.120+          |
| Git   | 2.x             |

## Lancer le site en local

```bash
git clone https://github.com/ojauze/auverme.git
cd auverme
hugo server -D
```

Le site est accessible sur http://localhost:1313.

## Construire le site

```bash
hugo build
```

Les fichiers statiques sont générés dans le dossier `public/`.

## Déploiement

Le site est déployé automatiquement via **GitHub Pages** à chaque push sur la branche `main`.

## Ajouter du contenu

Les articles et pages se trouvent dans le dossier `content/`. Pour créer un nouvel article :

```bash
hugo new posts/mon-article.md
```

Éditez ensuite le fichier créé en Markdown.

## Licence

[MIT](LICENSE)
