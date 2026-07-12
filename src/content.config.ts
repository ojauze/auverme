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

// Testimonials collection schema
const temoignagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/temoignages" }),
  schema: z.object({
    quote:       z.string(),
    attribution: z.string(),
    color:       z.enum(["primary", "secondary", "dark"]),
    type:        z.enum(["famille", "pro"]),
    order:       z.number().default(99),
    draft:       z.boolean().default(false),
  }),
});

// Partenariats collection schema
const partenariatsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/partenariats" }),
  schema: z.object({
    title:    z.string(),
    eyebrow:  z.string().optional(),
    order:    z.number().default(99),
    image:    z.string().optional(),
    imageAlt: z.string().optional(),
    quote:    z.string().optional(),
    points: z.array(z.object({
      icon:  z.string(),
      color: z.string(),
      label: z.string(),
    })).default(() => []),
    logos: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })).default(() => []),
    draft: z.boolean().default(false),
  }),
});

// Instagram manual posts collection schema
const instagramCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/instagram" }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    link: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
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
    sections: z
      .array(
        z.object({
          title: z.string(),
          image: z.string(),
          text: z.string(),
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
      content: z.string().optional(),
      description: z.string().optional(),
      modalities: z.array(z.string()).default(() => []),
      chips: z.array(z.string()).default(() => []),
      image: z.string().optional(),
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
        bulletpoints: z.array(z.object({ text: z.string() })),
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
    image:       z.string().optional(),
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
  instagram: instagramCollection,
  temoignages: temoignagesCollection,
  partenariats: partenariatsCollection,
  about: aboutCollection,
  events: eventsCollection,
  contact: contactCollection,

  // sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,
};
