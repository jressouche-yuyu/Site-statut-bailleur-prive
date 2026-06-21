/**
 * Helper de liens « base-path aware ».
 *
 * Sur GitHub Pages (projet), le site est servi sous un sous-chemin
 * (ex. /Barre-de-son-PC/). Tous les liens internes et chemins d'assets doivent
 * donc être préfixés par `import.meta.env.BASE_URL`, sinon ils renvoient des 404.
 * En local ou sur un hébergeur à la racine, BASE_URL vaut "/" et `url()` est neutre.
 */
const BASE = import.meta.env.BASE_URL; // ex. "/" ou "/Barre-de-son-PC/"

/**
 * Ajoute un slash final aux chemins de PAGE (évite la redirection 301
 * `/x` → `/x/` servie par GitHub Pages), sans toucher aux fichiers (extension),
 * ancres ou query. Ex. `/simulateur` → `/simulateur/`, `/favicon.svg` inchangé.
 */
function ensureTrailingSlash(p: string): string {
  const m = p.match(/^([^?#]*)([?#].*)?$/);
  let pathname = m ? m[1] : p;
  const suffix = (m && m[2]) || '';
  if (pathname && !pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(pathname)) {
    pathname += '/';
  }
  return pathname + suffix;
}

export function url(path = '/'): string {
  // Liens externes / ancres / mailto : inchangés.
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const p = ensureTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  return `${base}${p}`;
}

/**
 * Réécrit les liens/ressources racine d'un fragment HTML « brut » (contenu
 * injecté via set:html) : préfixe le base-path et ajoute le slash final aux
 * liens de page. Délègue à `url()` (qui laisse les fichiers/ancres intacts).
 */
export function withBase(html: string): string {
  return html.replace(
    /(href|src)="(\/(?!\/)[^"]*)"/g,
    (_m, attr, p) => `${attr}="${url(p)}"`,
  );
}
