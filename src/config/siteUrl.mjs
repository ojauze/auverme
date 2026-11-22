import config from "./config.json";

/**
 * Source unique de l'URL publique du site.
 *
 * La production est déployée sur GitHub Pages, à l'adresse déclarée dans
 * config.json. Une préversion peut être déployée en parallèle sur Cloudflare,
 * qui se décline en deux produits aux variables différentes :
 *
 *   - Workers Builds (le flux proposé aujourd'hui) injecte WORKERS_CI=1 et ne
 *     fournit AUCUNE variable contenant l'URL du déploiement.
 *   - Pages, plus ancien, injecte CF_PAGES=1 et CF_PAGES_URL.
 *
 * Les deux sont détectés. En l'absence d'URL connue, on peut la fournir à la
 * main via PREVIEW_SITE_URL (variable de build définie dans le tableau de bord).
 */
export const IS_PREVIEW =
  process.env.WORKERS_CI === "1" || process.env.CF_PAGES === "1";

const stripSlash = (url) => url.replace(/\/$/, "");

const previewUrl = stripSlash(
  process.env.PREVIEW_SITE_URL || process.env.CF_PAGES_URL || "",
);

/**
 * URL racine sans slash final, ou chaîne vide si l'on construit une préversion
 * dont l'adresse est inconnue.
 *
 * Ce cas ne doit JAMAIS retomber sur l'URL de production. Servir un `noindex`
 * avec une canonique qui désigne la production est un signal contradictoire que
 * Google peut résoudre en appliquant le noindex à l'URL canonique — c'est-à-dire
 * en déréférençant le vrai site. Mieux vaut n'émettre aucune URL absolue.
 */
export const SITE_URL = IS_PREVIEW
  ? previewUrl
  : stripSlash(config.site.base_url);

/**
 * Faux uniquement en préversion sans URL connue. Quand c'est faux, les pages
 * n'émettent ni canonical, ni og:url, ni données structurées.
 */
export const HAS_ABSOLUTE_URLS = SITE_URL !== "";

/** Valeur toujours exploitable, pour les besoins internes d'Astro. */
export const BUILD_SITE_URL = SITE_URL || stripSlash(config.site.base_url);

export default SITE_URL;
