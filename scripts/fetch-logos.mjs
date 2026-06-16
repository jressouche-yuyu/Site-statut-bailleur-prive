/**
 * Récupère les logos officiels des acteurs du marché via une API de logos
 * d'entreprises (par nom de domaine), pour un affichage éditorial « acteurs du
 * marché ». Les fichiers sont hébergés dans public/images/logos/ et référencés
 * dans src/data/logos.json. Repli automatique sur le wordmark si un logo manque.
 *
 * Usage : node scripts/fetch-logos.mjs   (FORCE=1 pour tout retélécharger)
 *
 * Aucune clé requise. Source : API publique de logos (Clearbit/HubSpot).
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const FORCE = process.env.FORCE === '1';
const ROOT = path.resolve(process.cwd());
const JSON_PATH = path.join(ROOT, 'src/data/logos.json');

/** Marques → domaine officiel (sert à récupérer le logo). */
const BRANDS = [
  { slug: 'nexity', name: 'Nexity', domain: 'nexity.fr' },
  { slug: 'bouygues-immobilier', name: 'Bouygues Immobilier', domain: 'bouygues-immobilier.com' },
  { slug: 'cogedim', name: 'Cogedim', domain: 'cogedim.com' },
  { slug: 'vinci-immobilier', name: 'Vinci Immobilier', domain: 'vinci-immobilier.com' },
  { slug: 'icade', name: 'Icade', domain: 'icade.fr' },
  { slug: 'kaufman-broad', name: 'Kaufman & Broad', domain: 'kaufmanbroad.fr' },
  { slug: 'pichet', name: 'Pichet', domain: 'pichet.fr' },
  { slug: 'nacarat', name: 'Nacarat', domain: 'nacarat.com' },
];

async function loadJson() {
  try {
    return JSON.parse(await readFile(JSON_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function fetchLogo(domain, dest) {
  const url = `https://logo.clearbit.com/${domain}?size=160&format=png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`type ${type}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 600) throw new Error('image trop petite'); // logo placeholder/vide
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

async function main() {
  const logos = await loadJson();
  let changed = 0;

  for (const b of BRANDS) {
    const rel = `/images/logos/${b.slug}.png`;
    const abs = path.join(ROOT, 'public', rel);
    if (!FORCE && logos[b.slug] && existsSync(abs)) {
      console.log(`↳ ${b.slug} : déjà présent.`);
      continue;
    }
    try {
      const size = await fetchLogo(b.domain, abs);
      logos[b.slug] = { src: rel, name: b.name };
      changed++;
      console.log(`✓ ${b.slug} (${Math.round(size / 1024)} Ko)`);
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.warn(`⚠️  ${b.slug} : logo indisponible (${err.message}) → wordmark conservé.`);
    }
  }

  await writeFile(JSON_PATH, JSON.stringify(logos, null, 2) + '\n');
  console.log(`\nTerminé. ${changed} logo(s) récupéré(s). Manifeste : src/data/logos.json`);
}

main();
