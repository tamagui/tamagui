import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Slider: track color + radius, active-range fill color + radius, and thumb border/background/hover/press/focus color styling, over the unstyled @tamagui/ui Slider behavior (which keeps fill/clip/positioning + the thumb size mechanism).',
  categories: ['form'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$color',
    '$borderColor',
    '$borderColorHover',
    '$borderColorPress',
    '$outlineColor',
  ],
} satisfies SkinManifest
