/**
 * Veille d'actualités automatique — « comportement humain ».
 *
 * À chaque exécution (le workflow la lance plusieurs créneaux/jour en heures de
 * bureau), le script :
 *   1. décide AVANT tout réseau s'il publie maintenant (cadence 1–3/sem, jours
 *      et heures variables, jamais la nuit, part d'aléatoire) ;
 *   2. récupère les actus via les flux RSS configurés (sources variables) ;
 *   3. écarte tout sujet déjà traité (journal anti-doublon) ;
 *   4. rédige un article unique via l'API Claude (ton neutre/pédagogique,
 *      orienté persona), avec 2–3 liens internes dont TOUJOURS la page pilier ;
 *   5. écrit le .md dans src/content/actualites/ et met à jour le journal.
 *
 * Variables d'environnement :
 *   ANTHROPIC_API_KEY  (requis pour la rédaction — sinon arrêt propre)
 *   NEWS_FORCE=1       ignore la grille de cadence (test manuel)
 *   NEWS_DRAFT=1       publie en brouillon (draft: true)
 *   NEWS_DRY_RUN=1     n'appelle ni RSS ni API : article factice (test local/build)
 *
 * Usage : ANTHROPIC_API_KEY=sk-... node scripts/publish-news.mjs
 */
import { writeFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { config } from './news.config.mjs';

const ROOT = path.resolve(process.cwd());
const CONTENT_DIR = path.join(ROOT, 'src/content/actualites');
const LEDGER_PATH = path.join(ROOT, 'scripts/news-ledger.json');
const API_URL = 'https://api.anthropic.com/v1/messages';
const SLOTS_PER_DAY = 4; // doit refléter le nombre de créneaux cron dans news.yml

const KEY = process.env.ANTHROPIC_API_KEY;
const FORCE = process.env.NEWS_FORCE === '1';
const DRAFT = process.env.NEWS_DRAFT === '1';
const DRY_RUN = process.env.NEWS_DRY_RUN === '1';

const STOPWORDS = new Set(
  ('le la les un une des de du au aux et ou à a en dans sur pour par avec sans ' +
    'que qui quoi dont où ce ces cette son sa ses leur leurs est sont être il ' +
    'elle ils elles on nous vous se sa ne pas plus moins très entre vers chez ' +
    'comme mais donc car ainsi cela tout tous toute toutes plein the of and').split(' '),
);

// ─── Utilitaires temps (Europe/Paris) ──────────────────────────────────────
function parisNow() {
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const year = +parts.year, month = +parts.month, day = +parts.day;
  let hour = +parts.hour;
  if (hour === 24) hour = 0;
  const dateStr = `${parts.year}-${parts.month}-${parts.day}`;
  const utc = new Date(Date.UTC(year, month - 1, day));
  const weekday = ((utc.getUTCDay() + 6) % 7) + 1; // 1 = lundi … 7 = dimanche
  const { isoYear, isoWeek } = isoWeekOf(year, month, day);
  return { year, month, day, hour, dateStr, weekday, isoYear, isoWeek, weekKey: `${isoYear}-W${isoWeek}` };
}

function isoWeekOf(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // jeudi de la semaine
  const isoYear = date.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const fDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDayNum + 3);
  const isoWeek = 1 + Math.round((date - firstThursday) / (7 * 24 * 3600 * 1000));
  return { isoYear, isoWeek };
}

function weekKeyOfDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  const { isoYear, isoWeek } = isoWeekOf(y, m, d);
  return `${isoYear}-W${isoWeek}`;
}

