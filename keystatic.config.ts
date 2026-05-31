import { collection, config, fields, singleton } from "@keystatic/core";

/**
 * Keystatic CMS configuration — Auverme Orthopédagogie
 *
 * storage: 'local' → files are saved directly to disk, no auth needed.
 * The admin UI is available at /keystatic when running `npm run dev`.
 *
 * Image paths are managed as plain text (fields.text) to stay compatible
 * with the /images/* paths already stored in frontmatter.
 * Upgrade to fields.image once images are migrated to a managed upload folder.
 */
export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Auverme Orthopédagogie" },
  },

  // ── Singleton pages ────────────────────────────────────────────────────
  singletons: {
    // ── Page d'accueil ──────────────────────────────────────────────────
    homepage: singleton({
      label: "Page d'accueil",
      path: "src/content/homepage/-index",
      format: { frontmatter: "yaml" },
      schema: {
        banner: fields.object(
          {
            title: fields.text({ label: "Titre" }),
            content: fields.text({ label: "Accroche", multiline: true }),
            image: fields.text({ label: "Image (chemin, ex: /images/logo.png)" }),
            button: fields.object(
              {
                enable: fields.checkbox({ label: "Actif", defaultValue: true }),
                label: fields.text({ label: "Texte du bouton" }),
                link: fields.text({ label: "Lien" }),
              },
              { label: "Bouton" }
            ),
          },
          { label: "Bannière" }
        ),
        features: fields.array(
          fields.object({
            title: fields.text({ label: "Titre" }),
            image: fields.text({ label: "Image (chemin)" }),
            content: fields.text({ label: "Description", multiline: true }),
            bulletpoints: fields.array(
              fields.text({ label: "Point" }),
              {
                label: "Points clés",
                itemLabel: (props) => (props as any).value || "Point",
              }
            ),
            button: fields.object(
              {
                enable: fields.checkbox({ label: "Actif", defaultValue: false }),
                label: fields.text({ label: "Texte du bouton" }),
                link: fields.text({ label: "Lien" }),
              },
              { label: "Bouton" }
            ),
          }),
          {
            label: "Sections",
            itemLabel: (props) =>
              (props as any).fields?.title?.value || "Section",
          }
        ),
      },
    }),

    // ── À propos ────────────────────────────────────────────────────────
    about: singleton({
      label: "À propos",
      path: "src/content/about/-index",
      format: { frontmatter: "yaml" },
      schema: {
        title: fields.text({ label: "Titre" }),
        meta_title: fields.text({ label: "Meta titre" }),
        description: fields.text({ label: "Description", multiline: true }),
        image: fields.text({ label: "Image (chemin)" }),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
        intro: fields.object(
          {
            p1: fields.text({ label: "Paragraphe 1", multiline: true }),
            p2: fields.text({ label: "Paragraphe 2", multiline: true }),
          },
          { label: "Introduction" }
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
          }
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
          }
        ),
        engagements: fields.array(
          fields.text({ label: "Engagement" }),
          {
            label: "Engagements professionnels",
            itemLabel: (props) => (props as any).value || "Engagement",
          }
        ),
      },
    }),

    // ── Services ────────────────────────────────────────────────────────
    services: singleton({
      label: "Services",
      path: "src/content/services/-index",
      format: { frontmatter: "yaml" },
      schema: {
        title: fields.text({ label: "Titre" }),
        meta_title: fields.text({ label: "Meta titre" }),
        description: fields.text({ label: "Description", multiline: true }),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
        intro: fields.text({ label: "Accroche de la page" }),
        services: fields.array(
          fields.object({
            icon: fields.text({ label: "Icône (emoji)" }),
            title: fields.text({ label: "Titre" }),
            description: fields.text({ label: "Description", multiline: true }),
            duree: fields.text({ label: "Durée" }),
            pour: fields.text({ label: "Pour qui" }),
            resultat: fields.text({ label: "Résultat" }),
          }),
          {
            label: "Services",
            itemLabel: (props) =>
              (props as any).fields?.title?.value || "Service",
          }
        ),
      },
    }),
  },

  // ── Collections ────────────────────────────────────────────────────────
  collections: {
    // ── Blog ─────────────────────────────────────────────────────────────
    blog: collection({
      label: "Articles",
      slugField: "title",
      path: "src/content/blog/*",
      format: { frontmatter: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        meta_title: fields.text({ label: "Meta titre" }),
        description: fields.text({ label: "Description", multiline: true }),
        date: fields.date({ label: "Date de publication" }),
        image: fields.text({ label: "Image (chemin)" }),
        categories: fields.array(
          fields.text({ label: "Catégorie" }),
          {
            label: "Catégories",
            itemLabel: (props) => (props as any).value || "Catégorie",
          }
        ),
        author: fields.text({ label: "Auteure", defaultValue: "Auverme" }),
        tags: fields.array(
          fields.text({ label: "Tag" }),
          {
            label: "Tags",
            itemLabel: (props) => (props as any).value || "Tag",
          }
        ),
        draft: fields.checkbox({ label: "Brouillon", defaultValue: false }),
      },
    }),
  },
});
