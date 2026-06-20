# Playbook — Veille & rédaction automatique (YMYL / GEO 2026)

> Instructions exécutées par la **Routine Claude Code** à chaque réveil.
> Objectif : publier de façon autonome, à un rythme humain, des articles
> immobiliers / juridiques / fiscaux de **qualité YMYL** — positionnables sur
> Google **et** citables mot pour mot par les LLM (ChatGPT, Perplexity, Gemini,
> AI Overviews). Un article faux ou mal sourcé déclasse et expose la marque :
> **exactitude et crédibilité maximales, zéro chiffre inventé.**

Réglages : **`scripts/news.config.mjs`**. Faits de référence : **`scripts/faits-verifies.md`**
(à **revérifier à la source** à chaque publication). Journal anti-doublon :
`scripts/news-ledger.json`.

---

## Étape 1 — Décider s'il faut publier maintenant

```bash
node scripts/news-gate.mjs
```
- Sortie **`SKIP`** → **arrête-toi immédiatement**, ne fais rien (cas fréquent, normal).
- Sortie **`GO`** → continue.

## Étape 2 — Veille (recherche web vérifiée)

Cherche une **actualité française récente (≤ 3 semaines)** sur les thèmes du site :
statut du bailleur privé / loi Jeanbrun, loi Le Meur, fiscalité immobilière,
investissement locatif, loi de finances, DPE, marché du logement.

- **Sources fiables d'abord** (voir `preferredSources` / `officialSources`) :
  Légifrance, service-public.fr, economie.gouv.fr, impots.gouv.fr, ANIL, puis
  presse de référence (Les Échos, Le Figaro, MoneyVox…).
- **Anti-doublon (impératif)** : lis `scripts/news-ledger.json` ; écarte tout
  sujet dont l'URL est déjà listée ou dont l'angle est trop proche d'un article
  publié. Si rien d'inédit et de pertinent → **arrête-toi sans publier**.
- **Vérifie les faits** que tu comptes citer **directement à la source
  officielle** (au moins une). Tout chiffre/taux/date doit être confirmé.

Choisis **un seul** sujet. Varie tes recherches d'un passage à l'autre.

## Étape 3 — Rédiger l'article (les 3 piliers)

### Pilier A — GEO (citabilité par les LLM)
- **Answer-first** : chaque section s'ouvre, juste sous son titre, par une
  **réponse autonome de 25–50 mots**, citable hors contexte. Le développement vient après.
- **Phrases auto-portantes** : aucun « comme vu plus haut / ci-dessus /
  précédemment », aucun pronom sans référent. Chaque phrase garde son sens isolée.
- **Définition d'entité dès l'intro** : « Le statut du bailleur privé est un
  dispositif fiscal qui… ».
- Un concept = une section, **pyramide inversée** (l'essentiel d'abord).
- **Intro et conclusion surpondérées** : idées et mots-clés forts au début et à la fin.

### Pilier B — SEO (couverture sémantique)
- **Intention de recherche** (informationnel / transactionnel / comparatif)
  identifiée et traitée dès le 1er paragraphe.
- **Champ lexical riche** : couvrir tout le vocabulaire du sujet (pas de bourrage).
- **Structure stricte** : **un seul H1** (le `title`/`metaTitle`) ; **jamais** les
  mots « Introduction » / « Conclusion » comme titres ; **typographie française**
  (une seule majuscule en début de titre — **Title Case anglo-saxon interdit**).
- **Éléments enrichis obligatoires**, tous porteurs du vocabulaire du sujet :
  - **≥ 1 tableau** (min. **5 lignes × 3 colonnes**, à vraie valeur — ex. barème,
    conditions, comparatif) en Markdown dans le corps ;
  - **≥ 1 liste à puces** ;
  - **≥ 1 bloc Focus** (chiffre/insight) — utilise une citation Markdown `>` ;
  - **1 FAQ de 3 questions** → à mettre dans le **frontmatter `faq`** (le gabarit
    la rend et l'injecte en JSON-LD, **ne la mets pas dans le corps**).
- **Maillage interne : 3 à 5 liens**, ancres descriptives **uniques** (1 par URL),
  dont **TOUJOURS la page pilier `/dispositif-jeanbrun`**. Autres cibles : voir
  `secondaryLinks` dans la config. Liens Markdown `[ancre](/url)`.

### Pilier C — E-E-A-T & confiance (anti-hallucination)
- **Zéro chiffre inventé.** Tout %, prix, taux, date vient d'une **source réelle
  vérifiable**. À défaut → formulation **qualitative**.
- **Ton informatif neutre**, voix de marque **« nous »** (1ʳᵉ pers. pluriel),
  **jamais « je »**, pas de style Wikipédia/observateur tiers, **aucun superlatif**
  (« leader incontestable », « le meilleur »…).
- Sujets sensibles (juridique, fiscal) : n'avancer **que ce qui est sourcé**.

### Mode juridique / YMYL (réflexes à INVERSER)
- **Garder toutes les dates** : la date EST l'information (« applicable du
  21/02/2026 au 31/12/2028 »).
- **Garder les chiffres légaux EXACTS** (5,5 / 4,5 / 3,5 %). **Jamais « environ »**
  sur un barème de loi.
