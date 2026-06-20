/**
 * Récupère UNE photo illustrative (API Pexels) pour un article donné et
 * l'enregistre dans le manifeste — même mécanisme que scripts/fetch-photos.mjs,
 * mais pour un seul article créé à la volée par la Routine.
 *
 * La photo est rattachée à la clé `post:<slug>` : le gabarit d'article l'affiche
 * automatiquement. En cas d'échec (pas de clé, pas de résultat, hôte bloqué),
 * on n'échoue PAS : l'article garde la couverture SVG générée (jamais d'image
 * manquante). Le crédit photographe (licence Pexels) est conservé.
 *
 * Usage :
 *   PEXELS_API_KEY=xxxxx node scripts/fetch-one-photo.mjs "<slug>" "<requête EN>"
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://api.pexels.com/v1/search';
const KEY = process.env.PEXELS_API_KEY;
const ROOT = path.resolve(process.cwd());
const JSON_PATH = path.join(ROOT, 'src/data/photos.json');

async function main() {
  const [slug, query] = process.argv.slice(2);
  if (!slug || !query) {
    console.error('Usage : node scripts/fetch-one-photo.mjs "<slug>" "<requête EN>"');
    process.exit(1);
  }
  if (!KEY) {
    console.log('ℹ️  PEXELS_API_KEY absent : pas de photo, couverture SVG conservée.');
    return;
  }

  let photos = {};
  try { photos = JSON.parse(await readFile(JSON_PATH, 'utf8')); } catch {}

  try {
    const url = `${API}?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=1`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) { console.log(`⚠️  Aucun résultat Pexels pour « ${query} » : couverture SVG conservée.`); return; }

    const relPath = `/images/blog/${slug}.jpg`;
    const imgUrl = photo.src.landscape || photo.src.large || photo.src.original;
    const dl = await fetch(imgUrl);
    if (!dl.ok) throw new Error(`Téléchargement ${dl.status}`);
    await mkdir(path.join(ROOT, 'public/images/blog'), { recursive: true });
    await writeFile(path.join(ROOT, 'public', relPath), Buffer.from(await dl.arrayBuffer()));

    photos[`post:${slug}`] = {
      src: relPath,
      credit: `Photo : ${photo.photographer} / Pexels`,
      alt: (photo.alt || query).slice(0, 120),
    };
    await writeFile(JSON_PATH, JSON.stringify(photos, null, 2) + '\n');
    console.log(`✓ Photo : ${relPath} (${photo.photographer})`);
  } catch (e) {
    console.log(`⚠️  Photo indisponible (${e.message}) : couverture SVG conservée.`);
  }
}

main();
