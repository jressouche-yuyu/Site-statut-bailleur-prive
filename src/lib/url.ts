/**
 * Helper de liens « base-path aware ».
 *
 * Sur GitHub Pages (projet), le site est servi sous un sous-chemin
 * (ex. /Barre-de-son-PC/). Tous les liens internes et chemins d'assets doivent
 * donc être préfixés par `import.meta.env.BASE_URL`, sinon ils renvoient des 404.
 * En local ou sur un hébergeur à la racine, BASE_URL vaut "/" et `url()` est neutre.
 */
const BASE = import.meta.env.BASE_URL; // ex. "/" ou "/Barre-de-son-PC/"

export function url(path = '/'): string {
  // Liens externes / ancres / mailto : inchangés.
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Préfixe le base-path aux liens/ressources racine d'un fragment HTML « brut »
 * (contenu défini en dur, injecté via set:html). Sans ça, un href="/glossaire"
 * renvoie un 404 sur un déploiement en sous-chemin (GitHub Pages projet).
 */
export function withBase(html: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  if (!base) return html;
  // href="/x" ou src="/x" (root-relative), pas les // (protocol-relative).
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`);
}
