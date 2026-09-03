/**
 * Comparatifs de dispositifs — Jeanbrun face aux autres régimes locatifs.
 *
 * Ces pages visent l'intention comparative (« jeanbrun ou denormandie »,
 * « statut bailleur privé ou déficit foncier »), un terrain où le site a un
 * avantage réel : le Jeanbrun est récent, donc personne ne l'occupe encore.
 *
 * RÈGLE DE RÉDACTION, non négociable : chaque chiffre provient d'une source
 * officielle ouverte et vérifiée. Ce qui n'est pas établi est écrit comme tel,
 * dans une section dédiée. Une page de comparaison qui masque ses incertitudes
 * ne vaut pas mieux qu'une page de promoteur — et le site n'a que sa
 * crédibilité à vendre.
 *
 * NE PAS PUBLIER, faute de source ouverte : les plafonds de loyer social et
 * très social (fixés commune par commune), les plafonds LLI en meublé, l'état
 * du LLI après recodification, quoi que ce soit sur le PLF 2027, et le sort du
 * dispositif au regard du plafonnement global des niches (art. 200-0 A).
 */

const RELU = '2026-09-02';

export const comparatifs = [
  {
    slug: 'jeanbrun-vs-denormandie',
    title: 'Jeanbrun ou Denormandie : lequel choisir pour un bien ancien ?',
    description:
      "Amortissement contre réduction d'impôt : ce qui sépare vraiment le statut du bailleur privé du dispositif Denormandie, et le profil pour lequel chacun l'emporte.",
    category: 'Comparer' as const,
    publishedAt: RELU,
    lastUpdated: RELU,
    readingMinutes: 8,
    intro:
      "Les deux visent l'ancien avec travaux et partagent le même barème de loyer intermédiaire. Mais l'un accorde une déduction en base, dont la valeur dépend de votre tranche marginale, et l'autre une réduction d'impôt calculée sur le prix, identique quelle que soit votre imposition. C'est cette différence, et non les taux affichés, qui décide.",
    sections: [
      {
        heading: 'La différence de fond : déduction en base contre réduction d’impôt',
        body: "<p>Le <strong>statut du bailleur privé</strong> déduit chaque année une fraction du prix de vos <em>revenus fonciers</em>. Sa valeur réelle est donc votre taux d'imposition : à 30 % de tranche marginale plus 17,2 % de prélèvements sociaux, 1 000 € déduits valent 472 € d'impôt évité. À 11 % de tranche, ils n'en valent que 282 €.</p><p>Le <strong>Denormandie</strong> accorde une <strong>réduction d'impôt</strong> : un pourcentage du prix, retranché directement de l'impôt dû, quelle que soit votre tranche. 18 % de 200 000 €, c'est 36 000 € pour tout le monde.</p><p>Conséquence directe : <strong>en dessous de 30 % de tranche marginale, le Denormandie l'emporte presque mécaniquement.</strong> C'est le premier calcul à faire, avant même de regarder les conditions.</p>",
      },
      {
        heading: 'Les taux du Denormandie',
        body: "<p>La réduction dépend de la durée d'engagement de location :</p><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">Durée de location</th><th scope=\"col\">Réduction d'impôt</th></tr></thead><tbody><tr><th scope=\"row\">6 ans</th><td>12 % du prix</td></tr><tr><th scope=\"row\">9 ans</th><td>18 % du prix</td></tr><tr><th scope=\"row\">12 ans</th><td>21 % du prix</td></tr></tbody></table></div><p>Le prix retenu est plafonné à <strong>300 000 €</strong> et à <strong>5 500 € par m²</strong> de surface habitable. Les travaux doivent représenter au moins <strong>25 % du coût total de l'opération</strong>, et l'acquisition intervenir avant le <strong>31 décembre 2027</strong>.</p><p class=\"note-inline\">Ces valeurs proviennent de la fiche officielle service-public.gouv.fr, vérifiée le 11 mars 2026. La doctrine administrative publiée au BOFiP porte encore une échéance au 31 décembre 2026 : elle n'est pas à jour du texte.</p>",
      },
      {
        heading: 'Les cinq critères qui font basculer le choix',
        body: "<ol><li><strong>Votre tranche marginale.</strong> Le seul critère vraiment décisif. En dessous de 30 %, le Denormandie gagne. À 41 ou 45 %, l'amortissement Jeanbrun redevient compétitif.</li><li><strong>La commune.</strong> Le Denormandie est enfermé dans une liste : communes « Action cœur de ville », communes ayant conclu une opération de revitalisation de territoire, ou présentant un besoin marqué de réhabilitation. Hors de cette liste, la comparaison n'a pas lieu d'être — seul le Jeanbrun reste.</li><li><strong>Le type de bien.</strong> La maison individuelle est éligible au Denormandie. Elle est <strong>exclue</strong> du Jeanbrun, qui exige un bâtiment d'habitation collectif.</li><li><strong>L'assiette des travaux.</strong> Denormandie : 25 % du <em>coût total de l'opération</em>. Jeanbrun, voie la plus courante : 30 % du <em>prix d'acquisition</em>. Deux bases de calcul différentes, deux résultats différents pour des travaux identiques.</li><li><strong>Le plafond.</strong> Le Jeanbrun plafonne à 8 000 € de déduction par an et <strong>par foyer fiscal</strong>, tous logements amortis confondus : un investisseur multi-biens sature vite. Le Denormandie raisonne par opération, dans la limite de 300 000 €.</li></ol>",
      },
      {
        heading: 'Qui l’emporte, selon le profil',
        body: "<p><strong>Le Denormandie l'emporte</strong> si votre tranche marginale est de 30 % ou moins, si le bien est une maison, si vous visez un horizon de 6 ans, ou si vous voulez un avantage certain et chiffrable dès la signature. Il a par ailleurs un atout que le Jeanbrun n'a pas encore : il existe depuis 2019 et dispose d'une doctrine administrative complète.</p><p><strong>Le Jeanbrun l'emporte</strong> si votre tranche est de 41 ou 45 %, si le bien se situe hors des communes éligibles au Denormandie, et s'il s'agit d'un logement collectif neuf sans travaux à engager.</p><p>Disons-le franchement : <strong>le Jeanbrun perd</strong> dès que la tranche marginale est faible, dès qu'il s'agit d'une maison individuelle, et dès que le bien se trouve dans une commune où l'investisseur a réellement le choix entre les deux.</p>",
      },
      {
        heading: 'Ce qui n’est pas tranché',
        body: "<p><strong>Le cumul des deux dispositifs sur un même logement n'a pas été vérifié</strong> sur une source officielle. Nous ne l'affirmons donc ni dans un sens ni dans l'autre.</p><p>De même, aucun commentaire administratif (BOFiP) propre au statut du bailleur privé n'a été identifié à ce jour : les modalités déclaratives, la date de départ de l'amortissement et le sort des travaux ultérieurs restent sans doctrine opposable. Le Denormandie, lui, en dispose — c'est un avantage pratique réel, qui ne figure sur aucun tableau comparatif.</p>",
      },
    ],
    faq: [
      {
        question: 'Peut-on cumuler le dispositif Jeanbrun et le Denormandie sur le même logement ?',
        answer:
          "Nous ne l'avons pas vérifié sur une source officielle et nous ne l'affirmons donc pas. C'est un point à faire trancher par un conseil avant de structurer une opération sur cette hypothèse.",
      },
      {
        question: 'À partir de quelle tranche d’imposition le Jeanbrun devient-il plus intéressant ?',
        answer:
          "En dessous de 30 % de tranche marginale, la réduction d'impôt du Denormandie l'emporte presque mécaniquement, parce qu'elle ne dépend pas de votre taux d'imposition. À 41 % et 45 %, l'amortissement Jeanbrun redevient compétitif. Entre les deux, le calcul dépend du prix, des travaux et de la commune.",
      },
      {
        question: 'Le Denormandie est-il encore ouvert en 2026 ?',
        answer:
          "Oui. Le texte prévoit des acquisitions jusqu'au 31 décembre 2027. Attention : la doctrine administrative publiée au BOFiP porte encore une échéance au 31 décembre 2026, et une page ministérielle affiche toujours 2022. C'est le texte de loi qui fait foi.",
      },
    ],
  },

  {
    slug: 'jeanbrun-vs-deficit-foncier',
    title: 'Jeanbrun ou déficit foncier : lequel efface le plus d’impôt ?',
    description:
      "Le déficit foncier s'impute sur le revenu global, l'amortissement Jeanbrun seulement sur les revenus fonciers. Cette seule différence décide de la plupart des cas.",
    category: 'Comparer' as const,
    publishedAt: RELU,
    lastUpdated: RELU,
    readingMinutes: 8,
    intro:
      "Les deux réduisent la base imposable d'une location nue au régime réel. Mais l'un déduit des dépenses réellement décaissées et efface du salaire ; l'autre déduit une fraction du prix, sans rien décaisser, et n'efface que du revenu foncier. Pour un premier investissement, l'écart est considérable — et rarement dans le sens attendu.",
    sections: [
      {
        heading: 'Le point d’imputation : le critère décisif, et le plus mal compris',
        body: "<p>C'est ici que tout se joue. Le <strong>déficit foncier</strong> s'impute sur le <strong>revenu global</strong> : il efface de votre salaire, jusqu'à 10 700 € par an. L'amortissement du <strong>statut du bailleur privé</strong> s'impute <strong>dans la catégorie foncière</strong> : il ne peut effacer que des revenus fonciers.</p><p>Conséquence pratique, et elle est brutale : <strong>un premier investisseur sans autres revenus fonciers ne tire quasiment rien du Jeanbrun la première année.</strong> L'amortissement excède son revenu foncier, l'excédent est reporté sur les années suivantes, et son impôt de l'année ne bouge pas. Le déficit foncier, lui, mord immédiatement sur son impôt sur le revenu.</p><p>C'est la raison pour laquelle notre <a href=\"/simulateur\">simulateur</a> affiche parfois une économie annuelle très faible : ce n'est pas un bug, c'est le mécanisme.</p>",
      },
      {
        heading: 'Les plafonds du déficit foncier',
        body: "<p>Le plafond d'imputation sur le revenu global est de <strong>10 700 €</strong> par an en régime de droit commun. Un plafond relevé à <strong>21 400 €</strong> existe pour les travaux de rénovation énergétique permettant à un logement classé E, F ou G d'atteindre A, B, C ou D. Ce montant est un <strong>plafond global, pas un supplément</strong> qui s'ajouterait aux 10 700 €.</p><p>L'excédent non imputé se reporte pendant <strong>10 ans</strong>, mais uniquement sur des revenus fonciers. Le logement doit rester loué jusqu'au 31 décembre de la troisième année suivant l'imputation ; un passage en meublé vaut rupture.</p><p><strong>Point d'erreur fréquent :</strong> les intérêts d'emprunt ne sont <em>jamais</em> imputables sur le revenu global. Ils ne se déduisent que des revenus fonciers.</p>",
      },
      {
        heading: 'Les quatre autres critères',
        body: "<ol><li><strong>La trésorerie.</strong> Le déficit foncier suppose de décaisser des travaux. L'amortissement Jeanbrun ne coûte rien chaque année. À gain fiscal comparable, l'un immobilise du capital, l'autre non.</li><li><strong>Les contraintes.</strong> Le déficit foncier n'impose <em>aucun</em> plafond de loyer, aucun plafond de ressources, aucun zonage, aucune condition de logement collectif — seulement trois ans de maintien en location. Le Jeanbrun impose loyer plafonné, locataire sous plafond de ressources, neuf ans, collectif, et interdit la location à un parent jusqu'au deuxième degré. Le déficit foncier est de très loin le plus libre.</li><li><strong>La sortie.</strong> À la revente, le prix d'acquisition du bien amorti est minoré des amortissements déduits : la plus-value imposable est mécaniquement gonflée. Le déficit foncier n'a pas cet effet. À la sortie, il est plus propre.</li><li><strong>Le plafonnement global des niches fiscales.</strong> Le déficit foncier en est hors champ, c'est établi. Le sort du statut du bailleur privé au regard de ce plafonnement <strong>n'est pas vérifié</strong> — et l'argument « c'est une déduction, donc c'est hors plafond » est faux en soi.</li></ol>",
      },
      {
        heading: 'Qui l’emporte, selon le profil',
        body: "<p><strong>Le déficit foncier l'emporte</strong> pour l'acheteur d'un bien à rénover lourdement, fortement salarié, qui veut un effet immédiat sur son impôt sur le revenu et qui n'accepte pas de plafonner son loyer.</p><p><strong>Le Jeanbrun l'emporte</strong> pour l'acheteur de neuf, sans travaux à engager, qui dispose <em>déjà</em> de revenus fonciers à neutraliser et accepte neuf ans de loyer encadré.</p><p>Il faut le dire nettement : <strong>le Jeanbrun perd presque toujours</strong> quand le bailleur n'a pas encore de revenus fonciers, quand le bien exige de gros travaux, et quand le bailleur refuse le plafonnement du loyer. Ces trois cas sont très fréquents.</p>",
      },
      {
        heading: 'Ce qui n’est pas tranché',
        body: "<p><strong>Une divergence entre sources officielles n'est pas résolue à ce jour</strong> sur la fenêtre du plafond relevé à 21 400 €. La loi de finances pour 2026 vise les dépenses payées entre le 1<sup>er</sup> janvier 2026 et le 31 décembre 2027, tandis que le décret d'application et la doctrine administrative publiée en septembre 2025 portent toujours une fenêtre 2023-2025. Les deux lectures produisent des résultats opposés pour qui a payé ses travaux en 2024 ou 2025.</p><p>Nous exposons les deux plutôt que d'en choisir une. Sur ce point précis, un professionnel est indispensable.</p><p>Ne sont pas non plus vérifiés : l'articulation exacte entre l'amortissement du statut du bailleur privé et le déficit foncier de droit commun, l'effet du déficit foncier sur les prélèvements sociaux, et le traitement des aides MaPrimeRénov' perçues sur les mêmes travaux.</p>",
      },
    ],
    faq: [
      {
        question: 'Le déficit foncier permet-il vraiment de baisser son impôt sur le salaire ?',
        answer:
          "Oui, à hauteur de 10 700 € par an (21 400 € pour certains travaux de rénovation énergétique). C'est sa différence essentielle avec l'amortissement du statut du bailleur privé, qui ne s'impute que sur des revenus fonciers.",
      },
      {
        question: 'Les intérêts d’emprunt entrent-ils dans le déficit foncier imputable sur le revenu global ?',
        answer:
          "Non. Les intérêts d'emprunt se déduisent des revenus fonciers, mais ne sont jamais imputables sur le revenu global. C'est une erreur de calcul très répandue.",
      },
      {
        question: 'Peut-on combiner amortissement Jeanbrun et déficit foncier ?',
        answer:
          "L'articulation exacte des deux mécanismes n'est pas établie sur une source officielle ouverte. Nous ne l'affirmons pas. C'est un point à faire valider avant de bâtir un montage dessus.",
      },
    ],
  },

  {
    slug: 'jeanbrun-vs-loc-avantages',
    title: 'Jeanbrun ou Loc’Avantages : faut-il acheter pour défiscaliser ?',
    description:
      "Loc'Avantages ne suppose aucune acquisition et paie un pourcentage des loyers ; le Jeanbrun exige un achat récent et paie un pourcentage du prix. Comparaison des deux logiques.",
    category: 'Comparer' as const,
    publishedAt: RELU,
    lastUpdated: RELU,
    readingMinutes: 7,
    intro:
      "Pour un bailleur déjà propriétaire, la comparaison est close avant d'avoir commencé : le statut du bailleur privé exige une acquisition postérieure au 21 février 2026, Loc'Avantages fonctionne sur un bien déjà en portefeuille. Pour un acquéreur, en revanche, le choix se calcule — et il tient à un seul rapport.",
    sections: [
      {
        heading: 'Deux assiettes opposées : les loyers contre le prix',
        body: "<p>Loc'Avantages accorde une <strong>réduction d'impôt assise sur les loyers bruts</strong> encaissés. Le statut du bailleur privé accorde une <strong>déduction assise sur le prix d'acquisition</strong>.</p><p>Le point de bascule se calcule donc simplement : c'est le <strong>rapport entre le loyer annuel et le prix du bien</strong>. Sur un bien acheté peu cher et bien loué, Loc'Avantages gagne largement. Sur un bien cher faiblement loué, le Jeanbrun l'emporte.</p>",
      },
      {
        heading: 'Les taux de Loc’Avantages',
        body: "<p>La réduction dépend du niveau de loyer consenti et du recours ou non à l'intermédiation locative :</p><div class=\"table-wrap\"><table><thead><tr><th scope=\"col\">Niveau</th><th scope=\"col\">Sans intermédiation</th><th scope=\"col\">Avec intermédiation</th></tr></thead><tbody><tr><th scope=\"row\">Loc1</th><td>15 %</td><td>20 %</td></tr><tr><th scope=\"row\">Loc2</th><td>35 %</td><td>40 %</td></tr><tr><th scope=\"row\">Loc3</th><td>—</td><td>65 %</td></tr></tbody></table></div><p>Les <strong>65 % de Loc3 ne sont pas accessibles en gestion directe</strong> : ils supposent l'intermédiation locative obligatoire, donc une perte partielle du choix du locataire. Le Jeanbrun, lui, laisse le bailleur choisir son locataire sous plafonds de ressources.</p><p>L'engagement est de <strong>6 ans</strong>, contre 9 ans pour le Jeanbrun. Les demandes de conventionnement sont enregistrées jusqu'au <strong>31 décembre 2027</strong>.</p>",
      },
      {
        heading: 'Le plafonnement global change la donne',
        body: "<p>Loc'Avantages entre dans le <strong>plafonnement global des niches fiscales</strong>, fixé à 10 000 € par an. En Loc3, une réduction de 65 % des loyers bruts atteint ce plafond dès environ <strong>15 400 € de loyers annuels</strong> : au-delà, l'avantage supplémentaire est perdu. Le plafond mord donc vite.</p><p>Le sort du statut du bailleur privé au regard de ce même plafonnement <strong>n'est pas établi</strong>. Nous ne publions rien à ce sujet, et nous mettons en garde contre le raisonnement courant selon lequel « une déduction en base échappe par nature au plafonnement » : la doctrine administrative range certaines déductions pour investissement locatif dans le champ du plafonnement.</p>",
      },
      {
        heading: 'Qui l’emporte, selon le profil',
        body: "<p><strong>Loc'Avantages l'emporte</strong> pour le bailleur déjà propriétaire, fortement imposé, dans une commune où le loyer de marché est élevé — c'est là que la décote coûte le moins cher en loyer réellement perdu — et prêt à passer par l'intermédiation locative.</p><p><strong>Le Jeanbrun l'emporte</strong> pour l'acquéreur d'un logement collectif neuf ou lourdement rénové.</p><p><strong>Le Jeanbrun perd</strong> chaque fois que le bailleur ne veut pas acheter, et sur les biens à fort rendement locatif rapporté au prix.</p>",
      },
      {
        heading: 'Une question bloquante, non tranchée',
        body: "<p>Le texte de Loc'Avantages exclut le cumul avec certaines déductions spécifiques de l'article 31 du code général des impôts, désignées par une plage de rubriques. Cette rédaction <strong>engloberait mécaniquement</strong> les rubriques qui portent le statut du bailleur privé, ce qui rendrait le cumul impossible sur un même logement.</p><p>Cette lecture est plausible mais <strong>nous ne l'avons pas vérifiée sur le texte lui-même</strong>. Elle est structurante : si elle se confirme, la question « lequel choisir » ne se pose pas seulement en opportunité, mais en droit. À faire trancher avant tout montage.</p><p>Ne sont pas non plus établis : le sort d'une réduction supérieure à l'impôt dû, l'articulation avec les subventions de l'Anah, et les plafonds de loyer applicables commune par commune — qui doivent être consultés sur le simulateur officiel.</p>",
      },
    ],
    faq: [
      {
        question: 'Faut-il acheter un bien pour bénéficier de Loc’Avantages ?',
        answer:
          "Non, et c'est sa différence principale avec le statut du bailleur privé. Loc'Avantages s'applique à un logement que vous détenez déjà, alors que le Jeanbrun exige une acquisition réalisée entre le 21 février 2026 et le 31 décembre 2028.",
      },
      {
        question: 'Les 65 % de réduction de Loc3 sont-ils accessibles à tous ?',
        answer:
          "Non. Le niveau Loc3 suppose l'intermédiation locative, c'est-à-dire le passage par un organisme agréé qui vous propose les candidats. Vous perdez une partie du choix du locataire. En gestion directe, le taux maximal est de 35 %.",
      },
      {
        question: 'Peut-on cumuler Loc’Avantages et le statut du bailleur privé ?',
        answer:
          "Une lecture du texte de Loc'Avantages suggère que le cumul serait exclu sur un même logement, mais nous ne l'avons pas vérifié sur la source elle-même. Ne bâtissez pas un montage sur l'hypothèse du cumul sans avis professionnel.",
      },
    ],
  },

  {
    slug: 'jeanbrun-vs-lli',
    title: 'Jeanbrun ou LLI : le logement intermédiaire est-il ouvert aux particuliers ?',
    description:
      "Le logement locatif intermédiaire exige une personne morale et immobilise vingt ans. Ce que cela change face au statut du bailleur privé, accessible en nom propre.",
    category: 'Comparer' as const,
    publishedAt: RELU,
    lastUpdated: RELU,
    readingMinutes: 7,
    intro:
      "Le logement locatif intermédiaire revient souvent dans les argumentaires destinés aux particuliers. Un critère élimine pourtant la majorité d'entre eux avant tout calcul : il faut une personne morale. Et la durée réelle d'exposition dépasse largement celle qu'on annonce généralement.",
    sections: [
      {
        heading: 'La forme de détention : le critère éliminatoire',
        body: "<p>Le LLI suppose une <strong>personne morale</strong> — SCI soumise à l'impôt sur les sociétés, SARL de famille, société dédiée. Un particulier qui achète en nom propre en est exclu, sans discussion possible.</p><p>Ce n'est pas une formalité : constituer et faire vivre une société implique des frais de constitution, une comptabilité, des déclarations annuelles, et un régime fiscal de sortie différent. Pour la très large majorité des lecteurs de ce site, qui investissent en direct, la comparaison s'arrête ici et le <a href=\"/dispositif-jeanbrun\">statut du bailleur privé</a> est le seul des deux accessible.</p>",
      },
      {
        heading: 'La nature du gain : un prix d’achat, pas un impôt',
        body: "<p>Le LLI donne une <strong>TVA à 10 % au lieu de 20 %</strong> sur l'acquisition, à quoi s'ajoute une créance d'impôt sur les sociétés correspondant à la taxe foncière, pendant vingt ans. C'est un gain sur le <em>prix</em>, encaissé une fois, à l'achat.</p><p>Le Jeanbrun donne une <strong>déduction annuelle</strong>, dont la valeur dépend de votre taux d'imposition. C'est un gain sur l'<em>impôt</em>, étalé.</p><p><strong>Point souvent passé sous silence :</strong> la créance d'impôt sur les sociétés reste acquise à la <em>société</em> et n'est pas transmise aux associés. Un associé personne physique ne l'impute pas sur son propre impôt. Cela vide de sa substance l'argument commercial du « LLI pour particuliers ».</p>",
      },
      {
        heading: 'La durée réelle d’exposition : vingt ans, pas quinze',
        body: "<p>La communication commerciale parle couramment d'un « engagement de 15 ans ». C'est inexact, et l'écart n'est pas anodin.</p><p>Le risque de reversement d'un complément de TVA court sur <strong>vingt ans</strong>. Par ailleurs, les cessions sont bridées à 50 % des logements pendant les <strong>quinze premières</strong> années. Le LLI immobilise donc plus de deux fois plus longtemps que le Jeanbrun et ses neuf ans.</p>",
      },
      {
        heading: 'Qui l’emporte, selon le profil',
        body: "<p><strong>Le LLI l'emporte</strong> pour l'investisseur qui dispose déjà d'une société, vise un horizon de vingt ans, et achète en zone très tendue où dix points de TVA pèsent plus lourd que la décote de loyer consentie.</p><p><strong>Le Jeanbrun l'emporte</strong> pour l'investisseur en nom propre — c'est-à-dire l'immense majorité des particuliers.</p><p><strong>Le Jeanbrun perd</strong> sur les gros tickets en zone A bis détenus en société, où l'économie de TVA à l'achat dépasse largement 8 000 € par an d'assiette déductible, et où l'horizon de vingt ans est assumé.</p>",
      },
      {
        heading: 'Ce que nous ne publions pas, et pourquoi',
        body: "<p>La base légale du LLI est <strong>en cours de recodification</strong>, et deux administrations donnent deux dates différentes pour le transfert. Nous ne publions donc rien sur l'état du dispositif après cette recodification, ni de référence d'article présentée comme durablement valide.</p><p>Nous ne publions pas non plus les plafonds de loyer en meublé : le décret existe, mais nous n'avons pas pu vérifier les valeurs revalorisées pour 2026.</p><p>Enfin, le traitement fiscal des revenus selon la forme sociale retenue — amortissement comptable, taux d'impôt sur les sociétés, régime de plus-value professionnelle — n'a pas été vérifié sur source officielle, alors que c'est le facteur décisif de rentabilité d'une opération en LLI. Sur ce montage plus que sur tout autre, un expert-comptable n'est pas optionnel.</p>",
      },
    ],
    faq: [
      {
        question: 'Un particulier peut-il investir en LLI en nom propre ?',
        answer:
          "Non. Le logement locatif intermédiaire suppose une personne morale : SCI à l'impôt sur les sociétés, SARL de famille ou société dédiée. En nom propre, seul le statut du bailleur privé est accessible parmi les deux.",
      },
      {
        question: 'Combien de temps le LLI immobilise-t-il l’investissement ?',
        answer:
          "Plus longtemps que ne l'annoncent les argumentaires commerciaux : le risque de complément de TVA court sur vingt ans, et les cessions sont limitées à 50 % des logements pendant les quinze premières années. Le statut du bailleur privé, lui, demande neuf ans.",
      },
      {
        question: 'La créance d’impôt liée à la taxe foncière bénéficie-t-elle aux associés ?',
        answer:
          "Non. Elle reste acquise à la société et n'est pas transmise aux associés : un associé personne physique ne peut pas l'imputer sur son impôt personnel.",
      },
    ],
  },
];
