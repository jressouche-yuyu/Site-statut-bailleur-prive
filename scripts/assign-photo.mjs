/**
 * Attribue une image illustrative à un article — de façon 100 % autonome.
 *
 * Deux étages :
 *   1. Pexels (best-effort) : si PEXELS_API_KEY est défini ET api.pexels.com
 *      joignable, télécharge une photo fraîche dans public/images/blog/<slug>.jpg.
 *   2. Bibliothèque locale (repli garanti, hors-ligne) : sinon, choisit la photo
 *      existante la plus pertinente via un mapping thématique (mots-clés FR),
 *      avec anti-répétition. → Le repli SVG ne survient plus en nominal.
 *
 * L'attribution se fait en écrivant l'entrée `post:<slug>` dans photos.json
 * (le gabarit d'article lit `photo('post:'+id)` en priorité).
 *
 * Usage :
 *   node scripts/assign-photo.mjs "<slug>" "<thème FR>" ["<requête EN Pexels>"]
 *   ex. node scripts/assign-photo.mjs "ma-news" "vote loi budget assemblée"
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const JSON_PATH = path.join(ROOT, 'src/data/photos.json');
const KEY = process.env.PEXELS_API_KEY;

// Bibliothèque locale : identifiant → chemin (le crédit est relu depuis
// photos.json pour rester synchronisé, pas de duplication de crédit ici).
const LIB = {
  'comment-fonctionne': '/images/guides/comment-fonctionne.jpg',
  'conditions': '/images/guides/conditions-eligibilite.jpg',
  'neuf-ou-ancien': '/images/guides/neuf-ou-ancien.jpg',
  'vs-pinel': '/images/guides/jeanbrun-vs-pinel-lmnp.jpg',
  'budget': '/images/blog/budget-2026.jpg',
  'jeanbrun-portrait': '/images/blog/vincent-jeanbrun.jpg',
  'hero': '/images/home/hero.jpg',
  'plafonds': '/images/guides/plafonds-loyer-ressources.jpg',
  'rentabilite': '/images/guides/rentabilite.jpg',
  'revente': '/images/guides/revente-plus-value.jpg',
  'ancien-dpe': '/images/guides/ancien-travaux-dpe.jpg',
  'risques': '/images/guides/risques-limites.jpg',
  'acteurs': '/images/guides/acteurs.jpg',
  'ou-investir': '/images/guides/ou-investir.jpg',
};

// Catégories thématiques (ordre = priorité en cas d'égalité de score).
const CATEGORIES = [
  { id: 'loi-vote', kw: ['loi', 'vote', 'adopte', 'assemblee', 'senat', 'amendement', 'budget', 'finances', 'parlement', 'decret', 'promulgation', 'navette', 'lecture'], primary: 'budget', alternates: ['ou-investir', 'comment-fonctionne'], alt: 'Façade du Palais Bourbon, illustrant l’examen parlementaire du dispositif Jeanbrun.', q: 'french parliament palais bourbon building' },
  { id: 'fiscalite-finance', kw: ['fiscal', 'impot', 'fiscalite', 'rendement', 'rentabilite', 'amortissement', 'calcul', 'finance', 'defiscalisation', 'revenus', 'fonciers'], primary: 'rentabilite', alternates: ['vs-pinel'], alt: 'Calculatrice et documents financiers, illustrant la fiscalité du dispositif Jeanbrun.', q: 'financial calculator coins investment desk' },
  { id: 'comparatif', kw: ['comparatif', 'versus', 'pinel', 'lmnp', 'difference', 'comparaison', 'meuble'], primary: 'vs-pinel', alternates: ['rentabilite'], alt: 'Documents financiers comparant des dispositifs d’investissement locatif.', q: 'calculator financial documents comparison desk' },
  { id: 'renovation-ancien-dpe', kw: ['ancien', 'renovation', 'travaux', 'dpe', 'passoire', 'energetique', 'rehabilitation', 'brique', 'renover'], primary: 'ancien-dpe', alternates: ['neuf-ou-ancien'], alt: 'Façade d’immeuble ancien en rénovation, illustrant le volet ancien du dispositif Jeanbrun.', q: 'old building renovation works facade' },
  { id: 'neuf', kw: ['neuf', 'construction', 'vefa', 'programme', 'livraison', 'chantier'], primary: 'neuf-ou-ancien', alternates: ['comment-fonctionne'], alt: 'Chantier de construction de logements neufs.', q: 'new apartment construction site' },
  { id: 'loyers-plafonds', kw: ['loyer', 'plafond', 'ressources', 'zonage', 'encadrement', 'locataire', 'plafonnement'], primary: 'plafonds', alternates: ['ou-investir'], alt: 'Toits parisiens, illustrant les plafonds de loyer du dispositif Jeanbrun.', q: 'paris rooftops housing apartments' },
  { id: 'eligibilite', kw: ['eligibilite', 'eligible', 'condition', 'critere', 'engagement', 'duree', 'acces'], primary: 'conditions', alternates: ['comment-fonctionne'], alt: 'Clés de logement, illustrant les conditions d’éligibilité au dispositif Jeanbrun.', q: 'apartment keys door' },
  { id: 'revente-plus-value', kw: ['revente', 'vente', 'plus-value', 'sortie', 'ceder', 'cession', 'vendu'], primary: 'revente', alternates: ['rentabilite'], alt: 'Panneau « vendu » devant un logement, illustrant la revente.', q: 'house sold sign real estate' },
  { id: 'risques-juridique', kw: ['risque', 'limite', 'litige', 'contentieux', 'juridique', 'garantie', 'assurance', 'piege'], primary: 'risques', alternates: ['acteurs'], alt: 'Document examiné à la loupe, illustrant les risques et garanties.', q: 'insurance document magnifier risk' },
  { id: 'acteurs-promoteurs', kw: ['promoteur', 'acteur', 'conseil', 'courtier', 'notaire', 'partenaire', 'contrat', 'signature', 'accord'], primary: 'acteurs', alternates: ['comment-fonctionne'], alt: 'Poignée de main sur un contrat immobilier, illustrant les acteurs du dispositif.', q: 'real estate handshake contract signing' },
  { id: 'territoires', kw: ['investir', 'ville', 'departement', 'region', 'territoire', 'zone', 'marche', 'lyon', 'metropole', 'agglomeration'], primary: 'ou-investir', alternates: ['plafonds'], alt: 'Vue aérienne d’une ville française, illustrant les territoires d’investissement.', q: 'aerial view french city districts' },
  { id: 'personnalite', kw: ['ministre', 'portrait', 'personnalite', 'biographie', 'nomination', 'nomme'], primary: 'jeanbrun-portrait', alternates: ['budget'], alt: 'Vue aérienne de Paris, illustrant le contexte du dispositif Jeanbrun.', q: 'aerial view paris architecture' },
];
const DEFAULT = { id: 'generique', primary: 'comment-fonctionne', alternates: ['hero', 'neuf-ou-ancien'], alt: 'Façade d’immeuble moderne, illustrant le dispositif Jeanbrun.', q: 'modern apartment building facade' };

const noAccent = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function resolveLocal(themeFr) {
  const t = noAccent(themeFr || '');
  let best = DEFAULT, bestScore = 0;
  for (const c of CATEGORIES) {
    const score = c.kw.reduce((n, k) => (t.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) { best = c; bestScore = score; }
  }
  return best;
}

async function loadJson() {
  try { return JSON.parse(await readFile(JSON_PATH, 'utf8')); }
  catch { console.warn('⚠️  photos.json illisible, réinitialisation.'); return {}; }
}
const saveJson = (photos) => writeFile(JSON_PATH, JSON.stringify(photos, null, 2) + '\n');

/** Crédit d'une image locale, relu depuis une entrée existante de photos.json. */
function creditForSrc(photos, src) {
  for (const v of Object.values(photos)) if (v && v.src === src) return v.credit;
  return 'Photo : Pexels';
}

