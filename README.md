# Bailleur Privé — statut du bailleur privé (dispositif Jeanbrun)

Site éditorial de référence sur le **statut du bailleur privé** (alias **dispositif Jeanbrun**), construit avec [Astro](https://astro.build) et pensé pour le **SEO** et le **GEO** (Generative Engine Optimization).

> **Modèle économique** : site éditorial d'autorité financé par le **netlinking**
> (articles partenaires et contenus sponsorisés signalés, voir `/partenariats`).
> L'objectif est de **ranker durablement** sur la thématique pour offrir des
> emplacements de liens contextuels de qualité.

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
├── content/actualites/        # Articles d'actualité en Markdown (signal de fraîcheur)
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
    ├── partenariats.astro             # Offre netlinking / contenus sponsorisés
    ├── contact.astro
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
