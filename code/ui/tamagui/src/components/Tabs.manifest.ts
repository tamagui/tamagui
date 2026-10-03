import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Tabs: token-based trigger sizing with theme background, hover/press/focus styling, and disabled dimming over the unstyled @tamagui/ui Tabs behavior.',
  categories: ['navigation'],
  tokens: ['background', 'background-hover', 'background-press', 'outline-color'],
} satisfies SkinManifest
