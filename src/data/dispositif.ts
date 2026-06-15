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
  lastReviewed: '2026-06-15',
  /** Part du prix d'acquisition amortissable (le reste = quote-part terrain). */
  amortizableShare: 0.8,
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
  /** Plafond annuel de déduction au titre de l'amortissement (en €). */
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
      "Seuls les appartements situés dans un immeuble collectif sont éligibles ; les maisons individuelles sont exclues.",
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
      "Le logement ne peut être loué à un membre du foyer fiscal ni à un proche : le locataire doit être un tiers respectant les plafonds de ressources.",
  },
  {
    label: 'Acquisitions du 21 février 2026 au 31 décembre 2028',
    detail:
      "Le mécanisme d'amortissement vise les logements acquis dans cette fenêtre (dates sous réserve de confirmation du texte applicable).",
  },
  {
    label: 'Ancien : travaux ≥ 30 % + DPE A ou B',
    detail:
      "Dans l'ancien, l'éligibilité suppose des travaux d'au moins 30 % du prix et l'atteinte d'une étiquette énergétique performante (A ou B selon les sources) après rénovation.",
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
export function computeAmortization(price: number, tier: LoyerTier, segment: Segment) {
  const rate = segment === 'neuf' ? tier.rateNeuf : tier.rateAncien;
  const base = price * dispositif.amortizableShare;
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