// ─── Aléatoire ──────────────────────────────────────────────────────────────
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ─── Texte / déduplication ───────────────────────────────────────────────────
function tokens(s) {
  return new Set(
    (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
}

// ─── Ledger ───────────────────────────────────────────────────────────────────
async function loadLedger() {
  try { return JSON.parse(await readFile(LEDGER_PATH, 'utf8')); }
  catch { return { published: [] }; }
}
async function saveLedger(ledger) {
  await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
}

// ─── Décision de cadence (sans réseau) ─────────────────────────────────────────
function decideToPublish(now, ledger) {
  if (FORCE) return { go: true, reason: 'NEWS_FORCE' };
  const { hour, dateStr, weekday, weekKey } = now;
  const { start, end } = config.publishHours;
  if (hour < start || hour >= end) return { go: false, reason: `hors heures (${hour}h Paris)` };

  const rngWeek = mulberry32(hashStr(weekKey));
  const span = config.maxPerWeek - config.minPerWeek + 1;
  const weekTarget = config.minPerWeek + Math.floor(rngWeek() * span);

  const thisWeek = ledger.published.filter((p) => p.origin === 'auto' && weekKeyOfDate(p.date) === weekKey);
  if (thisWeek.length >= weekTarget) return { go: false, reason: `objectif semaine atteint (${thisWeek.length}/${weekTarget})` };

  const today = thisWeek.filter((p) => p.date === dateStr).length;
  if (today >= 1 && Math.random() > config.sameDayChance) return { go: false, reason: 'déjà publié aujourd\'hui' };

  const remainingNeeded = weekTarget - thisWeek.length;
  const daysLeft = 7 - weekday + 1; // jours restants dans la semaine, aujourd'hui inclus
  const remainingSlots = Math.max(1, daysLeft * SLOTS_PER_DAY);
  let p = remainingNeeded / remainingSlots;
  p *= 0.6 + Math.random() * 0.9; // jitter → jours irréguliers
  p = Math.min(0.85, Math.max(0.05, p));
  if (Math.random() > p) return { go: false, reason: `créneau sauté (aléa humain, p=${p.toFixed(2)})` };

  return { go: true, reason: `publication (cible semaine=${weekTarget}, déjà=${thisWeek.length})` };
}

// ─── Veille RSS ────────────────────────────────────────────────────────────────
async function fetchFeed(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'BailleurPriveBot/1.0 (+veille éditoriale)', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally { clearTimeout(t); }
}

function stripTags(s) {
  return (s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function extract(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? stripTags(m[1]) : '';
}
function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/\1>/gi) || [];
  for (const b of blocks) {
    const title = extract(b, 'title');
    let link = extract(b, 'link');
    if (!link) {
      const m = b.match(/<link[^>]*href="([^"]+)"/i); // Atom
      if (m) link = m[1];
    }
    const desc = extract(b, 'description') || extract(b, 'summary') || extract(b, 'content');
    const dateStr = extract(b, 'pubDate') || extract(b, 'published') || extract(b, 'updated') || extract(b, 'dc:date');
    const date = dateStr ? new Date(dateStr) : null;
    if (title && link) items.push({ title, link, desc, date: date && !isNaN(date) ? date : null });
  }
  return items;
}

function scoreCandidate(item) {
  const text = `${item.title} ${item.desc}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let hits = 0, priority = 0;
  for (const k of config.keywords) if (text.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) hits++;
  for (const k of config.priorityKeywords) if (text.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) priority++;
  return { hits, priority, score: hits + priority * 3 };
}

async function gatherCandidates(ledger) {
  const seen = new Set(ledger.published.map((p) => p.sourceUrl).filter(Boolean));
  const ledgerTokens = ledger.published.map((p) => tokens(p.title));
  const cutoff = Date.now() - config.freshnessDays * 24 * 3600 * 1000;
  const out = [];

  for (const url of shuffle(config.feeds)) {
    let xml;
    try { xml = await fetchFeed(url); }
    catch (e) { console.warn(`⚠️  Flux ignoré (${url}) : ${e.message}`); continue; }
    for (const item of parseFeed(xml)) {
      if (seen.has(item.link)) continue;
      if (item.date && item.date.getTime() < cutoff) continue;
      const sc = scoreCandidate(item);
      if (sc.hits < 1) continue;
      const tk = tokens(item.title);
      if (ledgerTokens.some((lt) => jaccard(tk, lt) > 0.6)) continue; // sujet déjà traité
      out.push({ ...item, ...sc, source: new URL(url).hostname.replace(/^www\./, '') });
    }
  }
  return out;
}

// ─── Rédaction (API Claude) ─────────────────────────────────────────────────────
function buildPrompt(candidate, ledger) {
  const targetWords = config.wordRange.min + Math.floor(Math.random() * (config.wordRange.max - config.wordRange.min));
  const angle = pick(config.angles);
  const nbSecondary = Math.random() < 0.5 ? 1 : 2; // → 2 à 3 liens internes au total
  const secondary = shuffle(config.secondaryLinks).slice(0, nbSecondary);
  const links = [config.strategicPage, ...secondary];
  const avoidTitles = ledger.published.slice(-30).map((p) => `- ${p.title}`).join('\n');

  const linkList = links.map((l) => `- ${l.url} → ${l.label || l.topic}`).join('\n');

  const system =
    "Tu es journaliste pour un média éditorial français spécialisé dans " +
    "l'investissement locatif et la fiscalité immobilière (le statut du bailleur " +
    "privé, dit « dispositif Jeanbrun »). Tu écris un ton " + config.tone + " " +
    "Tu n'inventes jamais de chiffre ni de citation : tu t'appuies sur l'actualité " +
    "fournie et sur des faits généraux prudents. Tu n'es pas conseiller financier : " +
    "pas de recommandation personnalisée. Tu écris un français impeccable.";

  const user =
`À partir de cette actualité repérée en veille :
TITRE SOURCE : ${candidate.title}
RÉSUMÉ SOURCE : ${candidate.desc || '(pas de résumé)'}
LIEN SOURCE : ${candidate.link}
MÉDIA SOURCE : ${candidate.source}

Rédige UN article de blog original (ne recopie pas la source, décrypte-la).
Angle imposé : ${angle}.
Longueur cible : environ ${targetWords} mots.
Public visé (oriente subtilement l'article vers lui) : ${config.persona}

CONTRAINTES DE MAILLAGE INTERNE — insère naturellement ces liens en Markdown
[texte d'ancre](url), une seule fois chacun, avec une ancre descriptive :
${linkList}
La page « ${config.strategicPage.url} » est PRIORITAIRE et doit apparaître.

Cite la source en fin d'article sous la forme : « Source : ${candidate.source} ».
Évite tout sujet/titre proche de ceux-ci (déjà publiés) :
${avoidTitles}

Réponds UNIQUEMENT par un objet JSON valide, sans texte autour, au format :
{"title": "...", "description": "meta description ~155 caractères", "tags": ["..",".."], "body": "corps en Markdown avec des sous-titres ##"}`;

  return { system, user, meta: { targetWords, angle, links } };
}

async function callClaude(system, user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: config.model, max_tokens: config.maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`API Claude ${res.status} : ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text = (data.content || []).map((c) => c.text || '').join('').trim();
  const jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(jsonStr);
}

function validateArticle(art, links, ledger) {
  if (!art || typeof art.title !== 'string' || typeof art.body !== 'string' || typeof art.description !== 'string') return 'champs manquants';
  const words = art.body.split(/\s+/).filter(Boolean).length;
  if (words < config.wordRange.min * 0.6) return `trop court (${words} mots)`;
  const present = links.filter((l) => art.body.includes(`(${l.url})`));
  if (!art.body.includes(`(${config.strategicPage.url})`)) return 'lien pilier absent';
  if (present.length < 2 || present.length > 3) return `nombre de liens internes invalide (${present.length})`;
  const tk = tokens(art.title);
  if (ledger.published.some((p) => jaccard(tk, tokens(p.title)) > 0.6)) return 'titre trop proche d\'un article existant';
  return null;
}

// ─── Écriture de l'article ─────────────────────────────────────────────────────
async function uniqueSlug(base, ledger) {
  const existing = new Set(ledger.published.map((p) => p.slug));
  try { for (const f of await readdir(CONTENT_DIR)) existing.add(f.replace(/\.md$/, '')); } catch {}
  let slug = base || 'actualite';
  let i = 2;
  while (existing.has(slug)) slug = `${base}-${i++}`;
  return slug;
}

async function writeArticle(art, slug, now) {
  const words = art.body.split(/\s+/).filter(Boolean).length;
  const reading = Math.max(2, Math.round(words / 200));
  const tags = Array.isArray(art.tags) ? art.tags.slice(0, 4) : [];
  const fm = [
    '---',
    `title: ${JSON.stringify(art.title)}`,
    `description: ${JSON.stringify(art.description)}`,
    `publishedAt: ${now.dateStr}`,
    `tags: ${JSON.stringify(tags)}`,
    `readingMinutes: ${reading}`,
    `author: ${JSON.stringify(config.author)}`,
    ...(DRAFT ? ['draft: true'] : []),
    '---',
    '',
    art.body.trim(),
    '',
  ].join('\n');
  await writeFile(path.join(CONTENT_DIR, `${slug}.md`), fm);
  return { reading, words };
}

// ─── Mode test (sans réseau) ───────────────────────────────────────────────────
function fakeArticle(links) {
  const linkLines = links.map((l) => `Pour aller plus loin, voir [${l.label || l.topic}](${l.url}).`).join('\n\n');
  return {
    title: `Test veille — ${new Date().toISOString().slice(0, 16)}`,
    description: 'Article de test généré en mode DRY_RUN pour vérifier la chaîne de publication automatique.',
    tags: ['test', 'automatisation'],
    body: `## Décryptage\n\nCeci est un article factice (mode test) destiné à vérifier la mécanique de publication, le maillage interne et le build.\n\n## Ce que cela change\n\n${'Lorem ipsis dolor sit amet, '.repeat(40)}\n\n${linkLines}\n\nSource : exemple.fr`,
  };
}

// ─── Programme principal ────────────────────────────────────────────────────────
async function main() {
  const now = parisNow();
  const ledger = await loadLedger();

  const decision = decideToPublish(now, ledger);
  console.log(`🕒 ${now.dateStr} ${now.hour}h (Paris) — ${decision.go ? '➡️  ' : '⏸️  '}${decision.reason}`);
  if (!decision.go) return;

  // Délai « humain »
  if (!DRY_RUN && !FORCE) {
    const { min, max } = config.humanDelayMinutes;
    const wait = (min + Math.random() * (max - min)) * 60 * 1000;
    console.log(`⏳ Délai humain : ${Math.round(wait / 60000)} min`);
    await new Promise((r) => setTimeout(r, wait));
  }

  if (!DRY_RUN && !KEY) {
    console.log('ℹ️  ANTHROPIC_API_KEY absent : rédaction impossible, arrêt propre. (Ajoute le secret pour activer la veille.)');
    return;
  }

  let art, links, candidate;
  if (DRY_RUN) {
    candidate = { title: 'Actu de test', desc: '', link: 'https://exemple.fr/a', source: 'exemple.fr' };
    const built = buildPrompt(candidate, ledger);
    links = built.meta.links;
    art = fakeArticle(links);
  } else {
    const candidates = await gatherCandidates(ledger);
    console.log(`🔎 ${candidates.length} candidat(s) pertinent(s) et inédit(s).`);
    if (!candidates.length) { console.log('Aucune actu exploitable aujourd\'hui — on ne publie pas (normal).'); return; }
    candidates.sort((a, b) => b.score - a.score);
    candidate = pick(candidates.slice(0, Math.min(5, candidates.length))); // variabilité du choix
    console.log(`📰 Sujet retenu : « ${candidate.title} » (${candidate.source})`);

    let lastErr = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const built = buildPrompt(candidate, ledger);
      links = built.meta.links;
      try {
        art = await callClaude(built.system, built.user);
      } catch (e) { lastErr = e.message; console.warn(`Tentative ${attempt} : ${e.message}`); continue; }
      const err = validateArticle(art, links, ledger);
      if (!err) { lastErr = null; break; }
      lastErr = err; art = null;
      console.warn(`Tentative ${attempt} rejetée : ${err}`);
    }
    if (!art) { console.log(`❌ Abandon (${lastErr}). Aucune publication.`); return; }
  }

  const slug = await uniqueSlug(slugify(art.title), ledger);
  const { reading, words } = await writeArticle(art, slug, now);
  ledger.published.push({ slug, title: art.title, sourceUrl: candidate.link || null, date: now.dateStr, origin: 'auto' });
  await saveLedger(ledger);

  console.log(`✅ Article publié : src/content/actualites/${slug}.md (${words} mots, ${reading} min)${DRAFT ? ' [brouillon]' : ''}`);
}

main().catch((e) => { console.error('Erreur:', e); process.exit(1); });
