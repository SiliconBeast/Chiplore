import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One MDX file per lesson: src/content/lessons/<course>/<lesson>.mdx
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    course: z.string(),
    unit: z.number(),
    order: z.number(),
    minutes: z.number(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
    art: z.string().default('chip'),
    skill: z.string(),
    summary: z.string(),
    next: z.object({ title: z.string(), href: z.string() }).optional(),
    authors: z.array(z.string()).default([]),
  }),
});

export const collections = { lessons };
