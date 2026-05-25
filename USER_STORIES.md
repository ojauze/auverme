# User Stories — auverme

## README

**US-01 — Comprendre le projet**
> En tant que visiteur du dépôt, je veux lire une description claire du site en quelques lignes, afin de comprendre immédiatement à quoi il sert et à qui il s'adresse.

**US-02 — Voir le site en local**
> En tant que développeur contributeur, je veux des instructions pas-à-pas pour installer les dépendances et lancer le serveur de développement, afin de pouvoir prévisualiser le site sur ma machine sans chercher ailleurs.

**US-03 — Construire le site**
> En tant que développeur, je veux une commande claire pour générer les fichiers statiques (`npm run build`), afin de savoir comment produire la version finale prête à déployer.

**US-04 — Déployer le site**
> En tant que mainteneur, je veux savoir où et comment le site est hébergé (GitHub Pages), afin de comprendre le pipeline de déploiement et le reproduire si besoin.

**US-05 — Contribuer au contenu**
> En tant que contributeur non-technique, je veux savoir comment ajouter ou modifier du contenu (articles, pages), afin de pouvoir participer sans connaître Astro en profondeur.

**US-06 — Connaître les prérequis**
> En tant que nouveau contributeur, je veux voir les versions requises (Node.js, npm), afin d'éviter les erreurs d'environnement dès le départ.

**US-07 — Comprendre la licence**
> En tant qu'utilisateur externe, je veux connaître la licence du projet, afin de savoir si je peux réutiliser le code ou le contenu.

---

## Menu de navigation

**US-08 — Navigation principale (desktop)**
> En tant que visiteur sur desktop, je veux une barre de navigation horizontale en haut de page avec les liens **Accueil**, **Actualités**, **Articles**, **À propos** et **Contact**, afin de pouvoir accéder à n'importe quelle section en un clic.

**US-09 — Menu hamburger (mobile)**
> En tant que visiteur sur mobile, je veux une icône hamburger en haut à droite qui déroule le menu en plein écran, afin de naviguer facilement sans que le menu prenne de la place sur un petit écran.

**US-10 — Lien actif visible**
> En tant que visiteur, je veux que la section en cours de consultation soit mise en évidence dans le menu (surligné, couleur ou underline), afin de savoir à tout moment où je me trouve sur le site.

**US-11 — Logo / nom cliquable**
> En tant que visiteur, je veux cliquer sur le logo ou le nom du site dans la barre de navigation pour revenir à l'accueil, afin d'avoir un point de retour rapide depuis n'importe quelle page.

**US-12 — Fermeture automatique du menu mobile**
> En tant que visiteur mobile, je veux que le menu se ferme automatiquement après avoir cliqué sur un lien, afin de ne pas avoir à le fermer manuellement à chaque navigation.

---

## Structure des routes

| Section    | Route         |
|------------|---------------|
| Accueil    | `/`           |
| Actualités | `/actualites` |
| Articles   | `/articles`   |
| À propos   | `/a-propos`   |
| Contact    | `/contact`    |
