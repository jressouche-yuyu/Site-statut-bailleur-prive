/**
 * Configuration centrale du site.
 * Modifie ces valeurs pour adapter la marque, l'URL et les métadonnées globales.
 */

export const SITE = {
  /** Nom de marque affiché dans l'en-tête, les titres et les données structurées. */
  name: 'Bailleur Privé',
  /** Domaine de production (sans slash final). Utilisé pour les URL canoniques, le sitemap et les schémas. */
  url: 'https://www.statut-bailleur-prive.fr',
  /** Slogan court — réutilisé dans la home et les balises meta. */
  tagline: 'Le guide de référence du dispositif Jeanbrun',
  /** Description par défaut (meta description de repli, ~155 caractères). */
  description:
    "Statut du bailleur privé (dispositif Jeanbrun) : fonctionnement, taux d'amortissement, conditions, simulateur et actualités. Le guide indépendant pour les investisseurs.",
  /** Langue principale du contenu. */
  lang: 'fr-FR',
  locale: 'fr_FR',
  /** Auteur / éditeur du site (entité E-E-A-T). */
  author: 'La rédaction Bailleur Privé',
  /** Réseaux sociaux et profils (utilisés dans le schéma Organization → sameAs). */
  social: {
    linkedin: 'https://www.linkedin.com/company/statut-bailleur-prive',
    twitter: 'https://twitter.com/bailleurprive',
  },
  /** Image Open Graph par défaut (chemin relatif à /public). */
  defaultOgImage: '/og-default.svg',
  /** Adresse de contact éditorial / partenariats. */
  email: 'contact@statut-bailleur-prive.fr',
} as const;

/**
 * Modèle économique : site éditorial de référence financé par le netlinking
 * (partenariats éditoriaux, articles sponsorisés signalés). On garde une ligne
 * éditoriale indépendante et des pages d'autorité pour ranker durablement.
 */
export const EDITORIAL = {
  /** Active la page « Partenariats » (offre netlinking / contenu sponsorisé). */
  partnershipsEnabled: true,
} as const;

/** Navigation principale (header). */
export const NAV: { label: string; href: string }[] = [
  { label: 'Le dispositif', href: '/dispositif-jeanbrun' },
  { label: 'Guides', href: '/guides' },
  { label: 'Simulateur', href: '/simulateur' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Glossaire', href: '/glossaire' },
  { label: 'FAQ', href: '/faq' },
  { label: 'À propos', href: '/a-propos' },
];
