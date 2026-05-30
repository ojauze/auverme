import { defineCollection, z } from "astro:content";

const actualites = defineCollection({
  type: "content",
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    description: z.string(),
    author:      z.string().default("Auverme"),
    tags:        z.array(z.string()).default([]),
    image:       z.string().optional(),
    draft:       z.boolean().default(false),
  }),
});

export const collections = { actualites };
