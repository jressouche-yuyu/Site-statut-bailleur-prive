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
    /** Titre SEO (balise <title>, 50–60 car. avec le mot-clé). Si absent, `title`. */
    metaTitle: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /**
     * FAQ structurée (3 Q/R recommandé). Rendue en bas d'article ET injectée en
     * JSON-LD FAQPage — levier GEO majeur pour les contenus YMYL/juridiques.
     */
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    /** Sources officielles citées (Légifrance, service-public.fr…) : E-E-A-T + citabilité. */
    sources: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
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
