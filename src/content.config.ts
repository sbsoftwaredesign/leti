import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.string(),
    category: z.enum([
      "application",
      "pitch",
      "cv",
      "bio",
      "assessment",
      "guide",
    ]),
    status: z.enum(["draft", "review", "final"]),
    order: z.number(),
    description: z.string(),
    locale: z.enum(["en", "es"]).default("en"),
    project: z.string().optional(),
  }),
});

export const collections = { projects };
