import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import sharp from "sharp";
import config from "./src/config/config.json";

// Fonts loaded via CSS @import in main.css (avoids corporate SSL proxy blocking
// the Google Fonts metadata API at build time).

// Keystatic admin UI (/keystatic) requires hybrid output + node adapter.
// In CI (GitHub Actions sets CI=true), we skip it entirely so the GitHub Pages
// deploy remains a fully static build.
const isCI = process.env.CI === "true";

const keystatic = !isCI ? (await import("@keystatic/astro")).default : null;
const node = !isCI ? (await import("@astrojs/node")).default : null;

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  // Astro 6: output is always "static". Individual routes added by Keystatic
  // opt out of prerendering (prerender = false). The node adapter handles those
  // SSR routes during local builds; in CI Keystatic is skipped so the output
  // is purely static and needs no adapter (GitHub Pages compatible).
  output: "static",
  ...(node ? { adapter: node({ mode: "standalone" }) } : {}),

  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    sitemap(),
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
    ...(keystatic ? [keystatic()] : []),
  ],
  markdown: {
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
