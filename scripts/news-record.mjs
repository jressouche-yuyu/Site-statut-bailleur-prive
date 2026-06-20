/**
 * Enregistre un article publié dans le journal anti-doublon (news-ledger.json).
 * Appelé par la Routine juste après l'écriture du .md.
 *
 * Usage :
 *   node scripts/news-record.mjs "<slug>" "<titre>" "<url-source|->"
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const LEDGER_PATH = path.join(path.resolve(process.cwd()), 'scripts/news-ledger.json');

function parisDate() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

async function main() {
  const [slug, title, sourceUrlRaw] = process.argv.slice(2);
  if (!slug || !title) {
    console.error('Usage : node scripts/news-record.mjs "<slug>" "<titre>" "<url-source|->"');
    process.exit(1);
  }
  const sourceUrl = !sourceUrlRaw || sourceUrlRaw === '-' ? null : sourceUrlRaw;
  const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));
  ledger.published = ledger.published || [];
  if (ledger.published.some((p) => p.slug === slug)) {
    console.log(`Déjà présent dans le journal : ${slug}`);
    return;
  }
  ledger.published.push({ slug, title, sourceUrl, date: parisDate(), origin: 'auto' });
  await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
  console.log(`✓ Journal mis à jour : ${slug}`);
}

main();
