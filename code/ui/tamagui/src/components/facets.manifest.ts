import type { SkinManifest } from './registry-manifest'

export const manifest = {
  type: 'registry:lib',
  description:
    'Composable Surface facets: filled, outlined, elevated, rounded (chrome, static styles only) and interactive (hover/press/focus pseudos). Canonical boolean variants, pure functions of theme generics + conventional variables, spreadable into any styled() variants block. Nothing on by default.',
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
  ],
} satisfies SkinManifest
