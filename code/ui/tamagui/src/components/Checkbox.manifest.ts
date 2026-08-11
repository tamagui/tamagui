import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Checkbox: token-based sizing, theme background/border/focus styling, disabled dimming, and a centered indicator over the unstyled @tamagui/ui Checkbox behavior.',
  categories: ['form'],
  tokens: [
    'background',
    'background-press',
    'border-color',
    'border-color-hover',
    'border-color-press',
    'outline-color',
  ],
} satisfies SkinManifest
