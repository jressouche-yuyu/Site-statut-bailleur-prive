import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection « actualités » : articles d'actualité en Markdown.
 * Ajoute un fichier .md dans src/content/actualites/ avec le frontmatter
 * ci-dessous et il apparaît automatiquement dans /actualites, le sitemap et le
 * flux RSS. Les dates récentes sont un signal de fraîcheur SEO/GEO.
 */
const actualites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualites' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Temps de lecture estimé en minutes. */
    readingMinutes: z.number().default(4),
    /** Mettre à true pour ne pas publier. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { actualites };
