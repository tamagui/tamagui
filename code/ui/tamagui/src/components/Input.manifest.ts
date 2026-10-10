import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Input and TextArea: theme palette, border, background, body font, and hover/focus color styling on the unstyled @tamagui/ui Input/TextArea behavior (which keeps only structural sizing + the native outline reset).',
  categories: ['form'],
  tokens: [
    'background',
    'border-color',
    'border-color-hover',
    'border-color-focus',
    'outline-color',
    'color',
  ],
} satisfies SkinManifest
