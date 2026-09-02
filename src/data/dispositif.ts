/**
 * Données de référence du statut du bailleur privé (dispositif Jeanbrun).
 *
 * ⚠️ IMPORTANT — Ces valeurs reflètent la version du dispositif issue du
 * projet de loi de finances pour 2026 (amendement gouvernemental « statut du
 * bailleur privé », porté par le ministre Vincent Jeanbrun, d'après le rapport
 * Cosson–Daubresse). Les taux, plafonds et conditions définitifs seront fixés
 * par la loi de finances promulguée et ses décrets d'application : ils doivent
 * être revérifiés avant toute décision d'investissement. La fraîcheur et
 * l'exactitude sont des signaux SEO/GEO majeurs : mettez `lastReviewed` à jour.
 */

export const dispositif = {
  /** Dernière revue éditoriale des chiffres (ISO 8601). */
  lastReviewed: '2026-09-02',
  /**
   * Part amortissable de la base. Le foncier est estimé forfaitairement à 20 %
   * du prix d'acquisition **net de frais** — le prix hors frais de notaire et
   * frais d'acquisition, donc.
   */
  amortizableShare: 0.8,
  /** Plafond annuel de déduction, par an et par FOYER FISCAL. */
  deductionCapHousehold: 8000,
  /** Majorations du plafond si 50 % au moins des revenus bruts des logements
   *  amortis relèvent de la catégorie concernée. */
  deductionCapBonus: { social: 2000, tresSocial: 4000 },
  /** Durée minimale d'engagement de location (en années). */
  engagementYears: 9,
  /** Entrée en vigueur (sous réserve de confirmation du texte applicable). */
  inForceFrom: '2026-02-21',
  /** Fin de la fenêtre d'acquisition éligible (sous réserve de confirmation). */
  acquisitionUntil: '2028-12-31',
} as const;

/** Type de bien éligible. */
export type Segment = 'neuf' | 'ancien';

/** Catégorie de loyer (effort social croissant). */
export interface LoyerTier {
  /** Identifiant stable. */
  key: 'intermediaire' | 'social' | 'tres-social';
  /** Libellé affiché. */
  label: string;
  /** Taux d'amortissement annuel pour le neuf (fraction, ex. 0.035 = 3,5 %). */
  rateNeuf: number;
  /** Taux d'amortissement annuel pour l'ancien rénové (fraction). */
  rateAncien: number;
  /**
   * Plafond annuel atteignable AVEC cette catégorie de loyer — à condition que
   * 50 % au moins des revenus bruts tirés des logements amortis relèvent de
   * cette catégorie. Ce n'est PAS un plafond attaché au logement : la loi pose
   * un plafond de 8 000 € par an et **par foyer fiscal**, tous logements
   * amortis confondus, majoré de 2 000 € (social) ou 4 000 € (très social).
   * Un bailleur détenant trois logements amortis a 8 000 €, pas 24 000 €.
   */
  deductionCap: number;
  /** Description courte de l'effort de loyer demandé. */
  effort: string;
}

export const loyerTiers: LoyerTier[] = [
  {
    key: 'intermediaire',
    label: 'Loyer intermédiaire',
    rateNeuf: 0.035,
    rateAncien: 0.03,
    deductionCap: 8000,
    effort: "Loyer plafonné un cran sous le marché, locataires sous plafonds de ressources.",
  },
  {
    key: 'social',
    label: 'Loyer social',
    rateNeuf: 0.045,
    rateAncien: 0.035,
    deductionCap: 10000,
    effort: 'Loyer social plus encadré, plafonds de ressources locataires plus stricts.',
  },
  {
    key: 'tres-social',
    label: 'Loyer très social',
    rateNeuf: 0.055,
    rateAncien: 0.04,
    deductionCap: 12000,
    effort: 'Effort social maximal : loyer très bas, publics les plus modestes.',
  },
];

