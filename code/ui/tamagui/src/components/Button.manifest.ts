import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Button: token-based sizing (size tokens via settings.defaultSize), circular and variant (outlined/quiet) skins, icon + text composition on the unstyled @tamagui/ui Button behavior.',
  categories: ['form', 'buttons'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$borderColor',
    '$borderColorHover',
    '$outlineColor',
    '$color',
  ],
} satisfies SkinManifest
