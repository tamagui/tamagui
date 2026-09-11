import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Popover: token-based padding and radius with theme background and arrow border styling, over the unstyled @tamagui/ui Popover behavior.',
  categories: ['overlay'],
  tokens: ['background', 'border-color'],
  native: [
    'requires a Portal provider at the app root for the popover to mount above content',
  ],
} satisfies SkinManifest
