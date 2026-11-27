// Vérification des pages générées après le premier lot de corrections SEO.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const page = (path) => readFileSync(`dist/${path}/index.html`, 'utf8');
const eligibility = page('eligibilite');
assert.match(eligibility, /conditions importantes ne sont pas encore cochées/);
assert.doesNotMatch(eligibility, /votre projet n'est pas éligible/);
assert.match(eligibility, /critères de réhabilitation lourde/);

const simulator = page('simulateur');
assert.match(simulator, /ne vérifie ni votre éligibilité ni les plafonds de loyer/);
assert.doesNotMatch(simulator, /adoptée fin 2025/);

const guide = page('guides/conditions-eligibilite-dispositif-jeanbrun');
assert.match(guide, /réhabilitation lourde/);
assert.match(guide, /guides\/comment-fonctionne-statut-bailleur-prive\//);
assert.doesNotMatch(guide, /trois voies au choix/);

const commission = page('actualites/commission-assemblee-nationale-jeanbrun-ancien-seuil-travaux-septembre-2026');
assert.match(commission, /vote en commission ne modifie pas à lui seul/);
const lmnp = page('actualites/plf-2027-senat-clause-grand-pere-lmnp-novembre-2026');
assert.match(lmnp, /I-882/);
assert.match(lmnp, /pas d[’']une loi définitive/);

console.log('Pages prioritaires : informations et liens vérifiés dans le HTML généré.');
