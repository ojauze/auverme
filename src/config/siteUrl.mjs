import config from "./config.json" with { type: "json" };

/**
 * Source unique de l'URL publique du site.
 *
 * La production est déployée sur GitHub Pages, à l'adresse déclarée dans
 * config.json. Une préversion peut être déployée en parallèle sur Cloudflare
 * Pages, qui définit automatiquement CF_PAGES=1 et CF_PAGES_URL pendant ses
 * builds — c'est ce qui permet de les distinguer sans variable à maintenir.
 *
 * Sur la préversion, TOUTES les URLs absolues (canonical, og:url, JSON-LD,
 * sitemap) doivent pointer vers la préversion elle-même, jamais vers la
 * production. Un `noindex` servi avec une canonique qui désigne la production
 * est un signal contradictoire que Google peut résoudre en appliquant le
 * noindex à l'URL canonique — c'est-à-dire en déréférençant le vrai site.
 */
export const IS_PREVIEW = process.env.CF_PAGES === "1";

/** URL racine, sans slash final. */
export const SITE_URL = (
  IS_PREVIEW && process.env.CF_PAGES_URL
    ? process.env.CF_PAGES_URL
    : config.site.base_url
).replace(/\/$/, "");

export default SITE_URL;
