import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look AlertDialog: scrim background on the Overlay and background/border/padding/radius/elevation on the Content, over the unstyled @tamagui/ui AlertDialog behavior.',
  categories: ['overlay'],
  tokens: ['background', 'border-color'],
  native: [
    'requires a Portal provider at the app root for the alert dialog to mount above content',
  ],
} satisfies SkinManifest
