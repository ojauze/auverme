import { collection, config, fields, singleton } from "@keystatic/core";

/**
 * Keystatic CMS — Auver'me Orthopédagogie
 *
 * storage: "local" → les fichiers sont écrits directement sur le disque.
 * L'interface admin est disponible sur /keystatic (npm run dev uniquement).
 * L'accès est protégé par HTTP Basic Auth via src/middleware.ts.
 */
export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Auver'me Orthopédagogie" },
  },

  // ── Singletons (pages à contenu unique) ───────────────────────────────────

  singletons: {
    // ── Page d'accueil ──────────────────────────────────────────────────────
    homepage: singleton({
      label: "Page d'accueil",
      path: "src/content/homepage/-index",
      format: { frontmatter: "yaml" },
      schema: {
        banner: fields.object(
          {
            title: fields.text({ label: "Titre principal" }),
            content: fields.text({ label: "Accroche", multiline: true }),
            image: fields.text({
              label: "Image (chemin relatif, ex: /images/logo.png)",
            }),
            button: fields.object(
              {
                enable: fields.checkbox({ label: "Actif", defaultValue: true }),
                label: fields.text({ label: "Texte du bouton" }),
                link: fields.text({ label: "Lien" }),
              },
              { label: "Bouton" },
            ),
          },
          { label: "Bannière" },
        ),
        features: fields.array(
          fields.object({
            title: fields.text({ label: "Titre" }),
            image: fields.text({ label: "Image (chemin)" }),
            content: fields.text({ label: "Description", multiline: true }),
            bulletpoints: fields.array(fields.text({ label: "Point" }), {
              label: "Points clés",
              itemLabel: (props) => (props as any).value || "Point",
            }),
            button: fields.object(
              {
                enable: fields.checkbox({
                  label: "Actif",
                  defaultValue: false,
                }),
                label: fields.text({ label: "Texte du bouton" }),
                link: fields.text({ label: "Lien" }),
              },
              { label: "Bouton" },
            ),
          }),
          {
            label: "Sections de présentation",
            itemLabel: (props) =>
              (props as any).fields?.title?.value || "Section",
          },
        ),
      },
    }),

    // ── À propos ────────────────────────────────────────────────────────────
    about: singleton({
      label: "À propos",
      path: "src/content/about/-index",
      format: { frontmatter: "yaml" },
      schema: {
        title: fields.text({ label: "Titre de la page" }),
        meta_title: fields.text({ label: "Meta titre (SEO)" }),
        description: fields.text({ label: "Meta description (SEO)", multiline: true }),
        image: fields.text({ label: "Image (chemin)" }),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
        intro: fields.object(
          {
            p1: fields.text({ label: "Paragraphe 1", multiline: true }),
            p2: fields.text({ label: "Paragraphe 2", multiline: true }),
          },
          { label: "Introduction" },
        ),
        valeurs: fields.array(
          fields.object({
            icon: fields.text({ label: "Icône (emoji)" }),
            title: fields.text({ label: "Titre" }),
            text: fields.text({ label: "Texte", multiline: true }),
          }),
          {
            label: "Valeurs",
            itemLabel: (props) =>
              (props as any).fields?.title?.value || "Valeur",
          },
        ),
        formations: fields.array(
          fields.object({
            year: fields.text({ label: "Année" }),
            label: fields.text({ label: "Description" }),
          }),
          {
            label: "Formation & parcours",
            itemLabel: (props) =>
              (props as any).fields?.year?.value || "Étape",
          },
        ),
        engagements: fields.array(fields.text({ label: "Engagement" }), {
          label: "Engagements professionnels",
          itemLabel: (props) => (props as any).value || "Engagement",
        }),
      },
    }),

    // ── Services ────────────────────────────────────────────────────────────
    services: singleton({
      label: "Services",
      path: "src/content/services/-index",
      format: { frontmatter: "yaml" },
      schema: {
        title: fields.text({ label: "Titre de la page" }),
        meta_title: fields.text({ label: "Meta titre (SEO)" }),
        description: fields.text({ label: "Meta description (SEO)", multiline: true }),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
        intro: fields.text({ label: "Accroche de la page" }),
        services: fields.array(
          fields.object({
            icon: fields.text({ label: "Icône (emoji)" }),
            title: fields.text({ label: "Nom du service" }),
            description: fields.text({ label: "Description", multiline: true }),
            duree: fields.text({ label: "Durée" }),
            pour: fields.text({ label: "Pour qui" }),
            resultat: fields.text({ label: "Résultat attendu" }),
          }),
          {
            label: "Services",
            itemLabel: (props) =>
              (props as any).fields?.title?.value || "Service",
          },
        ),
      },
    }),
  },

  // ── Collections ────────────────────────────────────────────────────────────

  collections: {
    // ── Articles de blog ────────────────────────────────────────────────────
    blog: collection({
      label: "Articles de blog",
      slugField: "title",
      path: "src/content/blog/*",
      format: { contentField: "content", frontmatter: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        meta_title: fields.text({ label: "Meta titre (SEO)" }),
        description: fields.text({ label: "Description (SEO)", multiline: true }),
        date: fields.date({ label: "Date de publication" }),
        image: fields.text({ label: "Image de couverture (chemin)" }),
        categories: fields.array(fields.text({ label: "Catégorie" }), {
          label: "Catégories",
          itemLabel: (props) => (props as any).value || "Catégorie",
        }),
        author: fields.text({ label: "Auteure", defaultValue: "Auver'me" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => (props as any).value || "Tag",
        }),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
        content: fields.markdoc({ label: "Contenu de l'article" }),
      },
    }),

    // ── Événements ──────────────────────────────────────────────────────────
    events: collection({
      label: "Événements",
      slugField: "title",
      path: "src/content/events/*",
      format: { contentField: "content", frontmatter: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        date: fields.date({ label: "Date de début" }),
        end_date: fields.date({ label: "Date de fin (optionnel)" }),
        time: fields.text({ label: "Horaires (ex: 14h00 – 16h30)" }),
        location: fields.text({ label: "Lieu" }),
        category: fields.select({
          label: "Catégorie",
          options: [
            { label: "Atelier", value: "Atelier" },
            { label: "Formation", value: "Formation" },
            { label: "Conférence", value: "Conférence" },
            { label: "Permanence", value: "Permanence" },
          ],
          defaultValue: "Atelier",
        }),
        description: fields.text({
          label: "Description courte",
          multiline: true,
        }),
        link: fields.text({ label: "Lien inscription / info (optionnel)" }),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
        content: fields.markdoc({ label: "Description détaillée (optionnel)" }),
      },
    }),
  },
});
