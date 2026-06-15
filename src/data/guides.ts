/**
 * Guides éditoriaux (contenu informationnel TOFU/MOFU).
 * Ils captent les requêtes « comment ça marche », « neuf ou ancien »,
 * « différence avec le Pinel/LMNP » et nourrissent le maillage interne vers la
 * page pilier (/dispositif-jeanbrun), le simulateur et les actualités.
 *
 * Le corps des sections accepte du HTML léger (paragraphes, listes, <strong>,
 * liens internes). Garder un ton sobre, factuel et daté (E-E-A-T).
 */

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** Catégorie éditoriale (pour le maillage et les badges). */
  category: 'Comprendre' | 'Investir' | 'Comparer' | 'Fiscalité';
  publishedAt: string;
  lastUpdated: string;
  readingMinutes: number;
  /** Photo de couverture (optionnelle) : chemin sous /public ou URL. Sinon couverture SVG générée. */
  cover?: string;
  coverAlt?: string;
  coverCredit?: string;
  /** Résumé d'ouverture (riche en contexte, citable GEO). */
  intro: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
}

export const guides: Guide[] = [
  {
    slug: 'plafonds-loyer-ressources-dispositif-jeanbrun',
    title: 'Plafonds de loyer et de ressources du dispositif Jeanbrun (2026)',
    description:
      "Loyers plafonnés, ressources des locataires, zonage : comment sont fixés les plafonds du statut du bailleur privé en 2026, avec le barème par zone et catégorie (intermédiaire, social, très social).",
    category: 'Investir',
    publishedAt: '2026-06-15',
    lastUpdated: '2026-06-15',
    readingMinutes: 8,
    intro:
      "Pour amortir avec le dispositif Jeanbrun, le bailleur s'engage sur un loyer plafonné et des locataires sous plafonds de ressources. Bonne nouvelle : ces plafonds ne dépendent pas d'un nouveau décret — ils renvoient à des barèmes déjà connus. Voici, catégorie par catégorie et zone par zone, ce qui s'applique en 2026.",
    sections: [
      {
        heading: 'Comment les plafonds sont-ils fixés ?',
        body: "<p>Le statut du bailleur privé est créé par l'<strong>article 12 octies de la loi de finances pour 2026</strong>. Point important confirmé par un courrier du ministre Vincent Jeanbrun du 20 mars 2026 : <strong>aucun décret d'application n'est nécessaire</strong> pour le cœur du dispositif. Les plafonds de loyer et de ressources sont fixés <strong>par renvoi à des barèmes existants</strong>, ce qui a permis une entrée en application rapide.</p><p>Le <a href=\"/glossaire#zonage\">zonage</a> ne conditionne pas l'éligibilité (on peut investir partout), mais il sert à déterminer les plafonds : le <strong>loyer intermédiaire</strong> et les ressources associées se réfèrent au <strong>zonage A/A bis/B1/B2/C</strong> (logique Pinel / logement locatif intermédiaire) ; le <strong>loyer social et très social</strong> et les ressources sont fixés à l'<strong>échelle communale</strong> (logique Loc'Avantages).</p>",
      },
      {
        heading: 'Barème des plafonds de loyer 2026 (€/m²/mois)',
        body: "<p>À titre indicatif, voici les plafonds de loyer mensuels au m² applicables en 2026, alignés sur les barèmes de référence (logement intermédiaire et Loc'Avantages) :</p><div class=\"table-wrap\"><table><thead><tr><th>Zone</th><th>Intermédiaire</th><th>Social</th><th>Très social</th></tr></thead><tbody><tr><th scope=\"row\">A bis</th><td>19,71 €</td><td>≈ 13,68 €</td><td>≈ 10,93 €</td></tr><tr><th scope=\"row\">A</th><td>14,64 €</td><td>≈ 10,17 €</td><td>≈ 8,12 €</td></tr><tr><th scope=\"row\">B1</th><td>11,80 €</td><td>≈ 8,20 €</td><td>≈ 6,55 €</td></tr><tr><th scope=\"row\">B2 / C</th><td>10,26 €</td><td>communal</td><td>communal</td></tr></tbody></table></div><p>Ces plafonds s'appliquent après un <strong>coefficient de surface</strong> de 0,7 + 19/S (plafonné à 1,2), où S est la surface habitable : plus le logement est petit, plus le loyer au m² autorisé est élevé. Les niveaux social et très social sont fixés commune par commune ; les valeurs ci-dessus sont des ordres de grandeur issus du barème Loc'Avantages.</p>",
      },
      {
        heading: 'Plafonds de ressources des locataires',
        body: "<p>Les ressources du locataire sont appréciées à la date de signature du bail et ne doivent pas dépasser des seuils qui varient selon la <strong>catégorie</strong> et la <strong>composition du foyer</strong> :</p><ul><li><strong>Loyer intermédiaire</strong> : plafonds de ressources du logement intermédiaire (référence Pinel / LLI), par zone A/A bis/B1 et par composition du foyer.</li><li><strong>Loyer social et très social</strong> : plafonds plus stricts, fixés à l'échelle communale (référence Loc'Avantages Loc2 / Loc3).</li></ul><p>Concrètement, plus l'effort de loyer consenti est important, plus les plafonds de ressources sont bas — et plus le taux d'amortissement est élevé. La <a href=\"/guides/conditions-eligibilite-dispositif-jeanbrun\">page conditions d'éligibilité</a> récapitule les autres critères (logement collectif, location nue, 9 ans).</p>",
      },
      {
        heading: 'Lien entre plafonds et amortissement',
        body: "<p>Le choix de la catégorie de loyer commande directement l'avantage fiscal. Dans le <strong>neuf</strong>, l'amortissement annuel est de 3,5 % (intermédiaire), 4,5 % (social) ou 5,5 % (très social), dans la limite de <strong>8 000 €, 10 000 € et 12 000 €</strong> de déduction par an. Dans l'<strong>ancien rénové</strong>, les taux sont de 3 %, 3,5 % et 4 %.</p><p><strong>À vérifier :</strong> dans l'ancien, plusieurs analyses rattachent l'avantage au plafond du <a href=\"/glossaire#deficit-foncier\">déficit foncier</a> (10 700 € par an, voire 21 400 € en cas de rénovation énergétique, mesure prolongée jusqu'en 2027). Les modalités exactes de cumul restent à confirmer avec le texte définitif : recoupez avant d'arbitrer, et testez votre cas dans le <a href=\"/simulateur\">simulateur</a>.</p>",
      },
      {
        heading: 'Sources & méthode',
        body: "<p>Cet article s'appuie sur l'article 12 octies de la loi de finances pour 2026, les communications du ministère de la Ville et du Logement (courrier du 20 mars 2026), les barèmes de référence du logement intermédiaire et de <a href=\"https://www.service-public.fr\" rel=\"nofollow\">Loc'Avantages</a>, ainsi que sur les analyses de la presse patrimoniale et de l'<a href=\"https://www.anil.org\" rel=\"nofollow\">ANIL</a>. Les barèmes étant réévalués chaque année et certaines modalités encore en cours de précision, nous datons et mettons à jour cette page régulièrement.</p>",
      },
    ],
    faq: [
      {
        question: 'Faut-il attendre un décret pour utiliser le dispositif Jeanbrun ?',
        answer:
          "Non. Le ministre a confirmé en mars 2026 qu'aucun décret d'application n'était nécessaire pour le cœur du dispositif : les plafonds de loyer et de ressources renvoient à des barèmes déjà existants, ce qui a permis une entrée en application rapide.",
      },
      {
        question: 'Le zonage détermine-t-il qui peut investir ?',
        answer:
          "Non, le zonage ne conditionne pas l'éligibilité : on peut investir partout en France. Il sert uniquement à fixer les plafonds de loyer et de ressources — par zonage ABC pour l'intermédiaire, à l'échelle communale pour le social et le très social.",
      },
      {
        question: 'Quel loyer maximum pour un logement en zone A ?',
        answer:
          "En zone A, le plafond de loyer intermédiaire 2026 est de l'ordre de 14,64 €/m²/mois, avant application du coefficient de surface (0,7 + 19/S, plafonné à 1,2). Les niveaux social et très social sont plus bas et fixés commune par commune.",
      },
    ],
  },
  {
    slug: 'comment-fonctionne-statut-bailleur-prive',
    title: 'Comment fonctionne le statut du bailleur privé ?',
    description:
      "Amortissement, base de calcul, plafonds, engagement de 9 ans : le fonctionnement du dispositif Jeanbrun expliqué simplement, avec un exemple chiffré.",
    category: 'Comprendre',
    publishedAt: '2026-02-04',
    lastUpdated: '2026-06-10',
    readingMinutes: 8,
    intro:
      "Le statut du bailleur privé, surnommé dispositif Jeanbrun, repose sur un mécanisme simple sur le principe : amortir une partie du prix du logement, c'est-à-dire en déduire chaque année une fraction de ses revenus fonciers. En contrepartie, le bailleur s'engage sur un loyer plafonné pendant au moins neuf ans.",
    sections: [
      {
        heading: "Le principe : amortir un bien loué nu",
        body: "<p>Jusqu'ici, l'amortissement d'un logement était réservé à la location meublée (régime LMNP, imposé en BIC). Le statut du bailleur privé étend cette logique à la <strong>location nue</strong>, imposée dans la catégorie des revenus fonciers. Concrètement, le bailleur déduit chaque année un pourcentage du prix de son bien de ses loyers imposables, ce qui réduit — parfois fortement — son revenu foncier net et donc son impôt.</p>",
      },
      {
        heading: "Sur quelle base se calcule l'amortissement ?",
        body: "<p>L'amortissement ne porte pas sur la totalité du prix payé. Il s'applique sur <strong>80 % du prix d'acquisition</strong> : les 20 % restants sont réputés correspondre à la valeur du terrain, qui ne se déprécie pas et n'est donc pas amortissable. Pour un appartement payé 250 000 €, la base amortissable est de 200 000 €.</p>",
      },
      {
        heading: "Des taux liés à l'effort de loyer",
        body: "<p>Plus le bailleur consent un loyer bas, plus le taux d'amortissement est élevé. Dans le <strong>neuf</strong>, le taux annuel est de 3,5 % (loyer intermédiaire), 4,5 % (social) ou 5,5 % (très social). Dans l'<strong>ancien rénové</strong>, il est respectivement de 3 %, 3,5 % et 4 %. La déduction annuelle est toutefois plafonnée à 8 000 €, 10 000 € ou 12 000 € selon la catégorie.</p>",
      },
      {
        heading: 'Un exemple chiffré',
        body: "<p>Prenons un appartement neuf acheté 250 000 € et loué en <strong>loyer intermédiaire</strong>. Base amortissable : 200 000 €. Amortissement annuel : 200 000 € × 3,5 % = 7 000 €, sous le plafond de 8 000 €. Le bailleur déduit donc 7 000 € de ses revenus fonciers chaque année, soit 63 000 € sur les neuf ans d'engagement — auxquels s'ajoutent les charges et intérêts d'emprunt déductibles dans les conditions de droit commun.</p><p>Pour tester votre propre cas, utilisez notre <a href=\"/simulateur\">simulateur d'amortissement</a>.</p>",
      },
      {
        heading: "L'engagement de location",
        body: "<p>En échange de l'avantage fiscal, le bailleur s'engage à louer le logement <strong>nu, comme résidence principale</strong> du locataire, pendant <strong>au moins neuf ans</strong>, au loyer plafonné de la catégorie choisie et au profit de locataires sous plafonds de ressources. Le non-respect de l'engagement entraîne la remise en cause de l'avantage.</p>",
      },
    ],
    faq: [
      {
        question: "L'amortissement réduit-il l'impôt directement ?",
        answer:
          "Non : il réduit le revenu foncier imposable. L'économie d'impôt dépend ensuite de votre tranche marginale d'imposition et des prélèvements sociaux. Plus votre taux d'imposition est élevé, plus l'amortissement est avantageux.",
      },
      {
        question: "Que se passe-t-il à la revente ?",
        answer:
          "L'amortissement déduit pendant la location est en principe repris dans le calcul de la plus-value à la revente. Les modalités exactes seront fixées par les textes d'application : c'est un point à vérifier avant d'investir.",
      },
    ],
  },
  {
    slug: 'conditions-eligibilite-dispositif-jeanbrun',
    title: "Conditions d'éligibilité au dispositif Jeanbrun",
    description:
      "Type de bien, location nue, engagement, plafonds de loyer et de ressources, date d'acquisition : toutes les conditions pour bénéficier du statut du bailleur privé.",
    category: 'Investir',
    publishedAt: '2026-02-18',
    lastUpdated: '2026-06-09',
    readingMinutes: 7,
    intro:
      "Le statut du bailleur privé n'est pas ouvert à tous les investissements. Logement collectif, location nue en résidence principale, engagement de neuf ans, plafonds de loyer et de ressources : voici la liste des conditions à réunir, dans le neuf comme dans l'ancien.",
    sections: [
      {
        heading: 'Un logement collectif, loué nu',
        body: "<p>Seuls les <strong>appartements en immeuble collectif</strong> sont éligibles : les maisons individuelles sont exclues. Le logement doit être loué <strong>vide</strong> (non meublé) et constituer la <strong>résidence principale</strong> du locataire. La location saisonnière et la location meublée sont donc hors champ.</p>",
      },
      {
        heading: 'Acquisitions à compter du 1er janvier 2026',
        body: "<p>Le mécanisme d'amortissement vise les logements <strong>acquis à partir du 1er janvier 2026</strong>. La date d'acquisition (et non la date de mise en location) sert de point de départ à l'éligibilité.</p>",
      },
      {
        heading: 'Plafonds de loyer et de ressources',
        body: "<p>Le bailleur choisit une catégorie de loyer — intermédiaire, social ou très social — et doit en respecter le <strong>plafond de loyer</strong> ainsi que les <strong>plafonds de ressources</strong> du locataire. Ces plafonds varient selon la zone géographique. Particularité de la version Jeanbrun : le zonage ne conditionne plus l'éligibilité (on peut investir partout), il sert seulement à fixer ces plafonds.</p>",
      },
      {
        heading: "Le cas de l'ancien : travaux et performance énergétique",
        body: "<p>L'ancien est éligible, mais sous conditions renforcées : des <strong>travaux représentant au moins 30 % du prix</strong> du logement, permettant d'atteindre une étiquette <strong>DPE A, B ou C</strong> après rénovation. L'objectif est d'orienter les capitaux vers la remise sur le marché de logements performants.</p>",
      },
      {
        heading: "L'engagement de 9 ans",
        body: "<p>La location au loyer plafonné doit être maintenue <strong>pendant au moins neuf ans</strong>. C'est la durée pendant laquelle l'amortissement est pratiqué et l'engagement contrôlé.</p>",
      },
    ],
    faq: [
      {
        question: 'Une maison individuelle est-elle éligible ?',
        answer:
          "Non. Dans sa version adoptée, le dispositif Jeanbrun réserve l'amortissement aux logements situés en immeuble collectif. Les maisons individuelles sont exclues.",
      },
      {
        question: 'Peut-on investir hors zone tendue ?',
        answer:
          "Oui. Le zonage ne conditionne plus l'éligibilité : l'investissement est possible partout en France, à condition de respecter les plafonds de loyer et de ressources de la zone concernée.",
      },
    ],
  },
  {
    slug: 'neuf-ou-ancien-dispositif-jeanbrun',
    title: 'Dispositif Jeanbrun : faut-il investir dans le neuf ou dans l’ancien ?',
    description:
      "Taux d'amortissement plus élevés dans le neuf, travaux obligatoires dans l'ancien : comparatif des deux voies du statut du bailleur privé pour choisir la bonne stratégie.",
    category: 'Comparer',
    publishedAt: '2026-03-03',
    lastUpdated: '2026-06-08',
    readingMinutes: 6,
    intro:
      "Le statut du bailleur privé s'applique au neuf comme à l'ancien, mais pas aux mêmes conditions. Le neuf offre des taux d'amortissement plus élevés ; l'ancien rénové ouvre des opportunités dans les centres-villes, à condition de réaliser des travaux lourds. Comment arbitrer ?",
    sections: [
      {
        heading: 'Des taux plus élevés dans le neuf',
        body: "<p>Le neuf bénéficie des meilleurs taux : 3,5 % (intermédiaire), 4,5 % (social) et 5,5 % (très social) par an. L'ancien rénové est un cran en dessous : 3 %, 3,5 % et 4 %. À prix égal, l'avantage fiscal annuel est donc supérieur dans le neuf.</p>",
      },
      {
        heading: "L'ancien suppose des travaux d'au moins 30 %",
        body: "<p>Pour être éligible dans l'ancien, il faut engager des <strong>travaux représentant au moins 30 % du prix</strong> et atteindre un <strong>DPE A, B ou C</strong>. Cette contrainte renchérit le projet mais permet de cibler des emplacements de centre-ville rares dans le neuf, et de créer de la valeur via la rénovation.</p>",
      },
      {
        heading: 'Coûts annexes et délais',
        body: "<p>Le neuf s'accompagne de frais de notaire réduits et de garanties constructeur, mais d'un délai de livraison et d'un prix au m² plus élevé. L'ancien implique un chantier (donc un risque de dépassement et de délai) mais un prix d'entrée souvent plus bas et un emplacement établi.</p>",
      },
      {
        heading: 'Quelle voie choisir ?',
        body: "<p>Schématiquement : le <strong>neuf</strong> conviendra à l'investisseur qui privilégie la simplicité et le rendement fiscal maximal ; l'<strong>ancien rénové</strong> à celui qui vise un emplacement premium et sait piloter des travaux. Dans les deux cas, l'équation finale dépend de votre tranche d'imposition et du loyer de marché : testez les scénarios dans le <a href=\"/simulateur\">simulateur</a>.</p>",
      },
    ],
    faq: [
      {
        question: "L'amortissement est-il plus intéressant dans le neuf ?",
        answer:
          "À catégorie de loyer égale, oui : les taux sont supérieurs dans le neuf (jusqu'à 5,5 % contre 4 % dans l'ancien). Mais le prix d'achat au m² et l'emplacement comptent autant que le taux dans la rentabilité finale.",
      },
      {
        question: "Quels travaux sont exigés dans l'ancien ?",
        answer:
          "Des travaux représentant au moins 30 % du prix d'acquisition et permettant d'atteindre une étiquette DPE A, B ou C après rénovation.",
      },
    ],
  },
  {
    slug: 'dispositif-jeanbrun-vs-pinel-lmnp',
    title: 'Dispositif Jeanbrun, Pinel, LMNP : quelles différences ?',
    description:
      "Réduction d'impôt, amortissement, meublé ou nu : ce qui distingue le statut du bailleur privé de l'ancien Pinel et du régime LMNP, pour bien comprendre le changement de logique.",
    category: 'Comparer',
    publishedAt: '2026-03-20',
    lastUpdated: '2026-06-11',
    readingMinutes: 7,
    intro:
      "Le statut du bailleur privé succède au Pinel, arrêté fin 2024, mais ne fonctionne pas du tout pareil. Et il emprunte au LMNP sa logique d'amortissement, sans en partager le régime fiscal. Décryptage des trois approches.",
    sections: [
      {
        heading: 'Pinel : une réduction d’impôt, désormais terminée',
        body: "<p>Le Pinel accordait une <strong>réduction d'impôt</strong> proportionnelle au prix, en échange d'un engagement de location plafonnée. Il a pris fin le <strong>31 décembre 2024</strong>. Sa logique : un avantage forfaitaire calculé sur le prix, plafonné par les niches fiscales.</p>",
      },
      {
        heading: 'Jeanbrun : un amortissement déduit du revenu foncier',
        body: "<p>Le dispositif Jeanbrun ne réduit pas l'impôt directement : il <strong>diminue le revenu foncier imposable</strong> via un amortissement annuel. L'économie réelle dépend donc de votre tranche marginale d'imposition. Pour un contribuable fortement imposé, l'effet peut être supérieur à celui du Pinel ; pour un contribuable peu imposé, il l'est moins.</p>",
      },
      {
        heading: 'LMNP : la même idée, mais en meublé',
        body: "<p>Le <strong>LMNP</strong> permet déjà d'amortir un bien, mais en <strong>location meublée</strong>, imposée en BIC. Le statut du bailleur privé transpose l'amortissement à la <strong>location nue</strong> (revenus fonciers). Les deux régimes ne se cumulent pas sur un même bien : il faut choisir nu (Jeanbrun) ou meublé (LMNP).</p>",
      },
      {
        heading: 'Tableau récapitulatif',
        body: "<div class=\"table-wrap\"><table><thead><tr><th>Critère</th><th>Pinel (terminé)</th><th>Dispositif Jeanbrun</th><th>LMNP</th></tr></thead><tbody><tr><td>Avantage</td><td>Réduction d'impôt</td><td>Amortissement (revenu foncier)</td><td>Amortissement (BIC)</td></tr><tr><td>Location</td><td>Nue</td><td>Nue</td><td>Meublée</td></tr><tr><td>Loyer plafonné</td><td>Oui</td><td>Oui</td><td>Non</td></tr><tr><td>Statut</td><td>Clos depuis 2025</td><td>En vigueur 2026</td><td>En vigueur</td></tr></tbody></table></div>",
      },
    ],
    faq: [
      {
        question: 'Le dispositif Jeanbrun est-il plus avantageux que le Pinel ?',
        answer:
          "Cela dépend de votre fiscalité. Le Pinel offrait une réduction d'impôt forfaitaire ; Jeanbrun offre un amortissement dont la valeur croît avec votre tranche d'imposition. Les contribuables fortement imposés y trouvent généralement un intérêt supérieur.",
      },
      {
        question: 'Peut-on faire du LMNP et du Jeanbrun en même temps ?',
        answer:
          "Pas sur le même logement : le LMNP suppose une location meublée (BIC) et le dispositif Jeanbrun une location nue (revenus fonciers). Vous pouvez en revanche détenir des biens différents sous chaque régime.",
      },
    ],
  },
];
