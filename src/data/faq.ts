/**
 * FAQ centrale du site. Réponses courtes et factuelles, directement citables
 * par les moteurs génératifs (AI Overviews, Perplexity, ChatGPT) → GEO.
 * Réutilisée sur la home, la page dispositif et la page /faq (schéma FAQPage).
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Qu'est-ce que le statut du bailleur privé (dispositif Jeanbrun) ?",
    answer:
      "C'est un régime fiscal créé par la loi de finances pour 2026 qui permet à un bailleur particulier d'amortir une partie du prix d'un logement loué nu, c'est-à-dire de déduire chaque année une fraction de sa valeur de ses revenus fonciers. Cet avantage, jusqu'ici réservé à la location meublée, est ouvert à la location nue en contrepartie de loyers plafonnés.",
  },
  {
    question: 'Pourquoi parle-t-on de « dispositif Jeanbrun » ?',
    answer:
      "Le dispositif tient son surnom de Vincent Jeanbrun, ministre de la Ville et du Logement, qui a porté l'amendement gouvernemental créant le statut du bailleur privé dans le projet de loi de finances pour 2026. Il s'appuie sur un rapport parlementaire de Mickaël Cosson et Marc-Philippe Daubresse.",
  },
  {
    question: 'Quels sont les taux d’amortissement ?',
    answer:
      "Dans le neuf, l'amortissement annuel est de 3,5 % pour un loyer intermédiaire, 4,5 % pour un loyer social et 5,5 % pour un loyer très social. Dans l'ancien rénové, il est respectivement de 3 %, 3,5 % et 4 %. L'amortissement porte sur 80 % du prix d'acquisition (les 20 % restants correspondant au terrain).",
  },
  {
    question: 'Quelles sont les conditions pour en bénéficier ?',
    answer:
      "Il faut acquérir un logement collectif (appartement) à compter du 1er janvier 2026, le louer nu comme résidence principale pendant au moins 9 ans, et respecter les plafonds de loyer et de ressources du locataire correspondant à la catégorie choisie. Dans l'ancien, des travaux d'au moins 30 % du prix amenant à un DPE A, B ou C sont requis.",
  },
  {
    question: 'Le dispositif Jeanbrun remplace-t-il le Pinel ?',
    answer:
      "Oui, il prend le relais. Le dispositif Pinel a pris fin le 31 décembre 2024. Le statut du bailleur privé vise à relancer l'investissement locatif avec une logique différente : non plus une réduction d'impôt, mais un amortissement déduit des revenus fonciers.",
  },
  {
    question: 'Faut-il investir en zone tendue ?',
    answer:
      "Non. Dans la version Jeanbrun, le zonage ne conditionne plus l'éligibilité : on peut investir partout en France. Le zonage sert uniquement à fixer les plafonds de loyer et de ressources applicables.",
  },
  {
    question: "L'amortissement est-il plafonné ?",
    answer:
      "Oui. La déduction annuelle au titre de l'amortissement est plafonnée à 8 000 € pour un loyer intermédiaire, 10 000 € pour un loyer social et 12 000 € pour un loyer très social.",
  },
  {
    question: "Peut-on cumuler avec le déficit foncier ou le LMNP ?",
    answer:
      "Le statut du bailleur privé concerne la location nue (revenus fonciers). Il ne se cumule pas avec le régime de la location meublée (LMNP), qui relève des BIC. Les modalités d'articulation avec le déficit foncier seront précisées par les textes d'application : vérifiez-les avant d'arbitrer.",
  },
];
