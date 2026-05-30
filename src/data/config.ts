// ================================================
// Auverme Orthopédagogie — Configuration du site
// ================================================
// Source unique de vérité pour toutes les données
// du site. Importer depuis n'importe quelle page
// ou composant Astro.

export const siteConfig = {
  name: "Auverme Orthopédagogie",
  shortName: "Auverme",
  url: "https://auverme-orthopedagogie.fr",
  description:
    "Orthopédagogue à Royat et en visio. Accompagnement personnalisé pour enfants, adolescents et adultes en difficulté d'apprentissage.",
  locale: "fr-FR",
  author: "Auverme",

  contact: {
    email: "contact.auverme@gmail.com",
    phone: "",          // à renseigner
    city: "Royat",
    region: "Auvergne-Rhône-Alpes",
    country: "France",
    visio: true,
    /**
     * Clé Web3Forms — obtenir en 30 secondes sur https://web3forms.com
     * Entrez votre adresse Gmail → cliquez "Create Access Key" → copiez la clé ici.
     * Les messages du formulaire de contact seront envoyés directement dans votre Gmail.
     */
    web3formsKey: "f35544e2-ad3a-4eb4-b483-1b1ba9fec173",
  },

  seo: {
    ogImage: "/images/og-default.jpg",
    twitterHandle: "",
  },

  /** Délai de réponse affiché en page Contact */
  responseDelay: "48h",

  /** Taux de déduction fiscale (CESU / crédit d'impôt) */
  taxDeduction: "50%",
} as const;

// ------------------------------------------------
// Navigation principale
// ------------------------------------------------
export const navLinks = [
  { label: "Accueil",     href: "/" },
  { label: "À propos",    href: "/a-propos" },
  { label: "Services",    href: "/articles" },
  { label: "Actualités",  href: "/actualites" },
  { label: "Contact",     href: "/contact" },
] as const;

export type NavLink = (typeof navLinks)[number];
