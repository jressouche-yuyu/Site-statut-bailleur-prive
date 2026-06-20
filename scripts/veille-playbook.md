# Playbook — Veille d'actualités automatique

> Instructions exécutées par la **Routine Claude Code** à chaque réveil.
> Objectif : publier, de façon autonome et avec un rythme humain, des articles
> d'actualité de qualité pour le site (statut du bailleur privé / dispositif
> Jeanbrun), sans jamais deux fois le même sujet.

Tous les réglages (cadence, persona, ton, liens, sources, longueur) sont dans
**`scripts/news.config.mjs`**. Lis-le avant d'agir.

## Étape 1 — Décider s'il faut publier maintenant

Exécute :

```bash
node scripts/news-gate.mjs
```

- Si la sortie commence par **`SKIP`** → **arrête-toi immédiatement**, ne fais
  rien d'autre, ne commit rien. (C'est le cas le plus fréquent : c'est normal.)
- Si la sortie commence par **`GO`** → continue.

## Étape 2 — Veille (recherche web)

Avec l'outil de **recherche web**, cherche une actualité **française récente
(≤ 3 semaines)** en lien avec les thèmes du site : statut du bailleur privé /
dispositif Jeanbrun, fiscalité immobilière, investissement locatif, loi de
finances, marché du logement, amortissement, plafonds de loyer, etc.
Privilégie les sources fiables (voir `preferredSources` dans la config :
service-public.fr, economie.gouv.fr, Les Échos, Le Figaro, MoneyVox…).

**Anti-doublon (impératif)** : lis `scripts/news-ledger.json`. Écarte tout sujet
dont l'URL source est déjà listée, ou dont le titre/angle est trop proche d'un
article déjà publié. Si rien de pertinent et d'inédit n'est trouvé →
**arrête-toi sans publier** (c'est acceptable).

Choisis **un seul** sujet. Varie tes recherches d'un passage à l'autre pour ne
pas toujours tomber sur les mêmes sources.

## Étape 3 — Rédiger l'article

Rédige un article **original** (ne recopie pas la source : décrypte-la).

- **Ton** : neutre, pédagogique, factuel (voir `tone` / `persona` dans la config).
  On explique l'info, puis on l'oriente subtilement vers l'investisseur cible.
  Pas de conseil financier personnalisé, **aucun chiffre ni citation inventés**.
- **Angle** : choisis-en un différent à chaque fois (liste `angles` dans la config).
- **Longueur** : varie entre ~450 et ~850 mots (`wordRange`).
- **Maillage interne — 2 à 3 liens, en Markdown `[ancre](/url)`** :
  - **TOUJOURS** la page pilier **`/dispositif-jeanbrun`** (lien prioritaire).
  - + 1 à 2 liens secondaires pertinents (voir `secondaryLinks` dans la config).
  - Ancres descriptives, chaque lien une seule fois.
- **Source** : termine par une ligne `Source : <média>`.

## Étape 4 — Créer le fichier

Crée `src/content/actualites/<slug>.md` (slug = titre en minuscules, sans
accents, mots séparés par des tirets ; unique — vérifie qu'aucun fichier ni
entrée de ledger ne porte ce slug). Frontmatter exact :

```yaml
---
title: "…"
description: "… (meta description ~155 caractères)"
publishedAt: <date du jour AAAA-MM-JJ>
tags: ["…", "…"]
readingMinutes: <nombre>
author: "La rédaction Bailleur Privé"
---
```

Puis le corps en Markdown (sous-titres `##`).

## Étape 5 — Enregistrer dans le journal

```bash
node scripts/news-record.mjs "<slug>" "<titre exact>" "<url-source>"
```

## Étape 6 — Vérifier puis publier

```bash
npm run build      # doit réussir
```

Si le build réussit, commit et pousse sur **`main`** (déclenche le déploiement) :

```bash
git add src/content/actualites scripts/news-ledger.json
git commit -m "Actualité : <titre>"
git push origin main
```

> Pré-requis Routine : repo `Site-statut-bailleur-prive`, environnement avec
> accès web, et **« Allow unrestricted branch pushes »** activé (pour pouvoir
> pousser sur `main`).

## Garde-fous

- **Jamais** deux articles au sujet identique ou très proche.
- **Jamais** de chiffres, taux ou citations inventés : reste prudent et factuel.
- Si un doute sérieux sur une info → ne publie pas ce sujet.
- Un seul article par exécution.
