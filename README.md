# Bailleur Privé — statut du bailleur privé (dispositif Jeanbrun)

Site éditorial de référence sur le **statut du bailleur privé** (alias **dispositif Jeanbrun**), construit avec [Astro](https://astro.build) et pensé pour le **SEO** et le **GEO** (Generative Engine Optimization).

> **Modèle économique** : site éditorial d'autorité financé par le **netlinking**.
> Le **blog** (`/actualites`) accueille indifféremment les publications éditoriales
> et les **articles partenaires** (liens vendus), présentés à l'identique pour que
> les liens se fondent dans le contenu naturel. Les commandes passent par le
> **Contact**. L'objectif est de **ranker durablement** sur la thématique.

## ⚡ Démarrage

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:4321
npm run build    # build statique dans dist/
npm run preview  # prévisualise le build
npm run check    # vérification TypeScript / Astro
```

## 🧭 Architecture

```
src/
├── consts.ts                 # Config marque, URL, navigation (à personnaliser)
├── data/
│   ├── dispositif.ts          # Source unique des faits (taux, plafonds, conditions, calcul)
│   ├── guides.ts              # Guides éditoriaux (contenu informationnel)
│   ├── faq.ts                 # FAQ centrale (réutilisée + schéma FAQPage)
│   └── glossaire.ts           # Définitions (longue traîne + maillage interne)
├── content/actualites/        # Blog : actualités + analyses + articles partenaires (Markdown)
├── lib/schema.ts              # Fabriques JSON-LD schema.org (clé du GEO)
├── components/                # Header, Footer, Seo, Faq, Callout, RateTable…
├── layouts/BaseLayout.astro
└── pages/
    ├── index.astro                    # Accueil
    ├── dispositif-jeanbrun.astro      # Page pilier (cornerstone)
    ├── guides/                        # /guides + /guides/[slug]
    ├── simulateur.astro               # Simulateur d'amortissement (asset linkable)
    ├── actualites/                    # /actualites + /actualites/[...slug]
    ├── glossaire.astro                # Glossaire (DefinedTermSet)
    ├── faq.astro                      # FAQ (FAQPage)
    ├── a-propos.astro                 # Méthodologie & E-E-A-T
    ├── contact.astro                  # Contact (point d'entrée des commandes de liens)
    ├── mentions-legales.astro / confidentialite.astro
    ├── 404.astro
    └── rss.xml.ts                     # Flux RSS
public/
├── robots.txt              # Autorise crawlers SEO + IA (GPTBot, PerplexityBot, ClaudeBot…)
├── favicon.svg
└── og-default.svg          # Image Open Graph par défaut
```

## 🔍 Choix SEO / GEO

- **Rendu 100 % statique** : HTML complet servi aux crawlers et aux moteurs génératifs, excellents Core Web Vitals.
- **Page pilier** `/dispositif-jeanbrun` reliée aux guides, au glossaire et au simulateur (cocon sémantique).
- **Données structurées JSON-LD** : `Organization`, `WebSite`, `BreadcrumbList`, `Article`, `NewsArticle`, `FAQPage`, `HowTo`, `ItemList`, `DefinedTermSet`, `GovernmentService`.
- **FAQ en clair + schéma** : réponses courtes et factuelles, directement citables par les IA (AI Overviews, Perplexity, ChatGPT).
- **Sitemap** auto-généré (`@astrojs/sitemap`) + **canonical**, Open Graph et Twitter Card centralisés dans `components/Seo.astro`.
- **robots.txt** autorisant explicitement les crawlers IA pour le GEO.
- **Signaux de fraîcheur** : dates de publication / mise à jour affichées et exposées dans les schémas ; flux d'actualités.
- **E-E-A-T** : page méthodologie/sources, mention d'indépendance éditoriale, avertissements « ceci n'est pas un conseil fiscal ».

## 🔗 Publier un article (éditorial ou partenaire)

Le blog ne fait aucune différence d'affichage entre les deux. Pour publier,
ajoute un fichier `src/content/actualites/mon-article.md` :

```yaml
---
title: "Titre de l'article"
description: "Résumé pour le SEO (~155 caractères)."
publishedAt: 2026-06-20
author: "Nom de l'auteur"   # optionnel — défaut : la rédaction
partner: true               # optionnel — usage interne (suivi des liens vendus)
readingMinutes: 5
---

Corps de l'article en Markdown. Le lien du client est un lien Markdown
classique — il est rendu en **dofollow** : [texte d'ancre](https://site-client.fr).
```

- `partner: true` ne change **rien** à l'affichage tant que `EDITORIAL.disclosePartner`
  vaut `false` dans `src/consts.ts` (articles indistincts). Bascule-le à `true`
  pour afficher une mention « Contenu réalisé en partenariat » (transparence pub).
- Les liens Markdown sont **dofollow** par défaut. Pour un lien non suivi, utilise
  du HTML inline : `<a href="..." rel="nofollow">…</a>`.

## 🤖 Veille d'actualités automatique (Routine Claude Code)

Une **Routine Claude Code** publie **1 à 3 articles/semaine** de façon autonome,
en imitant un rythme humain (jours et heures variables en horaires de bureau
Europe/Paris, **jamais la nuit**, part d'aléatoire). Elle ne publie **jamais deux
fois le même sujet** (journal anti-doublon). Pas de clé API : la Routine tourne
sur l'abonnement Claude Code.

**Fonctionnement :** à chaque réveil planifié, la Routine suit le playbook
**`scripts/veille-playbook.md`** :
1. `node scripts/news-gate.mjs` décide s'il faut publier maintenant (cadence
   1–3/sem, horaires, aléa) → `GO` ou `SKIP` ;
2. si `GO`, veille par **recherche web** sur les thèmes du site, en évitant les
   sujets déjà traités ;
3. rédige un article original (ton neutre/pédagogique, orienté investisseur)
   avec **3–5 liens internes dont toujours la page pilier `/dispositif-jeanbrun`** ;
4. attribue une **vraie photo** (`assign-photo.mjs`), enregistre au journal
   (`news-record.mjs`), build, commit + push sur `main`.

**Réglages :** tout se pilote dans **`scripts/news.config.mjs`** — cadence
(`minPerWeek`/`maxPerWeek`, `activeDays`, `runsPerDay`, `publishHours`), persona,
ton, liens internes, sources à privilégier, longueur, angles. Le journal
anti-doublon est `scripts/news-ledger.json` (géré automatiquement).

**Créer la Routine** (une seule fois, voir <https://claude.ai/code/routines>) :
- **Prompt** : « Suis scrupuleusement les instructions de
  `scripts/veille-playbook.md`. »
- **Dépôt** : `Site-statut-bailleur-prive` · **Environnement** : avec accès web.
- **Réglage** : activer **« Allow unrestricted branch pushes »** (push sur `main`).
- **Planning** : 2 passages/jour en semaine, ex. cron `0 9 * * 1-5` et
  `0 15 * * 1-5` (UTC → ~10 h et ~16 h Paris). Doit correspondre à `runsPerDay`.

**Tester la cadence en local :** `npm run news:gate` (ou `NEWS_FORCE=1 npm run
news:gate` pour forcer un `GO`).

### Photos des articles (autonomie complète)

Chaque article reçoit **toujours une vraie photo**, via `scripts/assign-photo.mjs`
(appelé par la Routine, ou `npm run photo:assign -- "<slug>" "<thème FR>"`) :

- **Étage 1 — Pexels** (photos fraîches et variées) : actif si l'**environnement
  de la Routine** est configuré.
- **Étage 2 — bibliothèque locale** (repli garanti, hors-ligne) : sinon, le script
  choisit l'image existante la plus pertinente (mapping thématique + anti-répétition).

**Activer les photos Pexels** se fait dans la **configuration de l'environnement**
de la Routine (⚠️ *pas* le déclencheur « API » des Routines, qui ne sert qu'à la
lancer) :
1. autoriser `api.pexels.com` **et** `images.pexels.com` dans la politique réseau ;
2. y définir le secret **`PEXELS_API_KEY`** (clé gratuite : <https://www.pexels.com/api/>).

Tant que ce n'est pas fait, la Routine reste **100 % autonome** grâce à la
bibliothèque locale (seules la fraîcheur et la variété des visuels diffèrent).

## 🖼️ Ajouter de vraies photos

Chaque guide et article affiche une **couverture SVG générée** par défaut (thème
immobilier, brandée) — aucune image ne manque jamais. Pour mettre une vraie photo
à la place, deux options :

1. **Fichier local (recommandé)** : dépose l'image dans `public/images/`
   (ex. `public/images/guides/mon-guide.jpg`) puis renseigne le champ `cover` :
   - guides → `src/data/guides.ts` : `cover: '/images/guides/mon-guide.jpg'`
   - articles → frontmatter du `.md` : `cover: /images/blog/mon-article.jpg`
2. **URL distante** : `cover: 'https://…/photo.jpg'` (la photo est chargée telle quelle).

Champs associés : `coverAlt` (texte alternatif, SEO/accessibilité) et
`coverCredit` (mention de crédit, ex. `"Photo : Prénom Nom / Pexels"`).

> Sources de photos libres de droits : [Pexels](https://www.pexels.com),
> [Unsplash](https://unsplash.com). Privilégie des visuels immobilier / fiscalité.
> Recommandé : 1200×675 px (16:9) pour les vignettes, 1200×400 px (3:1) pour les
> bannières d'en-tête.

## 🏢 Logos des acteurs (home)

La section « Les acteurs du marché » affiche par défaut les **noms stylisés**
(wordmarks). Pour afficher de **vrais logos** :

1. Dépose le fichier dans `public/images/logos/<slug>.png` (slugs :
   `nexity`, `bouygues-immobilier`, `cogedim`, `vinci-immobilier`, `icade`,
   `kaufman-broad`, `pichet`, `nacarat`).
2. Ajoute l'entrée dans `src/data/logos.json`, ex. :
   `{ "nexity": { "src": "/images/logos/nexity.png", "name": "Nexity" } }`.

Le logo s'affiche alors à la place du wordmark (repli automatique sinon).
> ⚠️ N'utilise que des logos dont tu as le droit d'usage (kit presse de la marque
> ou licence libre). Le script `scripts/fetch-logos.mjs` (workflow « Logos des
> acteurs ») était câblé sur une API gratuite désormais inopérante : à rebrancher
> sur une source légitime.

## ✏️ Personnalisation

1. Modifie `src/consts.ts` (nom de marque, URL de prod, e-mail, réseaux sociaux).
2. Mets à jour le domaine dans `public/robots.txt`.
3. Complète `src/pages/mentions-legales.astro` et `confidentialite.astro` (champs entre crochets).
4. Maintiens `src/data/dispositif.ts` à jour : c'est la **source unique** des taux,
   plafonds et conditions (réutilisée par les pages, le simulateur et les schémas).

> ⚠️ **Exactitude & fraîcheur.** Les taux, plafonds et conditions reflètent la
> version du statut du bailleur privé issue de la loi de finances pour 2026
> (amendement Jeanbrun) telle qu'adoptée fin 2025. Les paramètres définitifs
> dépendent des décrets d'application : revérifie-les régulièrement. Le contenu
> est informatif et ne constitue pas un conseil fiscal personnalisé.

## 🚀 Déploiement

Le workflow `.github/workflows/deploy.yml` publie le site sur **GitHub Pages** à
chaque push sur la branche `claude/statut-bailleur-prive-site-wrw2ma`
(`BASE_PATH=/Site-statut-bailleur-prive`).

Pour un hébergement à la racine (domaine final ou Cloudflare Pages), build avec
les valeurs par défaut (`SITE.url`, base `/`) — le helper `src/lib/url.ts` rend
les liens internes neutres.
