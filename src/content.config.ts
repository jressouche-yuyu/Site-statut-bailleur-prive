import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection « actualités » : LE blog du site. Il accueille indifféremment :
 *  - les publications éditoriales de la rédaction (actualités, analyses, dossiers) ;
 *  - les articles partenaires (netlinking) — un simple .md avec `partner: true`,
 *    rédigé comme un article normal et contenant le lien du client (dofollow).
 *
 * Les deux types sont mélangés et présentés à l'identique. Ajoute un fichier .md
 * dans src/content/actualites/ avec le frontmatter ci-dessous : il apparaît
 * automatiquement dans /actualites, le sitemap et le flux RSS. Les dates récentes
 * sont un signal de fraîcheur SEO/GEO.
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
    /** Photo de couverture (optionnelle) : chemin sous /public ou URL. Sinon couverture SVG générée. */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverCredit: z.string().optional(),
    /** Signature affichée. Par défaut, la rédaction (voir SITE.author). */
    author: z.string().optional(),
    /**
     * Article partenaire (lien vendu / netlinking). Usage interne : ne change
     * rien à l'affichage tant que EDITORIAL.disclosePartner = false.
     */
    partner: z.boolean().default(false),
    /** Mettre à true pour ne pas publier. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { actualites };
