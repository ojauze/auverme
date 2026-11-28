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
 * Les deux sont détectés. L'adresse du déploiement Workers connu est inscrite
 * ci-dessous ; PREVIEW_SITE_URL reste prioritaire si on veut la surcharger.
 */
export const IS_PREVIEW =
  process.env.WORKERS_CI === "1" || process.env.CF_PAGES === "1";

const stripSlash = (url) => url.replace(/\/$/, "");

/**
 * Adresse du Worker de préversion (projet Cloudflare « auverme-preview »).
 *
 * Workers Builds n'expose aucune variable contenant l'URL du déploiement, à
 * la différence de CF_PAGES_URL côté Pages. On la fige donc ici plutôt que
 * d'imposer une variable à saisir dans le tableau de bord.
 *
 * Une valeur devenue fausse resterait sans danger : elle désignerait une
 * autre préversion, jamais la production. Mettre "" pour revenir au mode
 * sans aucune URL absolue.
 */
const KNOWN_PREVIEW_URL = "https://auverme-preview.auverme.workers.dev";

const previewUrl = stripSlash(
  process.env.PREVIEW_SITE_URL ||
    process.env.CF_PAGES_URL ||
    KNOWN_PREVIEW_URL ||
    "",
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

/**
 * Dépôt GitHub où BugDrop dépose les remarques laissées sur la préversion.
 *
 * Doit être un dépôt PRIVÉ et distinct du dépôt du site : les remarques y
 * arrivent sous forme d'issues, et ojauze/auverme est public — les retours
 * d'Anne sur sa propre pratique n'ont pas à l'être. L'application GitHub de
 * BugDrop demande un accès en écriture sur le contenu du dépôt où elle est
 * installée, donc la cantonner à ce dépôt la tient à l'écart du code du site.
 *
 * Chaîne vide = widget désactivé.
 */
export const PREVIEW_FEEDBACK_REPO = "ojauze/auverme-feedback";
