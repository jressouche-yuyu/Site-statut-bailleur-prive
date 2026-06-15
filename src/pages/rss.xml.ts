import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { guides } from '../data/guides';

/** Flux RSS agrégeant actualités et guides. */
export async function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.url);

  const posts = await getCollection('actualites', (p) => !p.data.draft);
  const newsItems = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    link: `/actualites/${p.id}`,
    pubDate: p.data.publishedAt,
  }));

  const guideItems = guides.map((g) => ({
    title: g.title,
    description: g.description,
    link: `/guides/${g.slug}`,
    pubDate: new Date(g.lastUpdated),
  }));

  const items = [...newsItems, ...guideItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site,
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}