/** Conditions clés du dispositif (réutilisées en listes / FAQ / schémas). */
export const conditions: { label: string; detail: string }[] = [
  {
    label: 'Logement collectif',
    detail:
      "Le logement doit se trouver dans un bâtiment d'habitation collectif au sens de l'article L. 111-1 du code de la construction : plus de deux logements, superposés au moins en partie. Sont donc exclus les maisons individuelles, mais aussi un immeuble de deux logements et un ensemble de maisons accolées sans superposition.",
  },
  {
    label: 'Location nue, résidence principale',
    detail:
      "Le logement doit être loué vide (non meublé) et constituer la résidence principale du locataire.",
  },
  {
    label: 'Engagement de 9 ans',
    detail:
      "L'engagement de location court sur 9 ans minimum, au loyer plafonné correspondant à la catégorie choisie.",
  },
  {
    label: 'Plafonds de loyer et de ressources',
    detail:
      "Le loyer et les ressources du locataire doivent respecter les plafonds de la catégorie (intermédiaire, social ou très social), définis selon la zone.",
  },
  {
    label: 'Pas de location à un proche',
    detail:
      "Le locataire ne peut être ni un membre du foyer fiscal, ni un parent ou allié jusqu'au deuxième degré inclus — enfant, parent, grand-parent, frère ou sœur. Loger son enfant étudiant tout en amortissant n'est donc pas possible.",
  },
  {
    label: 'Acquisitions du 21 février 2026 au 31 décembre 2028',
    detail:
      "Le mécanisme d'amortissement vise les logements acquis dans cette fenêtre (dates sous réserve de confirmation du texte applicable).",
  },
  {
    label: 'Ancien : trois voies alternatives',
    detail:
      "L'ancien ouvre droit au dispositif par l'une de trois voies au choix : des travaux concourant à la production d'un immeuble neuf au sens fiscal ; des travaux d'amélioration représentant au moins 30 % du prix d'acquisition ; ou une réhabilitation lourde. La condition d'étiquette énergétique A ou B ne s'attache qu'à cette troisième voie — elle n'est pas exigée sur les deux premières.",
  },
];

/** Repères chronologiques (signal de fraîcheur + contexte E-E-A-T). */
export const timeline: { date: string; label: string }[] = [
  { date: '17 octobre 2025', label: "Annonce de l'amendement « statut du bailleur privé » au PLF 2026." },
  { date: '14 novembre 2025', label: "Adoption par l'Assemblée nationale." },
  { date: '30 novembre 2025', label: 'Adoption par le Sénat.' },
  { date: '21 février 2026', label: 'Entrée en vigueur du dispositif (acquisitions éligibles).' },
  { date: '31 décembre 2028', label: "Fin de la fenêtre d'acquisition éligible (à confirmer)." },
];

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatEur = (n: number) => eur.format(n);
export const formatPct = (n: number) => pct.format(n);

/**
 * Calcule l'amortissement annuel et cumulé.
 * @param price prix d'acquisition (€)
 * @param tier catégorie de loyer
 * @param segment neuf ou ancien
 */
export function computeAmortization(
  price: number,
  tier: LoyerTier,
  segment: Segment,
  /** Montant des travaux (ancien uniquement) : il entre dans la base amortissable. */
  travaux = 0,
) {
  const rate = segment === 'neuf' ? tier.rateNeuf : tier.rateAncien;
  // Dans l'ancien, la base est assise sur le prix d'acquisition MAJORÉ des
  // travaux, avant application des 80 %. L'omettre sous-estimait le dispositif
  // d'environ 30 % sur une opération à 30 % de travaux.
  const assiette = price + (segment === 'ancien' ? travaux : 0);
  const base = assiette * dispositif.amortizableShare;
  const annualRaw = base * rate;
  const annual = Math.min(annualRaw, tier.deductionCap);
  const capped = annualRaw > tier.deductionCap;
  const years = dispositif.engagementYears;
  return {
    rate,
    base,
    annualRaw,
    annual,
    capped,
    total: annual * years,
    years,
  };
}
