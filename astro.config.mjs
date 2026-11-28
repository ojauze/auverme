import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import config from "./src/config/config.json";
import {
  BUILD_SITE_URL,
  HAS_ABSOLUTE_URLS,
  IS_PREVIEW,
  SITE_URL,
} from "./src/config/siteUrl.mjs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Sur la préversion Cloudflare uniquement : ajoute un en-tête X-Robots-Tag en
 * complément du <meta robots> posé par Base.astro, et fait pointer le sitemap
 * de robots.txt vers la préversion plutôt que vers la production.
 *
 * robots.txt continue d'AUTORISER le crawl : un `Disallow: /` empêcherait
 * Google de lire le noindex, et il pourrait indexer les URLs malgré tout.
 */
const previewNoindex = {
  name: "preview-noindex",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      if (!IS_PREVIEW) return;
      const out = fileURLToPath(dir);

      await writeFile(
        join(out, "_headers"),
        "/*\n  X-Robots-Tag: noindex, nofollow\n",
        "utf8",
      );

      // Le sitemap n'est pas généré en préversion : la ligne Sitemap de
      // robots.txt désignerait sinon celui de la production.
      const robotsPath = join(out, "robots.txt");
      const robots = await readFile(robotsPath, "utf8");
      await writeFile(
        robotsPath,
        robots.replace(/^Sitemap: .*$\n?/m, ""),
        "utf8",
      );

      // Filet de sécurité. Les composants n'émettent plus d'URL absolue sans
      // adresse connue, mais Astro en génère une pour chaque page de
      // redirection, construite depuis `site`. Une canonique vers la
      // production servie avec un noindex est précisément ce qu'il faut
      // éviter, donc on les retire du rendu.
      if (!HAS_ABSOLUTE_URLS) {
        const entries = await readdir(out, {
          recursive: true,
          withFileTypes: true,
        });
        let stripped = 0;
        for (const entry of entries) {
          if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
          const file = join(entry.parentPath ?? entry.path, entry.name);
          const html = await readFile(file, "utf8");
          const cleaned = html.replace(
            /<link[^>]+rel="canonical"[^>]*>/gi,
            "",
          );
          if (cleaned !== html) {
            await writeFile(file, cleaned, "utf8");
            stripped += 1;
          }
        }
        if (stripped > 0) {
          logger.warn(`${stripped} canonique(s) résiduelle(s) retirée(s)`);
        }
      }

      logger.warn(
        `préversion non indexable${SITE_URL ? ` — ${SITE_URL}` : " (URL inconnue : aucune URL absolue émise)"}`,
      );
    },
  },
};

// Fonts loaded via CSS @import in main.css (avoids corporate SSL proxy blocking
// the Google Fonts metadata API at build time).

// https://astro.build/config
export default defineConfig({
  // BUILD_SITE_URL reste toujours défini, pour les besoins internes d'Astro.
  // Les URLs réellement émises dans les pages passent par SITE_URL, qui est
  // vide en préversion sans adresse connue.
  site: BUILD_SITE_URL ? BUILD_SITE_URL : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  redirects: IS_PREVIEW ? {} : {
    '/blog': '/',
    '/authors': '/',
    '/blog/comprendre-les-troubles-dys': '/',
    '/blog/haut-potentiel-et-echec-scolaire': '/',
    '/blog/credit-impot-orthopedagogie': '/',
    // Anciennes URLs explorées par Google. /services est reprise par le hub
    // /accompagnement/ qui en reprend les sujets ; /a-propos n'a jamais existé.
    '/services': '/accompagnement/',
    '/a-propos': '/about/',
  },

  output: "static",

  image: { service: { entrypoint: "astro/assets/services/sharp" } },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    previewNoindex,
    react(),
    ...(IS_PREVIEW ? [] : [sitemap({
      // Exclude redirect stubs and pages that must not be indexed. A sitemap
      // URL that redirects wastes crawl budget and sends a contradictory
      // indexing signal, so /evenements (a stub pointing at /actualites) and
      // the legacy /blog and /authors stubs are filtered out here.
      filter: (page) =>
        !page.includes('/construction') &&
        !page.includes('/mentions-legales') &&
        !page.includes('/politique-confidentialite') &&
        !page.includes('/evenements') &&
        !page.includes('/blog') &&
        !page.includes('/authors'),
    })]),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
