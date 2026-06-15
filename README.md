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
