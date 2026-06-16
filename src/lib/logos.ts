/**
 * Accès au manifeste de logos généré par scripts/fetch-logos.mjs.
 * Les pages l'utilisent en priorité ; en l'absence de logo, on affiche le nom
 * de la marque (wordmark) en repli.
 */
import manifest from '../data/logos.json';

export interface BrandLogo {
  src: string;
  name: string;
}

const logos = manifest as Record<string, BrandLogo>;

/** Logo associé à un identifiant de marque (slug), ou undefined. */
export function logo(slug: string): BrandLogo | undefined {
  return logos[slug];
}
