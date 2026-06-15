/**
 * Glossaire : définitions courtes et factuelles. Excellent pour le maillage
 * interne, la longue traîne et la citabilité par les IA (GEO).
 */
export interface GlossaryTerm {
  term: string;
  /** Slug d'ancre (#) sur la page glossaire. */
  slug: string;
  definition: string;
}

export const glossaire: GlossaryTerm[] = [
  {
    term: 'Amortissement',
    slug: 'amortissement',
    definition:
      "Déduction comptable étalée dans le temps d'une fraction de la valeur d'un bien, pour tenir compte de son usure. Dans le dispositif Jeanbrun, le bailleur déduit chaque année un pourcentage du prix du logement de ses revenus fonciers.",
  },
  {
    term: 'Base amortissable',
    slug: 'base-amortissable',
    definition:
      "Part du prix d'acquisition sur laquelle s'applique l'amortissement, soit 80 % du prix dans le dispositif Jeanbrun. Les 20 % restants correspondent à la valeur du terrain, non amortissable.",
  },
  {
    term: 'Bailleur privé',
    slug: 'bailleur-prive',
    definition:
      "Particulier qui met un logement en location. Le « statut du bailleur privé » désigne le cadre fiscal créé pour soutenir ces investisseurs et reconstituer le parc locatif privé.",
  },
  {
    term: 'Loyer intermédiaire',
    slug: 'loyer-intermediaire',
    definition:
      "Loyer plafonné légèrement sous le marché, destiné à des locataires dont les ressources ne dépassent pas un certain plafond. C'est le niveau d'effort social le plus faible du dispositif (taux d'amortissement le plus bas).",
  },
  {
    term: 'Loyer social',
    slug: 'loyer-social',
    definition:
      "Loyer encadré plus bas que l'intermédiaire, avec des plafonds de ressources locataires plus stricts. Il ouvre un taux d'amortissement plus élevé.",
  },
  {
    term: 'Loyer très social',
    slug: 'loyer-tres-social',
    definition:
      "Niveau de loyer le plus bas du dispositif, ciblant les ménages les plus modestes. Il donne droit au taux d'amortissement maximal (5,5 % dans le neuf).",
  },
  {
    term: 'Location nue',
    slug: 'location-nue',
    definition:
      "Location d'un logement vide (non meublé). Les loyers sont imposés dans la catégorie des revenus fonciers. Le statut du bailleur privé s'adresse à la location nue.",
  },
  {
    term: 'LMNP',
    slug: 'lmnp',
    definition:
      "Loueur en Meublé Non Professionnel : régime de la location meublée, imposée en BIC, qui permet déjà d'amortir le bien. Le dispositif Jeanbrun étend une logique d'amortissement à la location nue.",
  },
  {
    term: 'Déficit foncier',
    slug: 'deficit-foncier',
    definition:
      "Situation où les charges déductibles d'un bien loué nu dépassent les loyers perçus. Le déficit s'impute sur le revenu global dans certaines limites, réduisant l'impôt.",
  },
  {
    term: 'Revenus fonciers',
    slug: 'revenus-fonciers',
    definition:
      "Revenus tirés de la location de biens nus. Le statut du bailleur privé permet d'amortir le logement pour diminuer le revenu foncier imposable.",
  },
  {
    term: 'Zonage (A, A bis, B1, B2, C)',
    slug: 'zonage',
    definition:
      "Découpage du territoire selon la tension du marché locatif. Dans le dispositif Jeanbrun, le zonage ne conditionne plus l'éligibilité mais sert à fixer les plafonds de loyer et de ressources.",
  },
  {
    term: 'DPE',
    slug: 'dpe',
    definition:
      "Diagnostic de Performance Énergétique, classant un logement de A à G. Dans l'ancien, le dispositif exige d'atteindre une étiquette A, B ou C après travaux.",
  },
  {
    term: 'Dispositif Pinel',
    slug: 'pinel',
    definition:
      "Ancien dispositif de réduction d'impôt pour l'investissement locatif neuf, arrêté le 31 décembre 2024. Le statut du bailleur privé lui succède avec une logique d'amortissement.",
  },
];