- **Citer visiblement les sources officielles** → champ `sources` du frontmatter.
- **Désambiguïser les entités** : loi Jeanbrun ≠ loi Le Meur ≠ Pinel ≠ LMNP
  (voir `scripts/faits-verifies.md`).
- Inclure une **section conditions/barèmes** structurée (éligibilité, plafonds,
  durée d'engagement, régime fiscal) — c'est le cœur d'un article de loi.

> Les éléments techniques **« À jour au [date] », disclaimer juridique, JSON-LD
> `Article` (dateModified+author) et `FAQPage`** sont générés **automatiquement**
> par le gabarit d'article à partir du frontmatter — tu n'as pas à les écrire.

## Étape 4 — Créer le fichier

`src/content/actualites/<slug>.md` (slug minuscules, sans accents, tirets ;
unique). Frontmatter :

```yaml
---
title: "H1 : mot-clé + promesse (typo FR, pas de Title Case)"
metaTitle: "Titre SEO 50–60 caractères avec le mot-clé | Bailleur Privé"
description: "Meta description 140–155 caractères, avec le mot-clé."
publishedAt: <date du jour AAAA-MM-JJ>
updatedAt: <date du jour AAAA-MM-JJ>
tags: ["entité principale", "thème"]
readingMinutes: <nombre>
author: "La rédaction Bailleur Privé"
faq:
  - question: "Question 1 ?"
    answer: "Réponse autonome de 25–50 mots, chiffres exacts si légaux."
  - question: "Question 2 ?"
    answer: "…"
  - question: "Question 3 ?"
    answer: "…"
sources:
  - label: "Légifrance — <texte précis>"
    url: "https://www.legifrance.gouv.fr/…"
  - label: "service-public.fr — <fiche>"
    url: "https://www.service-public.fr/…"
---

(corps en Markdown : sections answer-first, 1 tableau ≥5×3, 1 liste, 1 bloc Focus
en citation `>`, 3–5 liens internes dont /dispositif-jeanbrun. PAS de FAQ, PAS de
sources, PAS de disclaimer ici : le gabarit les ajoute.)
```

## Étape 5 — Photo illustrative

Récupère une photo d'illustration (comme les articles existants) :

```bash
node scripts/fetch-one-photo.mjs "<slug>" "<requête en anglais>"
```

La requête doit décrire un visuel **pertinent et sobre** (ex. `modern apartment
building facade`, `french city housing rooftops`, `tax documents calculator desk`).
Si la photo est indisponible, l'article garde sa couverture SVG générée (jamais
d'image manquante) — ce n'est pas bloquant.

## Étape 6 — Contrôle qualité (checklist mécanique)

```bash
node scripts/news-check.mjs src/content/actualites/<slug>.md
```

Tant qu'il reste un **✗**, **corrige l'article** et relance. Ne publie que
lorsque **tous les contrôles passent**.

## Étape 7 — Publier directement sur `main` (OBLIGATOIRE)

Tu disposes d'une **autorisation explicite et permanente** de publier
**directement sur la branche `main`** (le push non restreint est activé pour
cela). C'est le comportement **attendu et demandé**.

```bash
npm run build
```
Si le build réussit :
```bash
git add src/content/actualites scripts/news-ledger.json public/images src/data/photos.json
git commit -m "Actualité : <titre>"
git push origin HEAD:main
```

**Règles impératives :**
- **NE crée PAS** de branche de travail dédiée et **NE crée PAS** de Pull Request.
- **NE demande PAS** de validation : la publication sur `main` est autorisée d'avance.
- Le déploiement ne se déclenche **que** depuis `main`. Un article qui reste sur
  une branche `claude/...` est considéré comme **NON publié** (échec de la routine).

> Pré-requis Routine (déjà en place) : dépôt `Site-statut-bailleur-prive`,
> environnement avec accès web, **« Allow unrestricted branch pushes »** activé.
> Optionnel pour les photos : `api.pexels.com` autorisé + secret `PEXELS_API_KEY`.

---

## ✅ Checklist avant publication (valider CHAQUE point)

- [ ] Chaque section démarre par une réponse autonome de 25–50 mots
- [ ] Définition claire de l'entité principale dans l'intro
- [ ] Toutes les dates et chiffres légaux **exacts et sourcés** (source visible)
- [ ] Bloc « À jour au » présent (auto via `updatedAt`)
- [ ] JSON-LD `Article` (dateModified + author) + `FAQPage` (auto via `faq`)
- [ ] Disclaimer juridique présent (auto)
- [ ] Entités légales distinguées sans confusion
- [ ] Tableau (≥ 5×3), FAQ (3 Q/R), liste à puces, bloc Focus
- [ ] 1 H1 unique · pas de « Introduction/Conclusion » · typo FR (pas de Title Case)
- [ ] `metaTitle` 50–60 car. · `description` 140–155 car.
- [ ] Voix « nous », ton neutre, zéro superlatif, zéro chiffre non sourcé
- [ ] 3–5 liens internes, ancres uniques, dont `/dispositif-jeanbrun`
- [ ] Photo illustrative récupérée (ou repli SVG assumé)
- [ ] `node scripts/news-check.mjs` : tous les contrôles passent

## Garde-fous

- **Jamais** deux articles au sujet identique ou très proche.
- **Jamais** de chiffre, taux, prix ou citation inventés.
- Doute sérieux sur un fait → **ne publie pas** ce sujet.
- Un seul article par exécution.
