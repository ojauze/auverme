import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  // z.coerce.date() handles both Date objects and ISO string dates from frontmatter (Zod 4)
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  draft: z.boolean(),
};

// Post collection schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Admin"),
    // Use factory functions for mutable array defaults (Zod 4 best practice)
    categories: z.array(z.string()).default(() => ["others"]),
    tags: z.array(z.string()).default(() => ["others"]),
    draft: z.boolean().optional(),
  }),
});

// Author collection schema
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/authors" }),
  schema: z.object({
    ...commonFields,
    social: z
      .array(
        z
          .object({
            name: z.string().optional(),
            icon: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    ...commonFields,
  }),
});

// about collection schema
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean(),
    intro: z
      .object({
        p1: z.string(),
        p2: z.string(),
      })
      .optional(),
    valeurs: z
      .array(
        z.object({
          icon: z.string(),
          title: z.string(),
          text: z.string(),
        }),
      )
      .optional(),
    formations: z
      .array(
        z.object({
          year: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    engagements: z.array(z.string()).optional(),
  }),
});

// services collection schema
const servicesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/services" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean(),
    intro: z.string().optional(),
    services: z
      .array(
        z.object({
          icon: z.string(),
          title: z.string(),
          description: z.string(),
          duree: z.string(),
          pour: z.string(),
          resultat: z.string(),
        }),
      )
      .optional(),
  }),
});

// contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
  }),
});

// Homepage collection schema
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    features: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
        content: z.string(),
        bulletpoints: z.array(z.string()),
        button: z.object({
          enable: z.boolean(),
          label: z.string(),
          link: z.string(),
        }),
      }),
    ),
  }),
});

// Call to Action collection schema
const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Testimonials Section collection schema
const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        designation: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

// instagram collection — récupère les posts via l'API Instagram Graph au build
// Token requis : INSTAGRAM_ACCESS_TOKEN dans .env.local (dev) ou GitHub Secret (CI)
// Sans token → collection vide, le build ne casse pas.
const instagramCollection = defineCollection({
  loader: async () => {
    const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) {
      console.warn("[instagram] INSTAGRAM_ACCESS_TOKEN absent — collection vide.");
      return [];
    }
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type&limit=12&access_token=${token}`
      );
      if (!res.ok) {
        console.error(`[instagram] API error ${res.status} — collection vide.`);
        return [];
      }
      const { data } = (await res.json()) as {
        data: {
          id: string;
          caption?: string;
          media_url: string;
          permalink: string;
          timestamp: string;
          media_type: string;
        }[];
      };
      return data
        .filter((p) => p.media_type !== "VIDEO") // vidéos sans thumbnail fiable
        .map((p) => ({
          id:          p.id,
          title:       p.caption?.split("\n")[0]?.slice(0, 80) ?? "Post Instagram",
          date:        new Date(p.timestamp),
          image:       p.media_url,
          link:        p.permalink,
          description: p.caption ?? undefined,
          draft:       false,
        }));
    } catch (err) {
      console.error("[instagram] Erreur réseau —", err, "— collection vide.");
      return [];
    }
  },
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    image:       z.string().optional(),
    link:        z.string(),
    description: z.string().optional(),
    draft:       z.boolean().default(false),
  }),
});

// events collection schema
const eventsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "src/content/events" }),
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    end_date:    z.coerce.date().optional(),
    time:        z.string().optional(),
    location:    z.string().optional(),
    category:    z.string().optional(),
    description: z.string().optional(),
    link:        z.string().optional(),
    draft:       z.boolean().default(false),
  }),
});

// Export collections
export const collections = {
  // Pages
  homepage: homepageCollection,
  blog: blogCollection,
  authors: authorsCollection,
  pages: pagesCollection,
  about: aboutCollection,
  services: servicesCollection,
  events: eventsCollection,
  instagram: instagramCollection,
  contact: contactCollection,

  // sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,
};
