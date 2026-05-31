import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import keystatic from "@keystatic/astro";
import sharp from "sharp";
import config from "./src/config/config.json";

// Fonts loaded via CSS @import in main.css (avoids corporate SSL proxy blocking
// the Google Fonts metadata API at build time).

// CI=true is set automatically by GitHub Actions.
// Keystatic and the node adapter are skipped in CI so the GitHub Pages build
// stays 100% static with no server component.
const isCI = Boolean(process.env.CI);

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",

  output: "static",

  // Node adapter active only in local dev — gives Keystatic's injected SSR
  // routes a runtime to execute against. Not needed (or desired) in CI.
  adapter: isCI ? undefined : node({ mode: "middleware" }),

  image: { service: sharp() },
  vite: {
    plugins: [tailwindcss()],
    // Fix: Astro 6 doesn't create a RunnableDevEnvironment for "ssr" by default
    // when output:"static". Adding dev:{} here makes it runnable so Keystatic's
    // injected /api/keystatic/* routes are handled instead of returning 404.
    environments: isCI ? {} : { ssr: { dev: {} } },
  },
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
    ...(isCI ? [] : [keystatic()]),
  ],
  markdown: {
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
