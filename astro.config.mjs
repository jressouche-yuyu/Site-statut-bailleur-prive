// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/consts';

// Permet de surcharger l'URL et le sous-chemin au build (ex. GitHub Pages).
// - En production sur le domaine final : valeurs par défaut (SITE.url, racine).
// - Sur GitHub Pages : SITE_URL=https://<user>.github.io et BASE_PATH=/<repo>.
const site = process.env.SITE_URL || SITE.url;
const base = process.env.BASE_PATH || '/';

/**
 * Ajoute un slash final aux chemins de PAGE (évite la redirection 301
 * `/x` → `/x/` côté GitHub Pages), sans toucher aux fichiers (extension),
 * ancres ou query. Ex. `/simulateur` → `/simulateur/`, `/x.jpg` inchangé.
 */
function ensureTrailingSlash(p) {
  const m = p.match(/^([^?#]*)([?#].*)?$/);
  let pathname = m[1];
  const suffix = m[2] || '';
  if (pathname && !pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(pathname)) {
    pathname += '/';
  }
  return pathname + suffix;
}

/**
 * Pour le contenu Markdown : préfixe le base-path (déploiement en sous-chemin)
 * ET ajoute le slash final aux liens internes de page (anti-chaîne de redirection).
 */
function rehypeInternalLinks() {
  const prefix = base.replace(/\/$/, '');
  return (/** @type {any} */ tree) => {
    const visit = (/** @type {any} */ node) => {
      if (node.type === 'element' && (node.tagName === 'a' || node.tagName === 'img')) {
        const attr = node.tagName === 'a' ? 'href' : 'src';
        let v = node.properties && node.properties[attr];
        if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//')) {
          if (node.tagName === 'a') v = ensureTrailingSlash(v); // pages uniquement
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
  trailingSlash: 'always',
  // Sitemap généré sur-mesure par src/pages/sitemap.xml.ts (lastmod + images).
  integrations: [],
  markdown: {
    rehypePlugins: [rehypeInternalLinks, rehypeWrapTables],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
