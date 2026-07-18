import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look ListItem: theme palette, border, cursor, hover/press color styling, text color, the outlined/active appearance, and disabled dimming, over the unstyled @tamagui/ui ListItem behavior (which keeps structural layout + the size mechanism + the disabled pointer-event block).',
  categories: ['data-display'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$borderColor',
    '$borderColorHover',
    '$borderColorPress',
    '$color',
  ],
} satisfies SkinManifest
