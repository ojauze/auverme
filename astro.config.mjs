import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import config from "./src/config/config.json";

// Fonts loaded via CSS @import in main.css (avoids corporate SSL proxy blocking
// the Google Fonts metadata API at build time).

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  redirects: {
    '/blog': '/',
    '/authors': '/',
    '/blog/comprendre-les-troubles-dys': '/',
    '/blog/haut-potentiel-et-echec-scolaire': '/',
    '/blog/credit-impot-orthopedagogie': '/',
  },

  output: "static",

  image: { service: { entrypoint: "astro/assets/services/sharp" } },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    sitemap({
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
    }),
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
