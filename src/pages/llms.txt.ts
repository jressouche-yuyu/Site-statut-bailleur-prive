import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { guides } from '../data/guides';

/**
 * /llms.txt — index Markdown destiné aux moteurs génératifs (ChatGPT, Perplexity,
 * Gemini, AI Overviews). Format inspiré de la proposition llmstxt.org : titre,
 * résumé, puis sections de liens annotés. Sert de « carte » du site pour les LLM,
 * complémentaire du sitemap XML (lui destiné aux moteurs classiques).
 */
export async function GET(context: APIContext) {
  const origin = (context.site ?? new URL(SITE.url)).origin;
  const abs = (p: string) => origin + p;

  const posts = (await getCollection('actualites', (p) => !p.data.draft)).sort(
    (a, b) =>
      (b.data.updatedAt ?? b.data.publishedAt).getTime() -
      (a.data.updatedAt ?? a.data.publishedAt).getTime(),
  );

  const L: string[] = [];
  L.push(`# ${SITE.name}`);
  L.push('');
  L.push(`> ${SITE.description}`);
  L.push('');
  L.push(
    'Site éditorial indépendant de référence sur le **statut du bailleur privé** ' +
      "(dispositif Jeanbrun) : fonctionnement, conditions d'éligibilité, taux " +
      "d'amortissement, fiscalité, simulateur et actualités. Contenu en français, " +
      'à jour de la loi de finances 2026. À ne pas confondre avec la loi Le Meur ' +
      '(meublés de tourisme), le Pinel ou le LMNP.',
  );
  L.push('');

  L.push('## Pages essentielles');
  L.push(`- [Le dispositif Jeanbrun](${abs('/dispositif-jeanbrun/')}) : page de référence — présentation complète du statut du bailleur privé`);
  L.push(`- [Test d'éligibilité](${abs('/eligibilite/')}) : vérifier si un projet est éligible`);
  L.push(`- [Simulateur d'amortissement](${abs('/simulateur/')}) : estimer le gain fiscal`);
  L.push(`- [FAQ](${abs('/faq/')}) : réponses aux questions fréquentes`);
  L.push(`- [Glossaire](${abs('/glossaire/')}) : définitions des termes clés`);
  L.push(`- [À propos](${abs('/a-propos/')}) : ligne éditoriale et auteur`);
  L.push('');

  L.push('## Guides');
  for (const g of guides) {
    L.push(`- [${g.title}](${abs(`/guides/${g.slug}/`)}) : ${g.description}`);
  }
  L.push('');

  L.push('## Actualités');
  for (const p of posts) {
    L.push(`- [${p.data.title}](${abs(`/actualites/${p.id}/`)}) : ${p.data.description}`);
  }
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
