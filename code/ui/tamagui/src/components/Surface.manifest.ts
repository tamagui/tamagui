import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'Surface: a copied panel/well/toolbar fixture with composable chrome and interaction facets plus a relative `level` theme boundary. Nothing is on by default; every facet is opt-in.',
  categories: ['layout'],
  tokens: [
    'background',
    'background-hover',
    'background-press',
    'border-color',
    'border-color-hover',
    'border-color-press',
    'shadow-color',
    'outline-color',
  ],
  themes: ['level2', 'level3', 'level4'],
} satisfies SkinManifest
