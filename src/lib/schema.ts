/**
 * Fabriques de données structurées schema.org (JSON-LD).
 *
 * Les données structurées sont déterminantes pour le SEO (rich results) et le
 * GEO : elles donnent aux moteurs génératifs un contenu factuel, désambiguïsé
 * et directement citable. On privilégie les types les plus exploités :
 * Organization, WebSite, BreadcrumbList, Article, FAQPage, HowTo, ItemList.
 */
import { SITE } from '../consts';
import type { Guide } from '../data/guides';

const abs = (path: string) => new URL(path, SITE.url).href;

/** Schéma éditeur du site (E-E-A-T). À inclure sur toutes les pages. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    sameAs: Object.values(SITE.social),
  };
}

/** Schéma WebSite. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

/** Fil d'Ariane structuré. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** FAQ structurée — fortement reprise dans les AI Overviews et les réponses génératives. */
export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Tutoriel pas-à-pas → schéma HowTo, très exploité par les moteurs génératifs (GEO). */
export function howToSchema(howTo: {
  name: string;
  description: string;
  steps: { title: string; body: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.body,
    })),
  };
}

/** Article éditorial (guides). */
export function articleSchema(guide: Guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: SITE.lang,
    datePublished: guide.publishedAt,
    dateModified: guide.lastUpdated,
    author: { '@type': 'Organization', name: SITE.author },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: abs(`/guides/${guide.slug}`),
  };
}

/** Article d'actualité (NewsArticle / BlogPosting). */
export function newsArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.description,
    inLanguage: SITE.lang,
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    author: { '@type': 'Organization', name: SITE.author },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: abs(`/actualites/${post.slug}`),
  };
}

/** Liste ordonnée (ItemList) générique — ex. liste de guides ou d'actualités. */
export function itemListSchema(items: { name: string; path: string }[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: abs(item.path),
    })),
  };
}

/**
 * Le statut du bailleur privé décrit comme un service/programme public
 * (GovernmentService) : aide les moteurs à relier l'entité « dispositif Jeanbrun »
 * au contenu du site.
 */
export function dispositifSchema(faq?: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'Statut du bailleur privé (dispositif Jeanbrun)',
    alternateName: ['Dispositif Jeanbrun', 'Statut du bailleur privé', 'Relance Logement'],
    serviceType: "Dispositif fiscal d'amortissement pour l'investissement locatif",
    description:
      "Régime fiscal permettant aux bailleurs particuliers d'amortir une partie du prix d'un logement loué nu, pour les acquisitions réalisées du 21 février 2026 au 31 décembre 2028.",
    provider: { '@type': 'GovernmentOrganization', name: 'État français' },
    areaServed: { '@type': 'Country', name: 'France' },
    audience: { '@type': 'Audience', audienceType: 'Investisseurs immobiliers particuliers' },
    ...(faq && faq.length
      ? {
          mainEntityOfPage: {
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          },
        }
      : {}),
  };
}
