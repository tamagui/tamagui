import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Dialog: scrim background on the Overlay and background/border/padding/radius/elevation on the Content, over the unstyled @tamagui/ui Dialog behavior (which keeps only positioning + pointer-event bookkeeping).',
  categories: ['overlay'],
  tokens: ['$background', '$borderColor'],
  native: ['requires a Portal provider at the app root for the dialog to mount above content'],
} satisfies SkinManifest
