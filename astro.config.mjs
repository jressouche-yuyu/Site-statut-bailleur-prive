// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/consts';

// Permet de surcharger l'URL et le sous-chemin au build (ex. GitHub Pages).
// - En production sur le domaine final : valeurs par défaut (SITE.url, racine).
// - Sur GitHub Pages : SITE_URL=https://<user>.github.io et BASE_PATH=/<repo>.
const site = process.env.SITE_URL || SITE.url;
const base = process.env.BASE_PATH || '/';

/**
 * Préfixe le base-path aux liens/images racine du contenu Markdown.
 * Sinon, un lien [x](/simulateur) renvoie un 404 sur un déploiement en
 * sous-chemin (GitHub Pages projet).
 */
function rehypeBaseLinks() {
  const prefix = base.replace(/\/$/, '');
  return (/** @type {any} */ tree) => {
    if (!prefix) return;
    const visit = (/** @type {any} */ node) => {
      if (node.type === 'element' && (node.tagName === 'a' || node.tagName === 'img')) {
        const attr = node.tagName === 'a' ? 'href' : 'src';
        const v = node.properties && node.properties[attr];
        if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//')) {
          node.properties[attr] = prefix + v;
        }
      }
      (node.children || []).forEach(visit);
    };
    visit(tree);
  };
}

/**
 * Enrobe chaque tableau Markdown dans un conteneur `.table-wrap` afin qu'il
 * soit scrollable horizontalement sur mobile (les tableaux Markdown sortent
 * sinon en <table> nu, sans le conteneur appliqué dans les pages .astro).
 */
function rehypeWrapTables() {
  return (/** @type {any} */ tree) => {
    const visit = (/** @type {any} */ node) => {
      if (!node.children) return;
      const out = [];
      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'table') {
          // Enrobe le tableau sans re-descendre dedans (évite toute récursion).
          out.push({
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap'] },
            children: [child],
          });
        } else {
          visit(child);
          out.push(child);
        }
      }
      node.children = out;
    };
    visit(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Exclut les pages en noindex (mentions légales, confidentialité).
      filter: (page) =>
        !/\/(mentions-legales|confidentialite)\/?$/.test(page),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR' },
      },
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeBaseLinks, rehypeWrapTables],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
