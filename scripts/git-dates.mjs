/**
 * Génère `src/data/git-dates.json` : pour chaque article, la date du dernier
 * commit qui l'a réellement touché.
 *
 * Pourquoi : sans `updatedAt` explicite, `dateModified` retombait sur
 * `publishedAt`. Résultat, 24 articles sur 25 déclaraient une date de
 * modification strictement égale à leur date de publication, toutes à minuit
 * UTC — un marqueur de contenu produit en série, et une information fausse
 * pour les articles réellement retouchés depuis.
 *
 * Un seul appel à git pour tout le corpus. Si git n'est pas disponible
 * (archive, tarball), le fichier est écrit vide et le site retombe
 * silencieusement sur `publishedAt` : le build ne casse jamais.
 *
 * ⚠️ En CI, `actions/checkout` doit utiliser `fetch-depth: 0`, sinon tous les
 * fichiers portent la date de l'unique commit récupéré.
 */
import { execFileSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'src/content/actualites';
const OUT = path.join(ROOT, 'src/data/git-dates.json');

/** @returns {Record<string, string>} slug → date ISO du dernier commit */
function collect() {
  let raw;
  try {
    raw = execFileSync(
      'git',
      ['log', '--pretty=format:@%cI', '--name-only', '--', DIR],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (err) {
    console.warn(`⚠️  git indisponible (${err.message}) — dates de modification non générées.`);
    return {};
  }

  /** @type {Record<string, string>} */
  const dates = {};
  let current = null;

  for (const line of raw.split('\n')) {
    if (line.startsWith('@')) {
      current = line.slice(1).trim();
      continue;
    }
    const file = line.trim();
    if (!file.endsWith('.md') || !current) continue;
    const slug = path.basename(file, '.md');
    // `git log` sort du plus récent au plus ancien : la première occurrence
    // rencontrée est donc la bonne, on ne l'écrase pas ensuite.
    if (!dates[slug]) dates[slug] = current;
  }
  return dates;
}

const dates = collect();
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(dates, null, 2) + '\n', 'utf8');
console.log(`✓ ${Object.keys(dates).length} date(s) de dernière modification → src/data/git-dates.json`);
