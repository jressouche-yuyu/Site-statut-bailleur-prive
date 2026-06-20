/**
 * Contrôle qualité d'un article avant publication (checklist YMYL/GEO du brief).
 * N'analyse pas le fond (exactitude des faits) — uniquement la structure.
 *
 * Usage : node scripts/news-check.mjs src/content/actualites/<slug>.md
 * Sortie : liste de ✓ / ✗ ; code 1 s'il reste au moins un ✗.
 */
import { readFile } from 'node:fs/promises';
import { config } from './news.config.mjs';

const file = process.argv[2];
if (!file) { console.error('Usage : node scripts/news-check.mjs <fichier.md>'); process.exit(1); }

const raw = await readFile(file, 'utf8');
const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!m) { console.error('✗ Frontmatter introuvable.'); process.exit(1); }
const [, fm, body] = m;

const checks = [];
const add = (ok, label) => checks.push({ ok, label });

// Frontmatter
const field = (name) => {
  const r = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return r ? r[1].trim().replace(/^["']|["']$/g, '') : null;
};
const metaTitle = field('metaTitle');
const description = field('description');
add(metaTitle && metaTitle.length >= 45 && metaTitle.length <= 65, `metaTitle 45–65 car. (${metaTitle ? metaTitle.length : 'absent'})`);
add(description && description.length >= 130 && description.length <= 160, `description 130–160 car. (${description ? description.length : 'absent'})`);
const faqCount = (fm.match(/^\s*-\s*question:/gm) || []).length;
add(faqCount >= 3, `FAQ ≥ 3 questions (${faqCount})`);
const srcCount = (fm.match(/^\s*-\s*label:/gm) || []).length;
add(srcCount >= 1, `≥ 1 source officielle (${srcCount})`);
add(/^updatedAt:/m.test(fm), 'updatedAt présent (bloc « À jour au »)');

// Corps
add(!/^#\s/m.test(body), 'Pas de H1 dans le corps (le H1 vient du title)');
add(!/^#{2,3}\s*(introduction|conclusion)\s*$/im.test(body), 'Pas de titre « Introduction »/« Conclusion »');
const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((x) => x[1]);
const uniqueLinks = [...new Set(links)];
add(uniqueLinks.length >= config.internalLinks.min && uniqueLinks.length <= config.internalLinks.max,
  `${config.internalLinks.min}–${config.internalLinks.max} liens internes uniques (${uniqueLinks.length})`);
add(uniqueLinks.includes(config.strategicPage.url), `lien pilier ${config.strategicPage.url}`);
const tableRows = (body.match(/^\|.*\|\s*$/gm) || []).length;
add(/^\|?\s*[-:]+\s*\|/m.test(body) && tableRows >= 6, `tableau ≥ 5 lignes (${Math.max(0, tableRows - 1)} + en-tête)`);
add(/^\s*[-*]\s+/m.test(body), 'liste à puces présente');
add(/^>\s+/m.test(body), 'bloc Focus (citation) présent');

let failed = 0;
for (const c of checks) { console.log(`${c.ok ? '✓' : '✗'} ${c.label}`); if (!c.ok) failed++; }
console.log(failed ? `\n${failed} point(s) à corriger.` : '\nTous les contrôles passent.');
process.exit(failed ? 1 : 0);
