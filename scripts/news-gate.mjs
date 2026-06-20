/**
 * Décision de cadence pour la veille éditoriale (utilisé par la Routine).
 *
 * Imite un rythme humain : objectif 1–3 articles/semaine (tiré au hasard par
 * semaine), jours/heures variables en horaires de bureau (Europe/Paris), jamais
 * la nuit, part d'aléatoire pour que les jours soient irréguliers. Garantit le
 * minimum hebdomadaire en publiant le dernier jour actif si besoin.
 *
 * Sortie (stdout) : « GO: <raison> » ou « SKIP: <raison> ». Code de sortie 0.
 * Variable d'environnement : NEWS_FORCE=1 force GO (test manuel).
 *
 * Usage : node scripts/news-gate.mjs
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { config } from './news.config.mjs';

const ROOT = path.resolve(process.cwd());
const LEDGER_PATH = path.join(ROOT, 'scripts/news-ledger.json');
// Drapeau de test : si ce fichier existe, on force un GO (un seul run de test).
// Retiré ensuite pour revenir à la cadence normale.
const FORCE_FLAG = path.join(ROOT, 'scripts/force-next-publish');
const FORCE = process.env.NEWS_FORCE === '1';

function parisNow() {
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const year = +p.year, month = +p.month, day = +p.day;
  let hour = +p.hour; if (hour === 24) hour = 0;
  const utc = new Date(Date.UTC(year, month - 1, day));
  const weekday = ((utc.getUTCDay() + 6) % 7) + 1; // 1 = lundi … 7 = dimanche
  const { isoYear, isoWeek } = isoWeekOf(year, month, day);
  return { dateStr: `${p.year}-${p.month}-${p.day}`, hour, weekday, weekKey: `${isoYear}-W${isoWeek}` };
}
function isoWeekOf(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const isoYear = date.getUTCFullYear();
  const ft = new Date(Date.UTC(isoYear, 0, 4));
  const fNum = (ft.getUTCDay() + 6) % 7;
  ft.setUTCDate(ft.getUTCDate() - fNum + 3);
  return { isoYear, isoWeek: 1 + Math.round((date - ft) / (7 * 24 * 3600 * 1000)) };
}
function weekKeyOf(dateStr) {
  const [y, m, d] = (dateStr || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  const { isoYear, isoWeek } = isoWeekOf(y, m, d);
  return `${isoYear}-W${isoWeek}`;
}
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

async function loadLedger() {
  try { return JSON.parse(await readFile(LEDGER_PATH, 'utf8')); } catch { return { published: [] }; }
}

function out(verdict, reason) { console.log(`${verdict}: ${reason}`); }

async function main() {
  const now = parisNow();
  if (FORCE) return out('GO', 'NEWS_FORCE');
  if (existsSync(FORCE_FLAG)) return out('GO', 'test forcé (scripts/force-next-publish)');

  const { hour, dateStr, weekday, weekKey } = now;
  const { start, end } = config.publishHours;
  if (!config.activeDays.includes(weekday)) return out('SKIP', `jour inactif (${weekday})`);
  if (hour < start || hour >= end) return out('SKIP', `hors heures (${hour}h Paris)`);

  const ledger = await loadLedger();
  const span = config.maxPerWeek - config.minPerWeek + 1;
  const weekTarget = config.minPerWeek + Math.floor(mulberry32(hashStr(weekKey))() * span);
  const thisWeek = ledger.published.filter((p) => p.origin === 'auto' && weekKeyOf(p.date) === weekKey);
  if (thisWeek.length >= weekTarget) return out('SKIP', `objectif atteint (${thisWeek.length}/${weekTarget})`);

  const today = thisWeek.filter((p) => p.date === dateStr).length;
  if (today >= 1 && Math.random() > config.sameDayChance) return out('SKIP', 'déjà publié aujourd\'hui');

  // Jours actifs restants dans la semaine (aujourd'hui inclus).
  const activeLeft = config.activeDays.filter((d) => d >= weekday).length;
  const remainingNeeded = weekTarget - thisWeek.length;

  // Filet de sécurité : dernier jour actif et minimum non atteint → on publie.
  if (activeLeft <= 1 && thisWeek.length < config.minPerWeek) {
    return out('GO', `garantie du minimum (${thisWeek.length}/${weekTarget}, dernier jour actif)`);
  }

  const remainingRuns = Math.max(1, activeLeft * config.runsPerDay - 1);
  let prob = (remainingNeeded / remainingRuns) * (0.6 + Math.random() * 0.9);
  prob = Math.min(0.85, Math.max(0.05, prob));
  if (Math.random() > prob) return out('SKIP', `créneau sauté (aléa humain, p=${prob.toFixed(2)})`);

  return out('GO', `publication (cible=${weekTarget}, déjà=${thisWeek.length})`);
}

main();
