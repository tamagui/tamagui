import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Button: token-based sizing (size tokens via settings.defaultSize), circular and variant (outlined/quiet) skins, icon + text composition on the unstyled @tamagui/ui Button behavior.',
  categories: ['form', 'buttons'],
  tokens: [
    'background',
    'background-hover',
    'background-press',
    'border-color',
    'border-color-hover',
    'outline-color',
    'color',
  ],
} satisfies SkinManifest
