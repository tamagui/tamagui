import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look RadioGroup: token-based item sizing, theme background/border/focus styling, disabled dimming, and a centered color indicator over the unstyled @tamagui/ui RadioGroup behavior.',
  categories: ['form'],
  tokens: [
    'background',
    'background-hover',
    'background-press',
    'border-color',
    'border-color-hover',
    'border-color-press',
    'outline-color',
    'color',
  ],
} satisfies SkinManifest
