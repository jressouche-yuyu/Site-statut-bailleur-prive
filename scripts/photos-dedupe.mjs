/**
 * Répare la diversité des illustrations.
 *
 * Deux défauts se cumulaient :
 *   1. `assign-photo.mjs` demandait `per_page=1` à Pexels : deux articles de la
 *      même catégorie thématique recevaient forcément la MÊME photo, écrite sous
 *      deux noms de fichier différents. C'est corrigé à la source, mais le
 *      corpus garde les doublons déjà produits.
 *   2. Une déduplication antérieure a fait pointer plusieurs entrées du
 *      manifeste vers un seul fichier : le binaire dupliqué a disparu, mais
 *      sept articles se sont retrouvés à partager deux visuels — visible dès la
 *      page d'accueil.
 *
 * Ce script détecte les deux cas et réattribue une photo inédite à tous les
 * contenus en doublon sauf un (le plus ancien, qui garde la sienne).
 *
 * Il a besoin de PEXELS_API_KEY. Sans clé, il se contente de diagnostiquer.
 *
 * Usage :
 *   node scripts/photos-dedupe.mjs            # diagnostic seul
 *   node scripts/photos-dedupe.mjs --apply    # réattribue (nécessite la clé)
 */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const JSON_PATH = path.join(ROOT, 'src/data/photos.json');
const CONTENT_DIR = path.join(ROOT, 'src/content/actualites');
const APPLY = process.argv.includes('--apply');

const lire = async (p) => JSON.parse(await readFile(p, 'utf8'));

/** md5 d'un fichier de public/, ou null s'il est absent. */
async function empreinte(src) {
  try {
    return createHash('md5').update(await readFile(path.join(ROOT, 'public', src))).digest('hex');
  } catch {
    return null;
  }
}

/** Thème FR d'un article, reconstruit depuis son titre et ses tags. */
async function themeDe(slug) {
  try {
    const brut = await readFile(path.join(CONTENT_DIR, `${slug}.md`), 'utf8');
    const titre = (brut.match(/^title:\s*"?(.+?)"?\s*$/m) || [])[1] || '';
    const tags = (brut.match(/^tags:\s*\[(.*?)\]/m) || [])[1] || '';
    return `${titre} ${tags.replace(/["']/g, ' ')}`.trim();
  } catch {
    return slug.replace(/-/g, ' ');
  }
}

const photos = await lire(JSON_PATH);

// ── Regroupement : par chemin d'image ET par empreinte binaire ──────────────
const groupes = new Map();
for (const [cle, val] of Object.entries(photos)) {
  if (!val || !val.src) continue;
  const md5 = await empreinte(val.src);
  // L'empreinte prime : elle attrape aussi deux fichiers de noms différents
  // portant le même binaire, ce qu'une comparaison de chemins laisse passer.
  const identite = md5 || val.src;
  if (!groupes.has(identite)) groupes.set(identite, []);
  groupes.get(identite).push(cle);
}

const doublons = [...groupes.entries()].filter(([, cles]) => cles.length > 1);

/**
 * Choisit le contenu qui garde l'image : celui dont le slug correspond au nom
 * du fichier. Sans ce tri, on pouvait désigner « gardien » un article qui ne
 * fait qu'emprunter le fichier d'un autre ; réillustrer le véritable
 * propriétaire réécrivait alors le fichier partagé, et les deux restaient
 * jumeaux. C'est exactement ce qui a laissé un doublon au premier passage.
 */
function gardien(cles) {
  const proprietaire = cles.find((c) => {
    const v = photos[c];
    if (!v || !v.src) return false;
    const base = v.src.split('/').pop().replace(/\.[^.]+$/, '');
    return c.replace(/^(post|guide|home):/, '') === base;
  });
  return proprietaire || cles[0];
}

if (!doublons.length) {
  console.log('✓ Aucun visuel partagé : chaque contenu a son illustration.');
  process.exit(0);
}

console.log(`${doublons.length} visuel(s) partagé(s) par plusieurs contenus :\n`);
const aRefaire = [];
for (const [, cles] of doublons) {
  const garde = gardien(cles);
  console.log(`  ${photos[garde].src}`);
  console.log(`     conservé par : ${garde}`);
  for (const c of cles.filter((x) => x !== garde)) {
    console.log(`     à réattribuer : ${c}`);
    if (c.startsWith('post:')) aRefaire.push(c.slice('post:'.length));
    else console.log('        (contenu hors « post: » — réattribution manuelle)');
  }
}

console.log(`\n${aRefaire.length} article(s) à réillustrer.`);

if (!APPLY) {
  console.log('Diagnostic seul. Relancer avec --apply (et PEXELS_API_KEY) pour réattribuer.');
  process.exit(0);
}
if (!process.env.PEXELS_API_KEY) {
  console.error('✗ PEXELS_API_KEY absente : impossible de récupérer des photos inédites.');
  process.exit(1);
}

let ok = 0;
for (const slug of aRefaire) {
  const theme = await themeDe(slug);
  try {
    // Séquentiel et non parallèle : assign-photo.mjs relit et réécrit le
    // manifeste à chaque appel, et doit voir les attributions précédentes pour
    // ne pas resservir la même photo.
    execFileSync('node', [path.join(ROOT, 'scripts/assign-photo.mjs'), slug, theme], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    ok++;
  } catch (e) {
    console.error(`✗ ${slug} : ${e.message}`);
  }
}
console.log(`\n${ok}/${aRefaire.length} article(s) réillustré(s).`);

// Contrôle final : le manifeste ne doit plus porter de doublon.
const apres = await lire(JSON_PATH);
const vus = new Map();
for (const [cle, val] of Object.entries(apres)) {
  if (!val || !val.src) continue;
  const md5 = (await empreinte(val.src)) || val.src;
  vus.set(md5, [...(vus.get(md5) || []), cle]);
}
const restants = [...vus.values()].filter((v) => v.length > 1);
if (restants.length) {
  console.warn(`\n⚠️  ${restants.length} doublon(s) subsistent :`);
  for (const v of restants) console.warn('   ', v.join(', '));
} else {
  console.log('\n✓ Chaque contenu a désormais son illustration propre.');
}
