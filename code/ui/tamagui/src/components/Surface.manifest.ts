import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'Surface: a copied panel/well/toolbar fixture — a YStack + the composable chrome/interaction facets (filled, outlined, elevated, rounded, interactive) + a `level` prop that shifts the subtree to the surface1-3 sub-theme. Nothing on by default; every facet is opt-in. Generics-only, so it restyles under any re-bound level.',
  categories: ['layout'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$borderColor',
    '$borderColorHover',
    '$borderColorPress',
    '$shadowColor',
    '$outlineColor',
    '$radius',
    '$pressScale',
  ],
  themes: ['surface1', 'surface2', 'surface3'],
} satisfies SkinManifest
