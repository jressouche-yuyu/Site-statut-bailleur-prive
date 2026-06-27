import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { guides } from '../data/guides';
import { photo } from '../lib/photos';

/**
 * Sitemap XML sur-mesure (remplace @astrojs/sitemap) :
 *  - URLs avec slash final (cohérence canonical, zéro redirection au crawl) ;
 *  - <lastmod> réel par page (dates des contenus) ;
 *  - <image:image> pour les pages qui ont une vraie photo (découverte Images).
 * Les pages en noindex (mentions légales, confidentialité, 404) sont exclues.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

interface Entry {
  loc: string;
  lastmod?: Date;
  img?: { url: string; title: string };
}

export async function GET(context: APIContext) {
  const origin = (context.site ?? new URL(SITE.url)).origin;
  const abs = (p: string) => origin + p;

  const posts = await getCollection('actualites', (p) => !p.data.draft);

  const articleEntries: Entry[] = posts.map((p) => {
    const ph = photo(`post:${p.id}`);
    return {
      loc: abs(`/actualites/${p.id}/`),
      lastmod: p.data.updatedAt ?? p.data.publishedAt,
      img: ph ? { url: abs(ph.src), title: p.data.title } : undefined,
    };
  });

  const guideEntries: Entry[] = guides.map((g) => {
    const ph = photo(`guide:${g.slug}`);
    return {
      loc: abs(`/guides/${g.slug}/`),
      lastmod: new Date(g.lastUpdated),
      img: ph ? { url: abs(ph.src), title: g.title } : undefined,
    };
  });

  // Fraîcheur des pages d'agrégation, dérivée des contenus.
  const ms = (d: Date) => d.getTime();
  const artDates = posts.map((p) => ms(p.data.updatedAt ?? p.data.publishedAt));
  const guideDates = guides.map((g) => ms(new Date(g.lastUpdated)));
  const maxAll = new Date(Math.max(...artDates, ...guideDates));
  const maxArt = new Date(Math.max(...artDates));
  const maxGuide = new Date(Math.max(...guideDates));
  const home = photo('home:hero');

  const staticEntries: Entry[] = [
    { loc: abs('/'), lastmod: maxAll, img: home ? { url: abs(home.src), title: SITE.name } : undefined },
    { loc: abs('/dispositif-jeanbrun/') },
    { loc: abs('/eligibilite/') },
    { loc: abs('/simulateur/') },
    { loc: abs('/faq/') },
    { loc: abs('/glossaire/') },
    { loc: abs('/a-propos/') },
    { loc: abs('/contact/') },
    { loc: abs('/guides/'), lastmod: maxGuide },
    { loc: abs('/actualites/'), lastmod: maxArt },
  ];

  const all = [...staticEntries, ...guideEntries, ...articleEntries];

  const urls = all
    .map((e) => {
      const lastmod = e.lastmod ? `\n    <lastmod>${isoDate(e.lastmod)}</lastmod>` : '';
      const img = e.img
        ? `\n    <image:image>\n      <image:loc>${esc(e.img.url)}</image:loc>\n      <image:title>${esc(e.img.title)}</image:title>\n    </image:image>`
        : '';
      return `  <url>\n    <loc>${esc(e.loc)}</loc>${lastmod}${img}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
