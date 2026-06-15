/**
 * Automatisation des photos via l'API Pexels (gratuite).
 *
 * - Pour chaque entrée ci-dessous, cherche une photo pertinente (paysage),
 *   la télécharge dans public/images/<dir>/<name>.jpg et enregistre le crédit
 *   photographe (obligatoire selon la licence Pexels) dans src/data/photos.json.
 * - Idempotent : si une entrée a déjà une photo dans photos.json, elle est
 *   conservée (pas de re-téléchargement) → builds déterministes. Forcer avec
 *   FORCE=1.
 *
 * Usage :
 *   PEXELS_API_KEY=xxxxx node scripts/fetch-photos.mjs
 *
 * La clé API se crée gratuitement sur https://www.pexels.com/api/.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const API = 'https://api.pexels.com/v1/search';
const KEY = process.env.PEXELS_API_KEY;
const FORCE = process.env.FORCE === '1';
const ROOT = path.resolve(process.cwd());
const JSON_PATH = path.join(ROOT, 'src/data/photos.json');

/**
 * Liste des visuels à récupérer. `key` est l'identifiant utilisé dans les pages
 * (guide:<slug>, post:<id>, ou un identifiant libre comme "home:hero").
 * `query` est en anglais (meilleurs résultats sur Pexels).
 */
const ENTRIES = [
  { key: 'guide:plafonds-loyer-ressources-dispositif-jeanbrun', dir: 'guides', name: 'plafonds-loyer-ressources', query: 'french city apartment rooftops housing' },
  { key: 'guide:rentabilite-dispositif-jeanbrun-exemple-chiffre', dir: 'guides', name: 'rentabilite', query: 'financial calculator coins growth investment' },
  { key: 'guide:revente-plus-value-amortissement-jeanbrun', dir: 'guides', name: 'revente-plus-value', query: 'house for sale sold sign real estate' },
  { key: 'guide:dispositif-jeanbrun-ancien-travaux-dpe', dir: 'guides', name: 'ancien-travaux-dpe', query: 'old building renovation works paris' },
  { key: 'guide:comment-fonctionne-statut-bailleur-prive', dir: 'guides', name: 'comment-fonctionne', query: 'modern apartment building facade' },
  { key: 'guide:conditions-eligibilite-dispositif-jeanbrun', dir: 'guides', name: 'conditions-eligibilite', query: 'apartment building entrance keys' },
  { key: 'guide:neuf-ou-ancien-dispositif-jeanbrun', dir: 'guides', name: 'neuf-ou-ancien', query: 'apartment renovation construction' },
  { key: 'guide:dispositif-jeanbrun-vs-pinel-lmnp', dir: 'guides', name: 'jeanbrun-vs-pinel-lmnp', query: 'calculator financial documents desk' },
  { key: 'post:statut-bailleur-prive-adopte-budget-2026', dir: 'blog', name: 'budget-2026', query: 'government parliament building france' },
  { key: 'post:qui-est-vincent-jeanbrun', dir: 'blog', name: 'vincent-jeanbrun', query: 'french city architecture building' },
  { key: 'home:hero', dir: 'home', name: 'hero', query: 'modern residential building blue sky' },
];

async function loadJson() {
  try {
    return JSON.parse(await readFile(JSON_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function searchPexels(query) {
  const url = `${API}?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=1`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} pour « ${query} »`);
  const data = await res.json();
  return data.photos?.[0];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Téléchargement échoué (${res.status}) : ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
}

async function main() {
  if (!KEY) {
    console.error('❌ PEXELS_API_KEY manquant. Crée une clé sur https://www.pexels.com/api/ et passe-la en variable d\'environnement (secret GitHub).');
    process.exit(1);
  }

  const photos = await loadJson();
  let changed = 0;

  for (const e of ENTRIES) {
    const relPath = `/images/${e.dir}/${e.name}.jpg`;
    const absPath = path.join(ROOT, 'public', relPath);

    if (!FORCE && photos[e.key] && existsSync(absPath)) {
      console.log(`↳ ${e.key} : déjà présent, conservé.`);
      continue;
    }

    try {
      const photo = await searchPexels(e.query);
      if (!photo) {
        console.warn(`⚠️  Aucun résultat Pexels pour « ${e.query} » (${e.key}).`);
        continue;
      }
      const imgUrl = photo.src.landscape || photo.src.large || photo.src.original;
      await download(imgUrl, absPath);
      photos[e.key] = {
        src: relPath,
        credit: `Photo : ${photo.photographer} / Pexels`,
        alt: (photo.alt || e.query).slice(0, 120),
      };
      changed++;
      console.log(`✓ ${e.key} → ${relPath} (${photo.photographer})`);
      // Respect du débit API (gratuit : 200 req/h).
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`✗ ${e.key} : ${err.message}`);
    }
  }

  await writeFile(JSON_PATH, JSON.stringify(photos, null, 2) + '\n');
  console.log(`\nTerminé. ${changed} photo(s) mise(s) à jour. Manifeste : src/data/photos.json`);
}

main();
