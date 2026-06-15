/**
 * Accès au manifeste de photos généré par scripts/fetch-photos.mjs (API Pexels).
 * Les pages l'utilisent en priorité sur le champ `cover` défini en dur ; en
 * l'absence de photo, le composant Cover affiche une couverture SVG générée.
 */
import manifest from '../data/photos.json';

export interface Photo {
  src: string;
  credit: string;
  alt?: string;
}

const photos = manifest as Record<string, Photo>;

/** Récupère la photo associée à une clé (ex. `guide:mon-slug`, `post:mon-id`, `home:hero`). */
export function photo(key: string): Photo | undefined {
  return photos[key];
}