/** Les `src` des N dernières entrées post: (ordre d'insertion = proxy de récence). */
function recentlyUsed(photos, n = 4) {
  const srcs = Object.entries(photos).filter(([k]) => k.startsWith('post:')).map(([, v]) => v.src);
  return new Set(srcs.slice(-n));
}

async function tryPexels(slug, queryEn, altFr, photos) {
  if (!KEY) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(queryEn)}&orientation=landscape&size=large&per_page=1`;
    const res = await fetch(url, { headers: { Authorization: KEY }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const photo = (await res.json()).photos?.[0];
    if (!photo) throw new Error('aucun résultat');
    const rel = `/images/blog/${slug}.jpg`;
    const dl = await fetch(photo.src.landscape || photo.src.large || photo.src.original, { signal: ctrl.signal });
    if (!dl.ok) throw new Error(`download ${dl.status}`);
    await mkdir(path.join(ROOT, 'public/images/blog'), { recursive: true });
    await writeFile(path.join(ROOT, 'public', rel), Buffer.from(await dl.arrayBuffer()));
    photos[`post:${slug}`] = { src: rel, credit: `Photo : ${photo.photographer} / Pexels`, alt: altFr };
    console.log(`✓ Pexels : ${rel} (${photo.photographer})`);
    return true;
  } catch (e) {
    console.log(`ℹ️  Pexels indisponible (${e.message}) : repli bibliothèque locale.`);
    return false;
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const [slug, themeFr, queryArg] = process.argv.slice(2);
  if (!slug || !themeFr) {
    console.error('Usage : node scripts/assign-photo.mjs "<slug>" "<thème FR>" ["<requête EN>"]');
    process.exit(1);
  }

  const photos = await loadJson();
  const cat = resolveLocal(themeFr);

  // Étage 1 — Pexels (best-effort)
  if (await tryPexels(slug, queryArg || cat.q, cat.alt, photos)) {
    await saveJson(photos);
    return;
  }

  // Étage 2 — bibliothèque locale (garanti)
  const used = recentlyUsed(photos, 4);
  let id = cat.primary;
  if (used.has(LIB[id])) {
    const free = (cat.alternates || []).find((a) => !used.has(LIB[a]));
    if (free) id = free;
  }
  const src = LIB[id];
  photos[`post:${slug}`] = { src, credit: creditForSrc(photos, src), alt: cat.alt };
  await saveJson(photos);
  console.log(`✓ Bibliothèque locale : ${src} (catégorie ${cat.id})`);
}

main().catch((e) => { console.error('Erreur:', e); process.exit(1); });
