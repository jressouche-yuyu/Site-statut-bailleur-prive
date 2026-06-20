/**
 * Configuration de la veille d'actualités automatique (scripts/publish-news.mjs).
 *
 * C'est LE fichier à éditer pour piloter la routine : sources, cadence, persona,
 * maillage interne, modèle. Aucune logique ici, uniquement des réglages.
 */

export const config = {
  // ─────────────────────────────────────────────────────────────────────────
  // CADENCE — comportement « humain »
  // ─────────────────────────────────────────────────────────────────────────
  /** Objectif d'articles par semaine (un nombre est tiré au hasard dans [min,max]
   *  pour chaque semaine ISO → certaines semaines 1, d'autres 2 ou 3). */
  minPerWeek: 1,
  maxPerWeek: 3,
  /** Heures de publication autorisées (Europe/Paris, 24h). On ne publie JAMAIS
   *  en dehors : pas de mise en ligne la nuit. */
  publishHours: { start: 8, end: 19 },
  /** Jours actifs (1 = lundi … 7 = dimanche). Par défaut, jours ouvrés. */
  activeDays: [1, 2, 3, 4, 5],
  /** Nombre de passages planifiés par jour actif (doit refléter le cron de la
   *  Routine). Sert à étaler la probabilité de publication sur la semaine. */
  runsPerDay: 2,
  /** Probabilité de publier deux articles le même jour (sinon on étale). */
  sameDayChance: 0.15,

  // ─────────────────────────────────────────────────────────────────────────
  // ÉDITORIAL
  // ─────────────────────────────────────────────────────────────────────────
  persona:
    "Un particulier français de 35 à 60 ans, imposé (tranche à 30 % ou plus), " +
    "disposant d'une capacité d'épargne ou d'un apport, qui envisage un " +
    "investissement locatif pour réduire ses impôts et se constituer un " +
    "patrimoine. Il connaît mal les dispositifs fiscaux et cherche une " +
    "information claire, fiable et sans jargon.",
  tone:
    "neutre, pédagogique et factuel : on décrypte l'information, on explique " +
    "ce qu'elle signifie concrètement, puis on montre en quoi elle concerne " +
    "l'investisseur potentiel — sans survendre ni donner de conseil financier personnalisé.",

  // ─────────────────────────────────────────────────────────────────────────
  // MAILLAGE INTERNE — toujours 2 à 3 liens, la page pilier TOUJOURS présente
  // ─────────────────────────────────────────────────────────────────────────
  /** Nombre de liens internes par article (brief 2026 : 3 à 5). */
  internalLinks: { min: 3, max: 5 },
  /** Page stratégique à pousser dans CHAQUE article (lien prioritaire). */
  strategicPage: {
    url: '/dispositif-jeanbrun',
    label: 'le statut du bailleur privé (dispositif Jeanbrun)',
  },
  /** Liens secondaires possibles (1 à 2 sont tirés au hasard selon le sujet). */
  secondaryLinks: [
    { url: '/simulateur', topic: 'simuler le gain fiscal du dispositif' },
    { url: '/eligibilite', topic: "tester son éligibilité au dispositif" },
    { url: '/guides/comment-fonctionne-statut-bailleur-prive', topic: 'le fonctionnement détaillé du statut' },
    { url: '/guides/plafonds-loyer-ressources-dispositif-jeanbrun', topic: 'les plafonds de loyer et de ressources' },
    { url: '/guides/rentabilite-dispositif-jeanbrun-exemple-chiffre', topic: 'la rentabilité avec un exemple chiffré' },
    { url: '/guides/conditions-eligibilite-dispositif-jeanbrun', topic: "les conditions d'éligibilité" },
    { url: '/guides/dispositif-jeanbrun-vs-pinel-lmnp', topic: 'la comparaison avec le Pinel et le LMNP' },
    { url: '/guides/risques-limites-dispositif-jeanbrun', topic: 'les risques et limites du dispositif' },
    { url: '/guides/ou-investir-dispositif-jeanbrun-departements', topic: 'les territoires où investir' },
    { url: '/guides/neuf-ou-ancien-dispositif-jeanbrun', topic: 'le choix entre neuf et ancien' },
    { url: '/faq', topic: 'les questions fréquentes' },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // VEILLE — sources RSS et pertinence
  // ─────────────────────────────────────────────────────────────────────────
  /** Domaines de sources à privilégier lors de la recherche web (actu éco /
   *  immo / fiscalité françaises). La Routine s'en sert pour cibler sa veille. */
  preferredSources: [
    'service-public.fr', 'economie.gouv.fr', 'impots.gouv.fr', 'anil.org',
    'lesechos.fr', 'lefigaro.fr', 'lemonde.fr', 'moneyvox.fr', 'pap.fr',
    'seloger.com', 'capital.fr', 'boursorama.com', 'batiactu.com', 'fnaim.fr',
  ],
  /** Mots-clés de pertinence : un candidat doit en contenir au moins un. */
  keywords: [
    'bailleur', 'location', 'locatif', 'immobilier', 'logement', 'loyer',
    'fiscalité', 'fiscal', 'impôt', 'défiscalisation', 'amortissement',
    'loi de finances', 'budget', 'investissement locatif', 'pinel', 'lmnp',
    'jeanbrun', 'propriétaire', 'parc locatif', 'déficit foncier', 'plus-value',
    'passoire', 'dpe', 'rénovation énergétique', 'crédit immobilier', 'notaire',
  ],
  /** Mots-clés prioritaires : boost de pertinence (sujets au cœur du site). */
  priorityKeywords: [
    'bailleur privé', 'jeanbrun', 'statut du bailleur', 'investissement locatif',
    'défiscalisation', 'loi de finances', 'amortissement',
  ],
  /** Fenêtre de fraîcheur : on ne considère que les actus de moins de N jours. */
  freshnessDays: 21,

  // ─────────────────────────────────────────────────────────────────────────
  // RÉDACTION
  // ─────────────────────────────────────────────────────────────────────────
  /** Longueur cible en mots (à varier dans l'intervalle → évite l'uniformité). */
  wordRange: { min: 450, max: 850 },
  /** Angles éditoriaux possibles (en varier un à chaque article). */
  angles: [
    "ce qui change concrètement et les implications pour l'investisseur",
    "un décryptage chiffré avec ordres de grandeur",
    "une mise en perspective avec les dispositifs existants",
    "les points de vigilance et les idées reçues à corriger",
    "ce que cela signifie pour qui veut se lancer maintenant",
    "un format questions / réponses sur le sujet",
    "le contexte, les acteurs concernés et le calendrier",
  ],
  /** Sources officielles à citer visiblement (champ `sources` du frontmatter). */
  officialSources: [
    { label: 'Légifrance', url: 'https://www.legifrance.gouv.fr/' },
    { label: 'service-public.fr', url: 'https://www.service-public.fr/' },
    { label: 'economie.gouv.fr', url: 'https://www.economie.gouv.fr/' },
    { label: 'impots.gouv.fr', url: 'https://www.impots.gouv.fr/' },
    { label: 'ANIL', url: 'https://www.anil.org/' },
  ],
  /** Signature des articles. */
  author: 'La rédaction Bailleur Privé',
};
