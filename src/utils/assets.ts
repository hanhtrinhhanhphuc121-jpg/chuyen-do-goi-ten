import boatArtworkSrc from '../assets/image_650fee66.png';
import spriteSheetSrc from '../assets/image_3a4bea0c.png';

/**
 * High-resolution 2D artwork of the boat, teacher, and 41 students of Class 12.2.
 * Imported directly via Vite's asset pipeline so Vite automatically prefixes the base URL
 * (e.g. /chuyen-do-goi-ten/) during production build for GitHub Pages.
 */
export const BOAT_ARTWORK_URL = boatArtworkSrc;

/**
 * Sprite sheet URL for avatar icons.
 */
export const SPRITE_SHEET_ASSET_URL = spriteSheetSrc;

/**
 * Helper to resolve public assets respecting Vite's base path (e.g. for GitHub Pages /chuyen-do-goi-ten/).
 */
export function getAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
